"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, FileText, Image, Music, Video, Code,
  File, AlertCircle, Upload, FolderOpen,
} from "lucide-react";
import { useTheme } from "./theme-context";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_FILES_PER_UPLOAD = 10;
const MAX_FILES_PER_SESSION = 50;
const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const BLOCKED_EXTENSIONS = [
  ".exe", ".apk", ".bat", ".sh", ".cmd", ".com", ".vbs",
  ".ps1", ".msi", ".dll", ".sys", ".bin",
];

const ALLOWED_TYPES = {
  documents: {
    label: "Documents", icon: FileText, color: "#3B9EFF",
    extensions: [".pdf", ".docx", ".doc", ".txt", ".md", ".pptx", ".ppt", ".xlsx", ".xls", ".csv"],
    mimeTypes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword", "text/plain", "text/markdown",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel", "text/csv",
    ],
  },
  images: {
    label: "Images", icon: Image, color: "#10B981",
    extensions: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  },
  audio: {
    label: "Audio", icon: Music, color: "#8B5CF6",
    extensions: [".mp3", ".wav", ".m4a", ".ogg"],
    mimeTypes: ["audio/mpeg", "audio/wav", "audio/mp4", "audio/ogg"],
  },
  video: {
    label: "Video", icon: Video, color: "#F59E0B",
    extensions: [".mp4", ".mov", ".avi", ".mkv"],
    mimeTypes: ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska"],
  },
  code: {
    label: "Code", icon: Code, color: "#EF4444",
    extensions: [
      ".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".cpp", ".c",
      ".cs", ".go", ".rs", ".rb", ".php", ".swift", ".kt", ".html",
      ".css", ".scss", ".json", ".yaml", ".yml", ".xml", ".sql",
    ],
    mimeTypes: ["text/javascript", "text/typescript", "text/x-python", "text/html", "text/css", "application/json"],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFileCategory(file) {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  for (const [category, config] of Object.entries(ALLOWED_TYPES)) {
    if (config.extensions.includes(ext) || config.mimeTypes.includes(file.type)) return category;
  }
  return null;
}

function getFileIcon(category) {
  if (!category) return File;
  return ALLOWED_TYPES[category]?.icon || File;
}

function getFileColor(category) {
  if (!category) return "rgba(0,0,0,0.45)";
  return ALLOWED_TYPES[category]?.color || "rgba(0,0,0,0.45)";
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function validateFile(file, existingCount) {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (BLOCKED_EXTENSIONS.includes(ext)) return { valid: false, error: `${ext} files are not allowed` };
  if (file.size > MAX_FILE_SIZE_BYTES) return { valid: false, error: `File exceeds ${MAX_FILE_SIZE_MB}MB limit` };
  if (existingCount >= MAX_FILES_PER_SESSION) return { valid: false, error: `Session limit reached` };
  const category = getFileCategory(file);
  if (!category) return { valid: false, error: "Unsupported file type" };
  return { valid: true, category };
}

// ─── File Preview Chip ────────────────────────────────────────────────────────

function FilePreview({ fileItem, onRemove }) {
  const { isDark } = useTheme();
  const { file, category, id, error } = fileItem;
  const Icon = getFileIcon(category);
  const color = getFileColor(category);
  const [hovered, setHovered] = useState(false);
  const isImage = category === "images";
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    if (isImage && file) {
      const url = URL.createObjectURL(file);
      setImgSrc(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isImage]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, x: -8 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.85, x: -8 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", flexShrink: 0,
        display: "flex", alignItems: "center", gap: 8,
        padding: "6px 10px 6px 8px",
        borderRadius: 12,
        background: error
          ? "rgba(239,68,68,0.10)"
          : isDark ? "#38383C" : "rgba(255,255,255,0.88)",
        border: error
          ? "1px solid rgba(239,68,68,0.25)"
          : isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.08)",
        boxShadow: hovered
          ? isDark ? "0 2px 10px rgba(0,0,0,0.25)" : "0 2px 10px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)"
          : isDark ? "none" : "0 1px 4px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
        maxWidth: 180, minWidth: 0,
        cursor: "default",
        transition: "box-shadow 0.15s, border-color 0.15s, background 0.15s",
      }}
    >
      {/* Thumbnail or icon */}
      <div style={{
        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
        overflow: "hidden",
        background: error ? "rgba(239,68,68,0.12)" : `${color}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {isImage && imgSrc ? (
          <img src={imgSrc} alt={file.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : error ? (
          <AlertCircle style={{ width: 14, height: 14, color: "#EF4444" }} />
        ) : (
          <Icon style={{ width: 14, height: 14, color }} />
        )}
      </div>

      {/* File info */}
      <div style={{ minWidth: 0 }}>
        <p style={{
          margin: 0, fontSize: 11.5, fontWeight: 600,
          color: error ? "#EF4444" : isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.78)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          fontFamily: "'Inter', sans-serif", maxWidth: 100,
        }}>
          {file.name}
        </p>
        <p style={{
          margin: 0, fontSize: 10,
          color: error ? "rgba(239,68,68,0.7)" : isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.38)",
          fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap",
        }}>
          {error ? "Invalid file" : formatFileSize(file.size)}
        </p>
      </div>

      {/* Remove button */}
      <AnimatePresence>
        {hovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.1 }}
            onClick={(e) => { e.stopPropagation(); onRemove(id); }}
            style={{
              position: "absolute", top: -4, right: -4,
              width: 16, height: 16, borderRadius: "50%",
              border: "none", cursor: "pointer",
              background: isDark ? "rgba(255,255,255,0.15)" : "rgba(15,15,22,0.82)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.25)", zIndex: 10,
            }}
          >
            <X style={{ width: 9, height: 9, color: "#fff" }} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── File Preview Strip ───────────────────────────────────────────────────────

export function FilePreviewStrip({ files, onFilesChange, disabled = false }) {
  const { isDark } = useTheme();

  const removeFile = useCallback((id) => {
    onFilesChange(files.filter(f => f.id !== id));
  }, [files, onFilesChange]);

  if (files.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ overflow: "hidden" }}
    >
      <div style={{
        padding: "10px 14px 6px",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.05)",
        overflow: "visible",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          overflowX: "auto", overflowY: "visible",
          paddingBottom: 6, paddingTop: 6,
          scrollbarWidth: "none", msOverflowStyle: "none",
        }}>
          <AnimatePresence>
            {files.map(fileItem => (
              <FilePreview key={fileItem.id} fileItem={fileItem} onRemove={removeFile} />
            ))}
          </AnimatePresence>

          {/* File count pill */}
          <div style={{
            flexShrink: 0, alignSelf: "center",
            padding: "3px 10px", borderRadius: 99,
            background: isDark ? "rgba(59,158,255,0.12)" : "rgba(59,158,255,0.08)",
            border: isDark ? "1px solid rgba(59,158,255,0.25)" : "1px solid rgba(59,158,255,0.15)",
            fontSize: 10.5, fontWeight: 600, color: "#3B9EFF",
            fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap",
          }}>
            {files.length} / {MAX_FILES_PER_UPLOAD}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Drop Zone Overlay ────────────────────────────────────────────────────────

function DropZoneOverlay({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "absolute", inset: 0, zIndex: 100, borderRadius: 24,
            background: "rgba(59,158,255,0.06)",
            border: "2px dashed rgba(59,158,255,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(4px)", pointerEvents: "none",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Upload style={{ width: 28, height: 28, color: "#3B9EFF", margin: "0 auto 8px" }} />
            <p style={{ fontSize: 13, fontWeight: 600, color: "#3B9EFF", fontFamily: "'Inter', sans-serif", margin: 0 }}>
              Drop files here
            </p>
            <p style={{ fontSize: 11, color: "rgba(59,158,255,0.7)", fontFamily: "'Inter', sans-serif", margin: "2px 0 0" }}>
              Max {MAX_FILES_PER_UPLOAD} files · {MAX_FILE_SIZE_MB}MB each
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── File Type Picker Popup ───────────────────────────────────────────────────

function FileTypePicker({ onSelect }) {
  const { isDark } = useTheme();

  const types = [
    { key: "all", label: "All Files", icon: FolderOpen, color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)", accept: Object.values(ALLOWED_TYPES).flatMap(t => t.extensions).join(",") },
    { key: "documents", label: "Documents", icon: FileText, color: "#3B9EFF", accept: ALLOWED_TYPES.documents.extensions.join(",") },
    { key: "images", label: "Images", icon: Image, color: "#10B981", accept: ALLOWED_TYPES.images.extensions.join(",") },
    { key: "audio", label: "Audio", icon: Music, color: "#8B5CF6", accept: ALLOWED_TYPES.audio.extensions.join(",") },
    { key: "video", label: "Video", icon: Video, color: "#F59E0B", accept: ALLOWED_TYPES.video.extensions.join(",") },
    { key: "code", label: "Code", icon: Code, color: "#EF4444", accept: ALLOWED_TYPES.code.extensions.join(",") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 8 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      style={{
        position: "absolute", bottom: "calc(100% + 8px)", left: 0,
        zIndex: 200, width: 200,
        background: isDark ? "#2C2C30" : "rgba(255,255,255,0.94)",
        backdropFilter: isDark ? "none" : "blur(40px)",
        WebkitBackdropFilter: isDark ? "none" : "blur(40px)",
        border: isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(255,255,255,0.95)",
        borderRadius: 16,
        boxShadow: isDark
          ? "0 16px 48px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.20)"
          : "0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
        padding: "6px 0",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <p style={{
        margin: 0, padding: "6px 14px 8px",
        fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
      }}>
        Choose File Type
      </p>
      {types.map(({ key, label, icon: Icon, color, accept }) => (
        <button
          key={key}
          onClick={() => onSelect(accept)}
          style={{
            width: "100%", padding: "8px 14px",
            border: "none", background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10,
            fontSize: 12.5, fontWeight: 500,
            color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.72)",
            fontFamily: "'Inter', sans-serif",
            transition: "background 0.1s", textAlign: "left",
          }}
          onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={{
            width: 26, height: 26, borderRadius: 8,
            background: `${color}20`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Icon style={{ width: 13, height: 13, color }} />
          </div>
          {label}
        </button>
      ))}
    </motion.div>
  );
}

// ─── Main FileUploadManager ───────────────────────────────────────────────────

export default function FileUploadManager({ files, onFilesChange, disabled = false }) {
  const { isDark } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);
  const dragCounterRef = useRef(0);

  const addFiles = useCallback((newFiles) => {
    const results = [];
    const newErrors = [];
    Array.from(newFiles).slice(0, MAX_FILES_PER_UPLOAD).forEach(file => {
      const validation = validateFile(file, files.length + results.length);
      if (validation.valid) {
        results.push({ id: `${Date.now()}-${Math.random()}`, file, category: validation.category, error: null });
      } else {
        newErrors.push(`${file.name}: ${validation.error}`);
      }
    });
    if (results.length > 0) onFilesChange([...files, ...results]);
    if (newErrors.length > 0) { setErrors(newErrors); setTimeout(() => setErrors([]), 4000); }
  }, [files, onFilesChange]);

  const handleFileSelect = useCallback((accept) => {
    setShowPicker(false);
    if (fileInputRef.current) { fileInputRef.current.accept = accept; fileInputRef.current.click(); }
  }, []);

  const handleInputChange = useCallback((e) => {
    if (e.target.files?.length) { addFiles(e.target.files); e.target.value = ""; }
  }, [addFiles]);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault(); dragCounterRef.current++;
    if (dragCounterRef.current === 1) setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault(); dragCounterRef.current--;
    if (dragCounterRef.current === 0) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => { e.preventDefault(); }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); dragCounterRef.current = 0; setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  useEffect(() => {
    if (!showPicker) return;
    const handler = () => setShowPicker(false);
    setTimeout(() => document.addEventListener("click", handler), 0);
    return () => document.removeEventListener("click", handler);
  }, [showPicker]);

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ position: "relative" }}
    >
      <DropZoneOverlay visible={isDragging} />

      <input ref={fileInputRef} type="file" multiple onChange={handleInputChange} style={{ display: "none" }} />

      {/* Error toasts */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{
              position: "absolute", bottom: "calc(100% + 8px)", left: 0, right: 0,
              zIndex: 200, background: "rgba(239,68,68,0.92)",
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              borderRadius: 12, padding: "10px 14px",
              boxShadow: "0 8px 24px rgba(239,68,68,0.25)",
            }}
          >
            {errors.map((err, i) => (
              <p key={i} style={{
                margin: i > 0 ? "4px 0 0" : 0,
                fontSize: 12, fontWeight: 500, color: "#fff",
                fontFamily: "'Inter', sans-serif",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <AlertCircle style={{ width: 12, height: 12, flexShrink: 0 }} />
                {err}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attach button */}
      <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
        <AnimatePresence>
          {showPicker && <FileTypePicker onSelect={handleFileSelect} />}
        </AnimatePresence>

        <button
          type="button"
          disabled={disabled || files.length >= MAX_FILES_PER_UPLOAD}
          onClick={() => setShowPicker(v => !v)}
          style={{
            width: 34, height: 34, borderRadius: 9, border: "none",
            background: showPicker
              ? "rgba(59,158,255,0.12)"
              : "transparent",
            cursor: disabled || files.length >= MAX_FILES_PER_UPLOAD ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: disabled || files.length >= MAX_FILES_PER_UPLOAD ? 0.35 : 1,
            transition: "background 0.14s",
            position: "relative",
          }}
          onMouseEnter={e => {
            if (!disabled && files.length < MAX_FILES_PER_UPLOAD && !showPicker)
              e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)";
          }}
          onMouseLeave={e => {
            if (!showPicker) e.currentTarget.style.background = "transparent";
          }}
        >
          {/* Paperclip icon — white in dark mode */}
          <svg
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke={isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.60)"}
            strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>

          {/* File count badge */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                  position: "absolute", top: 3, right: 3,
                  width: 14, height: 14, borderRadius: "50%",
                  background: "linear-gradient(145deg, #60BFFF 0%, #3B9EFF 55%, #1A7AF0 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 8, fontWeight: 700, color: "#fff",
                  fontFamily: "'Inter', sans-serif", pointerEvents: "none",
                }}
              >
                {files.length}
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFileUpload() {
  const [files, setFiles] = useState([]);
  const clearFiles = useCallback(() => setFiles([]), []);
  const getFilePayload = useCallback(() => {
    return files.filter(f => !f.error).map(f => ({
      file: f.file, category: f.category,
      name: f.file.name, size: f.file.size, type: f.file.type,
    }));
  }, [files]);
  return { files, setFiles, clearFiles, getFilePayload };
}