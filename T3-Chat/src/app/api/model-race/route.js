// src/app/api/model-race/route.js
//
// REAL-TIME STREAMING RACE — SSE
// Free model slugs verified March 2026 from openrouter.ai/models
//
// SSE events emitted:
//   { type:"start",  models:[...] }
//   { type:"token",  uiKey, token }
//   { type:"done",   uiKey, text, scores, overall }
//   { type:"ranked", results:[...] }
//   { type:"error",  uiKey, message }

import { NextResponse } from "next/server";

// ── Verified free model pool (March 2026) ─────────────────────────────────────
// All slugs confirmed from https://openrouter.ai/models (costgoat list Mar 10 2026)
const ALL_MODELS = [
  // Meta — confirmed free
  { uiKey:"llama-3-70b",  orSlug:"meta-llama/llama-3.3-70b-instruct:free",          short:"Llama 3.3 70B",    provider:"Meta",          accent:"#5A7A3E", glow:"rgba(90,122,62,0.15)",   icon:"▼" },
  { uiKey:"llama-3-3b",   orSlug:"meta-llama/llama-3.2-3b-instruct:free",           short:"Llama 3.2 3B",     provider:"Meta",          accent:"#4A6A35", glow:"rgba(74,106,53,0.14)",   icon:"▼" },
  // Google — confirmed free
  { uiKey:"gemma-27b",    orSlug:"google/gemma-3-27b-it:free",                      short:"Gemma 3 27B",      provider:"Google",        accent:"#2D6B8A", glow:"rgba(45,107,138,0.15)",  icon:"▲" },
  { uiKey:"gemma-12b",    orSlug:"google/gemma-3-12b-it:free",                      short:"Gemma 3 12B",      provider:"Google",        accent:"#3A7A96", glow:"rgba(58,122,150,0.14)",  icon:"▲" },
  // Mistral — confirmed free
  { uiKey:"mistral-sm",   orSlug:"mistralai/mistral-small-3.1-24b-instruct:free",   short:"Mistral Small 3.1",provider:"Mistral",       accent:"#8A6B1E", glow:"rgba(138,107,30,0.14)",  icon:"★" },
  // Qwen — confirmed free
  { uiKey:"qwen3-80b",    orSlug:"qwen/qwen3-next-80b-a3b-instruct:free",           short:"Qwen3 80B",        provider:"Qwen",          accent:"#7A3A6A", glow:"rgba(122,58,106,0.14)",  icon:"■" },
  // OpenAI OSS — confirmed free
  { uiKey:"gpt-oss-120b", orSlug:"openai/gpt-oss-120b:free",                        short:"GPT-OSS 120B",     provider:"OpenAI",        accent:"#5C7A3E", glow:"rgba(92,122,62,0.15)",   icon:"●" },
  { uiKey:"gpt-oss-20b",  orSlug:"openai/gpt-oss-20b:free",                         short:"GPT-OSS 20B",      provider:"OpenAI",        accent:"#4A7A50", glow:"rgba(74,122,80,0.14)",   icon:"●" },
  // Nvidia — confirmed free
  { uiKey:"nemotron-30b", orSlug:"nvidia/nemotron-3-nano-30b-a3b:free",             short:"Nemotron 30B",     provider:"Nvidia",        accent:"#5A5A8A", glow:"rgba(90,90,138,0.14)",   icon:"◉" },
  // Nous Research — confirmed free
  { uiKey:"hermes-405b",  orSlug:"nousresearch/hermes-3-llama-3.1-405b:free",       short:"Hermes 3 405B",    provider:"Nous Research", accent:"#6B5A8A", glow:"rgba(107,90,138,0.15)",  icon:"◆" },
];

// Judge uses the largest confirmed-free model
const JUDGE_SLUG = "meta-llama/llama-3.3-70b-instruct:free";

const W = { accuracy:0.35, relevance:0.25, depth:0.20, clarity:0.12, concision:0.08 };

function clamp(v) { return Math.min(100, Math.max(0, Math.round(v))); }
function weighted(s) {
  return Math.round(s.accuracy*W.accuracy + s.relevance*W.relevance + s.depth*W.depth + s.clarity*W.clarity + s.concision*W.concision);
}
function heuristic(text="") {
  const base = Math.min(85, Math.max(55, 60 + Math.floor(text.length/80)));
  const code = /```/.test(text) ? 5 : 0;
  const list = /^[-*\d]/m.test(text) ? 3 : 0;
  return { accuracy:clamp(base+code), relevance:clamp(base+list), depth:clamp(base+code+list), clarity:clamp(base), concision:75 };
}

// ── OpenRouter streaming generator ────────────────────────────────────────────
async function* streamModel(orSlug, messages) {
  const key = process.env.OPENROUTER_API_KEY;
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${key}`,
      "HTTP-Referer":  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title":       "CodaAI Model Race",
    },
    body: JSON.stringify({ model:orSlug, max_tokens:400, stream:true, messages }),
  });

  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e?.error?.message ?? `HTTP ${res.status}`);
  }

  const reader  = res.body.getReader();
  const decoder = new TextDecoder();
  let   buf     = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream:true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const raw = line.slice(6).trim();
      if (raw === "[DONE]") return;
      try {
        const token = JSON.parse(raw).choices?.[0]?.delta?.content;
        if (token) yield token;
      } catch {}
    }
  }
}

// ── Blind judge: score one response ───────────────────────────────────────────
async function judgeOne(query, text) {
  const prompt =
    `Score this AI response. You do NOT know which model wrote it — evaluate content only.\n\n` +
    `QUERY: "${query.slice(0,200)}"\n\n` +
    `RESPONSE:\n${text.slice(0,500)}\n\n` +
    `Score 0-100 on: accuracy, relevance, depth, clarity\n` +
    `Respond ONLY with JSON: {"accuracy":85,"relevance":90,"depth":80,"clarity":88}`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer":  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title":       "CodaAI Judge",
      },
      body: JSON.stringify({ model:JUDGE_SLUG, max_tokens:120, stream:false, messages:[{ role:"user", content:prompt }] }),
    });
    const raw   = (await res.json()).choices?.[0]?.message?.content ?? "";
    const clean = raw.replace(/```json|```/g,"").trim();
    const j     = clean.slice(clean.indexOf("{"), clean.lastIndexOf("}")+1);
    const sc    = JSON.parse(j);
    const dims  = { accuracy:clamp(sc.accuracy??70), relevance:clamp(sc.relevance??70), depth:clamp(sc.depth??70), clarity:clamp(sc.clarity??70), concision:75 };
    return { scores:dims, overall:weighted(dims) };
  } catch {
    const dims = heuristic(text);
    return { scores:dims, overall:weighted(dims) };
  }
}

// ── SSE helper ────────────────────────────────────────────────────────────────
function emit(ctrl, payload) {
  ctrl.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`));
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(req) {
  // ── Fix: guard against empty / non-JSON body ──────────────────────────────
  let query = "";
  try {
    const body = await req.json();
    query = body?.query ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid or empty request body" }, { status: 400 });
  }

  if (!query.trim()) return NextResponse.json({ error: "No query provided" }, { status: 400 });
  if (!process.env.OPENROUTER_API_KEY) return NextResponse.json({ error: "OPENROUTER_API_KEY not set" }, { status: 500 });

  const SYSTEM   = "You are a helpful AI assistant. Answer clearly and accurately in 3-6 sentences.";
  const messages = [{ role:"system", content:SYSTEM }, { role:"user", content:query }];

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Announce all models upfront so cards appear immediately
        emit(controller, {
          type:   "start",
          models: ALL_MODELS.map(m => ({ uiKey:m.uiKey, short:m.short, provider:m.provider, accent:m.accent, glow:m.glow, icon:m.icon })),
        });

        const texts  = {};
        const scored = {};

        // All models race in parallel — each streams its own tokens
        await Promise.all(ALL_MODELS.map(async m => {
          try {
            let text = "";
            for await (const token of streamModel(m.orSlug, messages)) {
              text += token;
              emit(controller, { type:"token", uiKey:m.uiKey, token });
            }
            texts[m.uiKey] = text;

            // Score immediately when this model finishes — don't wait for others
            const result = await judgeOne(query, text);
            scored[m.uiKey] = result;
            emit(controller, { type:"done", uiKey:m.uiKey, text, scores:result.scores, overall:result.overall });

          } catch (err) {
            console.warn(`[model-race] ${m.uiKey} failed:`, err.message);
            emit(controller, { type:"error", uiKey:m.uiKey, message:err.message });
          }
        }));

        // Final sorted ranking
        const results = ALL_MODELS
          .filter(m => texts[m.uiKey] && scored[m.uiKey])
          .map(m => ({ uiKey:m.uiKey, short:m.short, provider:m.provider, accent:m.accent, glow:m.glow, icon:m.icon, text:texts[m.uiKey], scores:scored[m.uiKey].scores, overall:scored[m.uiKey].overall }))
          .sort((a,b) => b.overall - a.overall)
          .map((r,i) => ({ ...r, rank:i+1 }));

        emit(controller, { type:"ranked", results });

      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":      "text/event-stream",
      "Cache-Control":     "no-cache, no-transform",
      "Connection":        "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}