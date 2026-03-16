/**
 * lib/openrouter.js
 * Single universal caller — ALL models go through OpenRouter.
 * One API key (OPENROUTER_API_KEY) covers every provider.
 * No SDK dependencies needed. Pure fetch.
 */

const BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Call any model via OpenRouter.
 * @param {object} opts
 * @param {object}   opts.model        - model object from models.js
 * @param {Array}    opts.messages     - [{ role, content }]
 * @param {string}  [opts.systemPrompt]
 * @param {number}  [opts.maxTokens]
 */
export async function callModel({ model, messages, systemPrompt, maxTokens = 1200 }) {
  const t0 = Date.now();

  const chatMessages = [];
  if (systemPrompt) chatMessages.push({ role: "system", content: systemPrompt });
  chatMessages.push(...messages);

  const res = await fetch(BASE_URL, {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer":  process.env.NEXT_PUBLIC_APP_URL ?? "https://localhost:3000",
      "X-Title":       "Codai",
    },
    body: JSON.stringify({
      model:      model.id,       // OpenRouter slug e.g. "anthropic/claude-opus-4-5"
      max_tokens: maxTokens,
      messages:   chatMessages,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `OpenRouter error ${res.status}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? "";

  return {
    modelId:      model.id,
    modelLabel:   model.label,
    provider:     model.provider,
    accent:       model.accent,
    glow:         model.glow,
    icon:         model.icon,
    text,
    inputTokens:  data.usage?.prompt_tokens     ?? 0,
    outputTokens: data.usage?.completion_tokens ?? 0,
    latencyMs:    Date.now() - t0,
    error:        null,
  };
}

/**
 * Race all models in parallel — identical prompt + token budget for every model.
 * Returns array of results as they resolve (via Promise.all).
 */
export async function raceModels(models, messages, systemPrompt, maxTokens = 1200) {
  return Promise.all(
    models.map(model =>
      callModel({ model, messages, systemPrompt, maxTokens }).catch(err => ({
        modelId:      model.id,
        modelLabel:   model.label,
        provider:     model.provider,
        accent:       model.accent,
        glow:         model.glow,
        icon:         model.icon,
        text:         "",
        inputTokens:  0,
        outputTokens: 0,
        latencyMs:    0,
        error:        err?.message ?? "Failed",
      }))
    )
  );
}
