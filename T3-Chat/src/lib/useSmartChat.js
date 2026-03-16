/**
 * lib/useSmartChat.js
 * React hook — drop into any existing chat component.
 *
 *   const { messages, sendMessage, selectRaceResponse, isProcessing, clearHistory }
 *     = useSmartChat({ selectedModelId: "anthropic/claude-sonnet-4-5" });
 *
 * message.type values:
 *   "user"        — user's message
 *   "classifying" — loading placeholder while classifier runs
 *   "routing"     — shows routing decision (simple vs race)
 *   "simple"      — single-model streaming answer
 *   "race"        — multi-model race grid (use <ModelRacePopup>)
 *   "error"       — error bubble
 */

import { useState, useCallback, useRef } from "react";

export function useSmartChat({ selectedModelId, apiPath = "/api/chat" }) {
  const [messages,     setMessages]     = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const abortRef = useRef(null);

  const sendMessage = useCallback(async (query) => {
    if (!query?.trim() || isProcessing) return;
    setIsProcessing(true);

    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Build history from previous user/simple messages for context
    const history = [];
    setMessages(prev => {
      prev.forEach(m => {
        if (m.type === "user")   history.push({ role: "user",      content: m.content });
        if (m.type === "simple") history.push({ role: "assistant", content: m.content ?? "" });
      });
      return prev;
    });

    const userId  = `u-${Date.now()}`;
    const classId = `c-${Date.now()}`;
    let routingId  = "";
    let responseId = "";
    let currentEvent = "";

    setMessages(prev => [
      ...prev,
      { id: userId,  type: "user",        role: "user",      content: query },
      { id: classId, type: "classifying", role: "assistant" },
    ]);

    try {
      const res = await fetch(apiPath, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ query, history, selectedModelId }),
        signal:  controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent = line.slice(7).trim();
            continue;
          }
          if (!line.startsWith("data: ")) continue;

          let data;
          try { data = JSON.parse(line.slice(6)); } catch { continue; }

          switch (currentEvent) {

            case "classification": {
              routingId = `r-${Date.now()}`;
              setMessages(prev => prev.map(m =>
                m.id === classId ? {
                  id:             routingId,
                  type:           "routing",
                  role:           "assistant",
                  routingType:    data.classification.complexity,
                  classification: data.classification,
                } : m
              ));
              break;
            }

            case "routing": {
              setMessages(prev => prev.map(m =>
                m.id === routingId
                  ? { ...m, routingType: data.type, modelLabel: data.model, modelCount: data.modelCount }
                  : m
              ));
              break;
            }

            case "simple_chunk": {
              if (!responseId) {
                responseId = `s-${Date.now()}`;
                setMessages(prev => [...prev, {
                  id: responseId, type: "simple", role: "assistant",
                  content: data.text, streaming: true,
                }]);
              } else {
                setMessages(prev => prev.map(m =>
                  m.id === responseId && m.type === "simple"
                    ? { ...m, content: m.content + data.text }
                    : m
                ));
              }
              break;
            }

            case "simple_done": {
              setMessages(prev => prev.map(m =>
                m.id === responseId && m.type === "simple"
                  ? { ...m, streaming: false, modelUsed: data.modelUsed }
                  : m
              ));
              break;
            }

            case "race_result": {
              if (!responseId) {
                responseId = `race-${Date.now()}`;
                setMessages(prev => [...prev, {
                  id: responseId, type: "race", role: "assistant",
                  results: { [data.modelId]: data },
                  scored:  {},
                  isDone:  false,
                }]);
              } else {
                setMessages(prev => prev.map(m =>
                  m.id === responseId && m.type === "race"
                    ? { ...m, results: { ...m.results, [data.modelId]: data } }
                    : m
                ));
              }
              break;
            }

            case "race_done": {
              const scoredMap = {};
              data.results.forEach(r => { scoredMap[r.modelId] = r; });
              setMessages(prev => prev.map(m =>
                m.id === responseId && m.type === "race"
                  ? { ...m, scored: scoredMap, winner: data.winner, isDone: true }
                  : m
              ));
              break;
            }

            case "error": {
              setMessages(prev => [...prev, {
                id: `e-${Date.now()}`, type: "error", role: "assistant", message: data.message,
              }]);
              break;
            }
          }
          currentEvent = "";
        }
      }

    } catch (err) {
      if (err.name !== "AbortError") {
        setMessages(prev => [...prev, {
          id: `e-${Date.now()}`, type: "error", role: "assistant",
          message: err?.message ?? "Unknown error",
        }]);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, selectedModelId, apiPath]);

  /** Called when user picks a response from the race grid */
  const selectRaceResponse = useCallback((raceMessageId, modelId) => {
    setMessages(prev => prev.map(m =>
      m.id === raceMessageId && m.type === "race"
        ? { ...m, selectedModelId: modelId }
        : m
    ));
  }, []);

  const clearHistory  = useCallback(() => setMessages([]), []);
  const cancelRequest = useCallback(() => { abortRef.current?.abort(); setIsProcessing(false); }, []);

  return { messages, isProcessing, sendMessage, selectRaceResponse, clearHistory, cancelRequest };
}
