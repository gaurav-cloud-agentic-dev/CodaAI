"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Share2, Link, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ShareModal({ isOpen, onClose, shareUrl, onShare, onUnshare, isShared }) {
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    await onShare();
    setIsSharing(false);
  };

  const handleUnshare = async () => {
    await onUnshare();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-amber-900 rounded-2xl shadow-2xl border border-amber-200 dark:border-amber-700 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-amber-200/50 dark:border-amber-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg">
                  <Share2 className="w-5 h-5 text-amber-800 dark:text-amber-300" />
                </div>
                <h3 className="text-lg font-semibold text-amber-950 dark:text-amber-100">
                  Share Conversation
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-amber-800 dark:text-amber-300" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!isShared ? (
                // Before sharing
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/50 rounded-xl">
                    <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-950 dark:text-amber-100 mb-1">
                        Share this conversation
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        Anyone with the link will be able to view this conversation. Your name will be visible.
                      </p>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleShare}
                    disabled={isSharing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSharing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Generating link...
                      </>
                    ) : (
                      <>
                        <Link className="w-5 h-5" />
                        Create Share Link
                      </>
                    )}
                  </motion.button>
                </div>
              ) : (
                // After sharing
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                        Link created successfully!
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-400">
                        Share this link with anyone to let them view your conversation.
                      </p>
                    </div>
                  </div>

                  {/* Share URL */}
                  <div className="relative">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="w-full px-4 py-3 pr-12 bg-amber-50 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-700 rounded-xl text-sm text-amber-900 dark:text-amber-100 outline-none"
                    />
                    <button
                      onClick={handleCopy}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-amber-800 dark:text-amber-300" />
                      )}
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      onClick={handleCopy}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </motion.button>
                    <motion.button
                      onClick={handleUnshare}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2.5 bg-amber-100 dark:bg-amber-800 hover:bg-amber-200 dark:hover:bg-amber-700 text-amber-900 dark:text-amber-100 font-medium rounded-xl transition-colors"
                    >
                      Unshare
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}