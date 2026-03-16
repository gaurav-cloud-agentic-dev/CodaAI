/**
 * lib/scorer.js
 * Blind response scorer — runs via OpenRouter (Haiku), zero SDK dependencies.
 *
 * UNBIASED: model name is NEVER shown to the scorer.
 * Weights (fixed, documented, never change per provider):
 *   accuracy   35%
 *   relevance  25%
 *   depth      20%
 *   clarity    12%
 *   concision   8%
 */

import { callModel }        from "./openrouter.js";
import { CLASSIFIER_MODEL } from "./models.js";

const WEIGHTS = { accuracy: 0.35, relevance: 0.25, depth: 0.20, clarity: 0.12, concision: 0.08 };

const SCORER_SYSTEM = `You are an objective AI response quality evaluator.
You receive a USER QUERY and an AI RESPONSE. You do NOT know which model or company produced the response.
Evaluate purely on content quality.

Score each dimension 0-100:
ACCURACY  — factually correct  (90-100=no errors, 0-39=mostly wrong)
RELEVANCE — addresses query    (90-100=completely, 0-39=off-topic)
DEPTH     — sufficient detail  (90-100=comprehensive, 0-39=too shallow)
CLARITY   — readable+structured(90-100=excellent, 0-39=confusing)
CONCISION — no padding         (90-100=perfect length, 0-39=very padded)

Respond ONLY with valid JSON — no markdown, no extra text:
{"accuracy":<int>,"relevance":<int>,"depth":<int>,"clarity":<int>,"concision":<int>}`;

function computeOverall(scores) {
  return Math.round(
    Object.entries(WEIGHTS).reduce((sum, [k, w]) => sum + (scores[k] ?? 0) * w, 0)
  );
}

function fallbackScore(text) {
  const len      = text.length;
  const hasCode  = /```/.test(text)   ? 5 : 0;
  const hasLists = /^[-*\d]/m.test(text) ? 3 : 0;
  const base     = Math.min(85, Math.max(50, 60 + Math.floor(len / 80)));
  return {
    accuracy:  Math.min(99, base + hasCode),
    relevance: Math.min(99, base + hasLists),
    depth:     Math.min(99, base + hasCode + hasLists),
    clarity:   base,
    concision: Math.max(50, 90 - Math.floor(len / 200)),
  };
}

async function scoreOne(query, responseText) {
  if (!responseText) return { accuracy:0, relevance:0, depth:0, clarity:0, concision:0 };

  const truncated = responseText.length > 2000
    ? responseText.slice(0, 2000) + "\n[truncated]"
    : responseText;

  try {
    const result = await callModel({
      model:        CLASSIFIER_MODEL,
      messages:     [{ role: "user", content: `USER QUERY:\n${query}\n\nAI RESPONSE:\n${truncated}` }],
      systemPrompt: SCORER_SYSTEM,
      maxTokens:    150,
    });

    const raw    = result.text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw);

    return {
      accuracy:  Math.min(100, Math.max(0, Math.round(parsed.accuracy))),
      relevance: Math.min(100, Math.max(0, Math.round(parsed.relevance))),
      depth:     Math.min(100, Math.max(0, Math.round(parsed.depth))),
      clarity:   Math.min(100, Math.max(0, Math.round(parsed.clarity))),
      concision: Math.min(100, Math.max(0, Math.round(parsed.concision))),
    };
  } catch {
    return fallbackScore(responseText);
  }
}

/** Score all results in parallel, blind — returns sorted desc by overall with rank */
export async function scoreRaceResults(query, results) {
  const scored = await Promise.all(
    results.map(async result => {
      if (result.error || !result.text) {
        return { ...result, scores: { accuracy:0, relevance:0, depth:0, clarity:0, concision:0 }, overall: 0 };
      }
      const scores  = await scoreOne(query, result.text);
      const overall = computeOverall(scores);
      return { ...result, scores, overall };
    })
  );

  const sorted = [...scored].sort((a, b) => b.overall - a.overall);
  sorted.forEach((r, i) => { r.rank = i + 1; });
  return sorted;
}
