/**
 * lib/models.js
 * All models routed through OpenRouter — ONE key, every provider.
 * OpenRouter model slugs: https://openrouter.ai/models
 */

export const ALL_MODELS = [
  // ── Anthropic (Claude)
  { id: "anthropic/claude-opus-4-5",           label: "Claude Opus 4.5",    short: "Opus 4.5",     provider: "Anthropic", accent: "#c4613a", glow: "rgba(196,97,58,0.22)",   icon: "◆", tier: "strong"   },
  { id: "anthropic/claude-sonnet-4-5",         label: "Claude Sonnet 4.5",  short: "Sonnet 4.5",   provider: "Anthropic", accent: "#d4814a", glow: "rgba(212,129,74,0.20)",  icon: "◆", tier: "balanced" },
  { id: "anthropic/claude-haiku-4-5",          label: "Claude Haiku 4.5",   short: "Haiku 4.5",    provider: "Anthropic", accent: "#e8965a", glow: "rgba(232,150,90,0.20)",  icon: "◆", tier: "fast"     },

  // ── OpenAI
  { id: "openai/gpt-4o",                       label: "GPT-4o",             short: "GPT-4o",       provider: "OpenAI",    accent: "#1a7a4a", glow: "rgba(26,122,74,0.20)",   icon: "●", tier: "strong"   },
  { id: "openai/gpt-4o-mini",                  label: "GPT-4o Mini",        short: "4o Mini",      provider: "OpenAI",    accent: "#2da866", glow: "rgba(45,168,102,0.18)",  icon: "●", tier: "fast"     },
  { id: "openai/o3-mini",                      label: "OpenAI o3-mini",     short: "o3-mini",      provider: "OpenAI",    accent: "#156040", glow: "rgba(21,96,64,0.18)",    icon: "●", tier: "strong"   },

  // ── Google
  { id: "google/gemini-2.0-flash-001",         label: "Gemini 2.0 Flash",   short: "Gemini Flash", provider: "Google",    accent: "#1e56b0", glow: "rgba(30,86,176,0.20)",   icon: "▲", tier: "fast"     },
  { id: "google/gemini-2.5-pro-preview",       label: "Gemini 2.5 Pro",     short: "Gemini Pro",   provider: "Google",    accent: "#1840a0", glow: "rgba(24,64,160,0.20)",   icon: "▲", tier: "strong"   },

  // ── xAI
  { id: "x-ai/grok-3",                         label: "Grok-3",             short: "Grok-3",       provider: "xAI",       accent: "#6b32c8", glow: "rgba(107,50,200,0.20)",  icon: "■", tier: "strong"   },
  { id: "x-ai/grok-3-mini",                    label: "Grok-3 Mini",        short: "Grok Mini",    provider: "xAI",       accent: "#8b52e0", glow: "rgba(139,82,224,0.18)",  icon: "■", tier: "fast"     },

  // ── DeepSeek
  { id: "deepseek/deepseek-chat",              label: "DeepSeek V3",        short: "DeepSeek V3",  provider: "DeepSeek",  accent: "#0e7090", glow: "rgba(14,112,144,0.20)",  icon: "◉", tier: "strong"   },
  { id: "deepseek/deepseek-r1",               label: "DeepSeek R1",        short: "DeepSeek R1",  provider: "DeepSeek",  accent: "#0a8aaa", glow: "rgba(10,138,170,0.18)",  icon: "◉", tier: "strong"   },

  // ── Meta
  { id: "meta-llama/llama-4-maverick",         label: "Llama 4 Maverick",   short: "Llama 4",      provider: "Meta",      accent: "#1a6aff", glow: "rgba(26,106,255,0.18)",  icon: "▼", tier: "strong"   },
  { id: "meta-llama/llama-3.3-70b-instruct",   label: "Llama 3.3 70B",      short: "Llama 3.3",    provider: "Meta",      accent: "#0866ff", glow: "rgba(8,102,255,0.18)",   icon: "▼", tier: "balanced" },

  // ── Mistral
  { id: "mistralai/mistral-large",             label: "Mistral Large",      short: "Mistral",      provider: "Mistral",   accent: "#92500a", glow: "rgba(146,80,10,0.18)",   icon: "★", tier: "strong"   },
  { id: "mistralai/mistral-small",             label: "Mistral Small",      short: "Mistral Sm",   provider: "Mistral",   accent: "#b8600a", glow: "rgba(184,96,10,0.16)",   icon: "★", tier: "fast"     },
];

/**
 * RACE_MODELS — one strong model per provider, equal seats, no bias.
 * Change this array to customise which models compete.
 */
export const RACE_MODELS = ALL_MODELS.filter(m => [
  "anthropic/claude-opus-4-5",
  "openai/gpt-4o",
  "google/gemini-2.5-pro-preview",
  "x-ai/grok-3",
  "deepseek/deepseek-chat",
  "meta-llama/llama-4-maverick",
  "mistralai/mistral-large",
].includes(m.id));

/**
 * CLASSIFIER_MODEL — cheap + fast, used only for classify & score steps.
 * Never competes in races. Using Haiku via OpenRouter.
 */
export const CLASSIFIER_MODEL = ALL_MODELS.find(m => m.id === "anthropic/claude-haiku-4-5");

export function getModel(id) {
  return ALL_MODELS.find(m => m.id === id);
}
