import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

function supportsThinking(modelId) {
  if (!modelId) return false;
  const id = modelId.toLowerCase();
  return (
    id.includes("deepseek-r1") ||
    /openai\/o\d/.test(id) ||
    (id.includes("anthropic/claude") && (id.includes("3-7") || id.includes("3.7"))) ||
    id.includes("thinking") ||
    id.includes("grok-3-mini")
  );
}

function encodeChunk(type, text) {
  const b64 = Buffer.from(text, "utf8").toString("base64");
  return `${type}:${b64}\n`;
}

export async function POST(req) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const {
      conversationId,
      content,
      modelId,
      modelName,
      previousMessages,
      skipSaveUserMessage, // ← true when initializeChat already saved this message
    } = await req.json();

    // Only save the user message if initializeChat hasn't already done it
    if (!skipSaveUserMessage) {
      await prisma.message.create({
        data: {
          conversationId,
          userId: session.user.id,
          role: "user",
          content,
          messageType: "normal",
        },
      });
    }

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date(), modelId, modelName },
    });

    const messages = [...previousMessages, { role: "user", content }];
    const hasThinking = supportsThinking(modelId);

    const requestBody = {
      model: modelId,
      messages,
      stream: true,
      ...(hasThinking && {
        reasoning: { effort: "high" },
      }),
    };

    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "CodaAI",
      },
      body: JSON.stringify(requestBody),
    });

    if (!aiRes.ok) {
      const err = await aiRes.text();
      return new Response(err, { status: aiRes.status });
    }

    let fullContent = "";
    let fullThinking = "";
    const reader = aiRes.body.getReader();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const enqueue = (str) => controller.enqueue(new TextEncoder().encode(str));

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

            for (const line of lines) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta;
                if (!delta) continue;

                const thinkingText = delta.reasoning || "";
                const contentText = delta.content || "";

                if (thinkingText) {
                  fullThinking += thinkingText;
                  enqueue(encodeChunk("T", thinkingText));
                }

                if (contentText) {
                  fullContent += contentText;
                  enqueue(encodeChunk("C", contentText));
                }
              } catch {
                // Malformed JSON chunk — skip
              }
            }
          }
        } finally {
          await prisma.message.create({
            data: {
              conversationId,
              userId: session.user.id,
              role: "assistant",
              content: fullContent,
              messageType: "normal",
              ...(fullThinking && { thinking: fullThinking }),
            },
          });

          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Accel-Buffering": "no",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}