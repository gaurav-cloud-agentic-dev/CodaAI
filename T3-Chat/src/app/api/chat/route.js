// ↑ Updated: dynamic thinking detection, no hardcoded model list
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Detect thinking support by pattern-matching the model ID.
 * Covers free variants (e.g. deepseek/deepseek-r1:free) automatically.
 */
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

// Custom stream protocol:
//   thinking chunks  → "T:" + base64(text) + "\n"
//   content  chunks  → "C:" + base64(text) + "\n"
// Using base64 so newlines inside chunks don't break the line protocol.
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

    const { conversationId, content, modelId, modelName, previousMessages } =
      await req.json();

    // Save user message
    await prisma.message.create({
      data: {
        conversationId,
        userId: session.user.id,
        role: "user",
        content,
        messageType: "normal",
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date(), modelId, modelName },
    });

    const messages = [...previousMessages, { role: "user", content }];

    const hasThinking = supportsThinking(modelId);

    // Build request body — enable reasoning for supported models
    const requestBody = {
      model: modelId,
      messages,
      stream: true,
      ...(hasThinking && {
        reasoning: { effort: "high" }, // OpenRouter unified reasoning param
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

                // OpenRouter surfaces reasoning in delta.reasoning (string)
                // and normal content in delta.content (string)
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
          // Save AI response to DB after streaming completes
          await prisma.message.create({
            data: {
              conversationId,
              userId: session.user.id,
              role: "assistant",
              content: fullContent,
              // Save thinking separately if your schema supports it,
              // otherwise store as metadata or just ignore
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
        "X-Accel-Buffering": "no", // Disable nginx buffering for streaming
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}