/**
 * lib/classifier.js
 * Classifies query complexity via OpenRouter (Haiku — cheap + fast).
 * No Anthropic SDK. Pure fetch via OpenRouter.
 */

import { callModel, CLASSIFIER_MODEL_SLUG } from "./openrouter.js";
import { CLASSIFIER_MODEL } from "./models.js";

const SYSTEM = `You are a query complexity classifier for an AI routing system.
Analyse the user message and respond ONLY with a valid JSON object — no markdown, no extra text.

SIMPLE  → short answer, single-step, conversational, basic fact lookup, greetings,
           unit conversions, yes/no, code < 20 lines, easy explanation.

COMPLEX → genuinely benefits from multiple independent expert perspectives:
           system/architecture design, multi-file debugging, advanced math/proofs,
           trade-off analysis, research synthesis, long-form writing,
           anything where different AI models would give meaningfully different answers.

When borderline → classify COMPLEX. Better to race than miss depth.

Respond ONLY with this JSON (no markdown):
{
  "complexity": "simple" | "complex",
  "category": "conversational" | "factual" | "coding-simple" | "coding-complex" | "math-simple" | "math-complex" | "writing-simple" | "writing-complex" | "reasoning" | "research" | "creative" | "analysis",
  "confidence": <float 0.0-1.0>,
  "reason": "<one sentence>",
  "suggestedTokenBudget": <integer 100-2000>,
  "requiresRealtime": <boolean>
}`;

export async function classifyQuery(userQuery, conversationHistory = []) {
  // Include last 4 messages for follow-up context
  const context = conversationHistory
    .slice(-4)
    .map(m => `${m.role.toUpperCase()}: ${m.content.slice(0, 200)}`)
    .join("\n");

  const prompt = context
    ? `CONVERSATION CONTEXT:\n${context}\n\nNEW QUERY TO CLASSIFY:\n${userQuery}`
    : userQuery;

  try {
    const result = await callModel({
      model:      CLASSIFIER_MODEL,
      messages:   [{ role: "user", content: prompt }],
      systemPrompt: SYSTEM,
      maxTokens:  300,
    });

    const raw    = result.text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw);

    if (!parsed.complexity || !parsed.category) throw new Error("incomplete JSON");

    return {
      complexity:           parsed.complexity,
      category:             parsed.category,
      confidence:           parsed.confidence           ?? 0.7,
      reason:               parsed.reason               ?? "Classified automatically.",
      suggestedTokenBudget: parsed.suggestedTokenBudget ?? 600,
      requiresRealtime:     parsed.requiresRealtime     ?? false,
    };

  } catch (err) {
    console.error("[classifier] error:", err.message);
    // Safe fallback — complex means the user always gets the best answer
    return {
      complexity:           "complex",
      category:             "reasoning",
      confidence:           0.5,
      reason:               "Classifier error — defaulting to multi-model for safety.",
      suggestedTokenBudget: 800,
      requiresRealtime:     false,
    };
  }
}
