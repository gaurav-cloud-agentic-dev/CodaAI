"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github.css';
import { useTheme } from "../chat/theme-context";
import { useState, useCallback } from "react";
import { Copy, Check, X, ZoomIn, Download } from "lucide-react";

// ─── Global hljs background fix (injected once) ───────────────────────────────
const HLJS_RESET = `
  .hljs-light-scope .hljs,
  .hljs-light-scope code.hljs {
    background: transparent !important;
    color: #24292e !important;
  }
  .hljs-dark-scope .hljs,
  .hljs-dark-scope code.hljs {
    background: transparent !important;
    color: #E2E8F0 !important;
  }
  .hljs-dark-scope .hljs-keyword   { color: #F92672 !important; }
  .hljs-dark-scope .hljs-string    { color: #A6E22E !important; }
  .hljs-dark-scope .hljs-comment   { color: #75715E !important; }
  .hljs-dark-scope .hljs-number    { color: #AE81FF !important; }
  .hljs-dark-scope .hljs-function  { color: #66D9EF !important; }
  .hljs-dark-scope .hljs-title     { color: #66D9EF !important; }
  .hljs-dark-scope .hljs-variable  { color: #FD971F !important; }
  .hljs-dark-scope .hljs-attr      { color: #A6E22E !important; }
  .hljs-dark-scope .hljs-tag       { color: #F92672 !important; }
  .hljs-dark-scope .hljs-name      { color: #F92672 !important; }
  .hljs-dark-scope .hljs-built_in  { color: #66D9EF !important; }
  .hljs-dark-scope .hljs-literal   { color: #AE81FF !important; }
  .hljs-dark-scope .hljs-type      { color: #66D9EF !important; }
  .hljs-dark-scope .hljs-params    { color: #FD971F !important; }
  .hljs-dark-scope .hljs-property  { color: #A6E22E !important; }
`;

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text, isDark }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      title="Copy code"
      style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "4px 10px", borderRadius: 7,
        border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.15)"}`,
        background: copied
          ? "rgba(16,185,129,0.18)"
          : (isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"),
        color: copied ? "#10B981" : (isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.50)"),
        cursor: "pointer", fontSize: 11, fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        transition: "all 0.15s ease",
        flexShrink: 0,
      }}
      onMouseEnter={e => { if (!copied) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)"; }}
      onMouseLeave={e => { if (!copied) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"; }}
    >
      {copied
        ? <><Check style={{ width: 11, height: 11 }} /> Copied!</>
        : <><Copy style={{ width: 11, height: 11 }} /> Copy</>
      }
    </button>
  );
}

// ─── Helper: extract plain text from React children ───────────────────────────
function extractText(children) {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (children?.props?.children) return extractText(children.props.children);
  return "";
}

// ─── Code Block ───────────────────────────────────────────────────────────────
function CodeBlock({ className, children, isDark }) {
  const language = className?.replace("language-", "") || "text";
  const codeText = extractText(children).replace(/\n$/, "");

  const bg        = isDark ? "#161616" : "#F6F7F8";
  const headerBg  = isDark ? "#1A1A1A" : "#EDEDEE";
  const border    = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.10)";
  const dotColors = ["#FF5F57", "#FEBC2E", "#28C840"];

  return (
    <>
      <style>{HLJS_RESET}</style>
      <div
        className={isDark ? "hljs-dark-scope" : "hljs-light-scope"}
        style={{
          borderRadius: 12, overflow: "hidden",
          border: `1px solid ${border}`,
          margin: "12px 0",
          boxShadow: isDark
            ? "0 4px 20px rgba(0,0,0,0.40)"
            : "0 2px 8px rgba(0,0,0,0.07)",
        }}
      >
        {/* Header bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "9px 14px",
          background: headerBg,
          borderBottom: `1px solid ${border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Traffic lights */}
            <div style={{ display: "flex", gap: 6 }}>
              {dotColors.map((c, i) => (
                <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: c, opacity: 0.85 }} />
              ))}
            </div>
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)",
              fontFamily: "monospace", letterSpacing: "0.05em",
              textTransform: "lowercase",
            }}>
              {language}
            </span>
          </div>
          <CopyButton text={codeText} isDark={isDark} />
        </div>

        {/* Code body */}
        <pre style={{
          background: bg,
          margin: 0, padding: "16px",
          overflowX: "auto",
          fontSize: "0.84em",
          lineHeight: 1.65,
          border: "none",
          outline: "none",
          boxSizing: "border-box",
        }}>
          <code
            className={className}
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              color: isDark ? "#E2E8F0" : "#24292e",
              background: "transparent",
            }}
          >
            {children}
          </code>
        </pre>
      </div>
    </>
  );
}

// ─── Image Lightbox ───────────────────────────────────────────────────────────
function ImageLightbox({ src, alt, onClose }) {
  const handleDownload = async () => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = alt || "image";
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "fadeIn 0.15s ease",
      }}
    >
      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }`}</style>

      {/* Controls */}
      <div
        style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 10 }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleDownload}
          style={{
            width: 38, height: 38, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.70)", cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.10)"}
          title="Download"
        >
          <Download style={{ width: 16, height: 16 }} />
        </button>
        <button
          onClick={onClose}
          style={{
            width: 38, height: 38, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.70)", cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.10)"}
          title="Close"
        >
          <X style={{ width: 16, height: 16 }} />
        </button>
      </div>

      {/* Image */}
      <img
        src={src}
        alt={alt || "Image"}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: "90vw", maxHeight: "88vh",
          objectFit: "contain", borderRadius: 12,
          boxShadow: "0 32px 80px rgba(0,0,0,0.70)",
          animation: "scaleIn 0.18s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      />
      <style>{`@keyframes scaleIn { from { transform: scale(0.92); opacity:0 } to { transform: scale(1); opacity:1 } }`}</style>

      {/* Alt caption */}
      {alt && (
        <p style={{
          position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
          fontSize: 12, color: "rgba(255,255,255,0.40)", fontFamily: "'Inter', sans-serif",
          whiteSpace: "nowrap", pointerEvents: "none",
        }}>
          {alt}
        </p>
      )}
    </div>
  );
}

// ─── Smart Image ──────────────────────────────────────────────────────────────
function SmartImage({ src, alt, isDark }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const wrapBg     = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const wrapBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)";

  return (
    <>
      <div style={{
        margin: "12px 0",
        borderRadius: 12, overflow: "hidden",
        border: `1px solid ${wrapBorder}`,
        background: wrapBg,
        display: "inline-block", maxWidth: "100%",
        boxShadow: isDark
          ? "0 4px 20px rgba(0,0,0,0.40)"
          : "0 2px 12px rgba(0,0,0,0.08)",
      }}>
        {/* Image label bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "7px 12px",
          background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
          borderBottom: `1px solid ${wrapBorder}`,
        }}>
          <span style={{
            fontSize: 10.5, fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.35)",
            fontFamily: "'Inter', sans-serif",
          }}>
            {alt || "Image created"}
          </span>
          <button
            onClick={() => setLightboxOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "none", border: "none", cursor: "pointer", padding: 0,
              fontSize: 10.5, fontWeight: 500,
              color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.38)",
              fontFamily: "'Inter', sans-serif",
              transition: "color 0.14s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.70)" : "rgba(0,0,0,0.65)"}
            onMouseLeave={e => e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.38)"}
          >
            <ZoomIn style={{ width: 12, height: 12 }} /> Preview
          </button>
        </div>

        {/* Image itself */}
        <div
          style={{ position: "relative", cursor: "zoom-in" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={src}
            alt={alt || "Image"}
            onLoad={() => setLoaded(true)}
            style={{
              display: "block", maxWidth: "100%", maxHeight: 480,
              objectFit: "contain",
              transform: hovered ? "scale(1.015)" : "scale(1)",
              filter: hovered ? "brightness(1.04)" : "brightness(1)",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.3s ease, transform 0.22s ease, filter 0.22s ease",
            }}
          />
          {/* Hover overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.18s ease",
            pointerEvents: "none",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(0,0,0,0.55)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.25)",
            }}>
              <ZoomIn style={{ width: 18, height: 18, color: "white" }} />
            </div>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          src={src}
          alt={alt}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}

// ─── Main Renderer ────────────────────────────────────────────────────────────
export function MarkdownRenderer({ content }) {
  const { isDark } = useTheme();

  const text        = isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.78)";
  const headingText = isDark ? "#FFFFFF"                : "rgba(0,0,0,0.88)";
  const codeBg      = isDark ? "#1E1E1E"                : "#F3F4F6";
  const codeText    = isDark ? "#E5E7EB"                : "#1F2937";
  const blockBorder = isDark ? "rgba(255,255,255,0.18)" : "#D1D5DB";
  const blockText   = isDark ? "rgba(255,255,255,0.50)" : "#4B5563";
  const linkColor   = isDark ? "#60A5FA"                : "#3B82F6";
  const strongColor = isDark ? "#FFFFFF"                : "rgba(0,0,0,0.88)";
  const hrColor     = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)";
  const thBorder    = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)";
  const tdBorder    = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{

        // ── Code ──────────────────────────────────────────────────────────────
        code({ inline, className, children, ...props }) {
          const isInline = inline ?? !(className || String(children).includes('\n'));
          if (isInline) {
            return (
              <code
                style={{
                  background: codeBg, color: codeText,
                  padding: "2px 6px", borderRadius: 5,
                  fontSize: "0.85em", fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                }}
                {...props}
              >
                {children}
              </code>
            );
          }
          return <CodeBlock className={className} isDark={isDark}>{children}</CodeBlock>;
        },

        // Strip the <pre> wrapper since CodeBlock handles its own
        pre({ children }) {
          return <>{children}</>;
        },

        // ── Images ────────────────────────────────────────────────────────────
        img({ src, alt }) {
          return <SmartImage src={src} alt={alt} isDark={isDark} />;
        },

        // ── Paragraphs ────────────────────────────────────────────────────────
        p({ children }) {
          const hasBlock = Array.isArray(children)
            ? children.some(c => c?.type === 'pre' || c?.type === 'div')
            : children?.type === 'pre' || children?.type === 'div';
          return hasBlock
            ? <div style={{ marginBottom: 10, lineHeight: 1.75, color: text }}>{children}</div>
            : <p style={{ margin: "0 0 10px", lineHeight: 1.75, color: text }}>{children}</p>;
        },

        // ── Lists ─────────────────────────────────────────────────────────────
        ul: ({ children }) => (
          <ul style={{ listStyleType: "disc", paddingLeft: 22, margin: "4px 0 10px", color: text }}>
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol style={{ listStyleType: "decimal", paddingLeft: 22, margin: "4px 0 10px", color: text }}>
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li style={{ lineHeight: 1.75, marginBottom: 3, color: text }}>{children}</li>
        ),

        // ── Headings ─────────────────────────────────────────────────────────
        h1: ({ children }) => (
          <h1 style={{ fontSize: "1.5em", fontWeight: 700, margin: "18px 0 8px", color: headingText, lineHeight: 1.3 }}>
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 style={{ fontSize: "1.25em", fontWeight: 700, margin: "16px 0 6px", color: headingText, lineHeight: 1.3 }}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 style={{ fontSize: "1.1em", fontWeight: 600, margin: "14px 0 5px", color: headingText, lineHeight: 1.3 }}>
            {children}
          </h3>
        ),

        // ── Blockquote ────────────────────────────────────────────────────────
        blockquote: ({ children }) => (
          <blockquote style={{
            borderLeft: `3px solid ${blockBorder}`,
            fontStyle: "italic", color: blockText,
            margin: "10px 0",
            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
            borderRadius: "0 8px 8px 0",
            padding: "8px 14px",
          }}>
            {children}
          </blockquote>
        ),

        // ── Links ─────────────────────────────────────────────────────────────
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: linkColor, textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
            onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
          >
            {children}
          </a>
        ),

        // ── Inline formatting ─────────────────────────────────────────────────
        strong: ({ children }) => (
          <strong style={{ fontWeight: 600, color: strongColor }}>{children}</strong>
        ),
        em: ({ children }) => (
          <em style={{ fontStyle: "italic", color: text }}>{children}</em>
        ),

        // ── HR ────────────────────────────────────────────────────────────────
        hr: () => (
          <hr style={{ border: "none", borderTop: `1px solid ${hrColor}`, margin: "16px 0" }} />
        ),

        // ── Tables ────────────────────────────────────────────────────────────
        table: ({ children }) => (
          <div style={{
            overflowX: "auto", margin: "12px 0",
            borderRadius: 10, overflow: "hidden",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)"}`,
          }}>
            <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "0.9em" }}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }}>
            {children}
          </thead>
        ),
        th: ({ children }) => (
          <th style={{
            padding: "9px 14px", textAlign: "left", fontWeight: 600,
            color: headingText,
            borderBottom: `2px solid ${thBorder}`,
            fontFamily: "'Inter', sans-serif", fontSize: "0.88em",
            letterSpacing: "0.02em",
          }}>
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td style={{
            padding: "8px 14px", color: text,
            borderBottom: `1px solid ${tdBorder}`,
          }}>
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}