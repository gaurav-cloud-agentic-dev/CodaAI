"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Search, Star, Eye, Info, X, ChevronRight, Filter, Check, Wrench, FileText, Calendar, TrendingUp } from "lucide-react";

const ModelSelector = ({ isOpen, onClose, selectedModel, onSelectModel }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteModels, setFavoriteModels] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [infoModel, setInfoModel] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchModels();
    }
  }, [isOpen]);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/get-models");
      const data = await response.json();
      setModels(data.models || []);
    } catch (error) {
      console.error("Failed to fetch models:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (modelId) => {
    setFavoriteModels((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId]
    );
  };

  const allowedCompanies = ['openai', 'google', 'anthropic', 'meta-llama', 'x-ai', 'deepseek'];

  const groupedModels = models.reduce((acc, model) => {
    const company = model.id.split("/")[0]?.toLowerCase() || "other";
    
    if (!allowedCompanies.includes(company)) return acc;
    
    if (!acc[company]) {
      acc[company] = [];
    }
    acc[company].push(model);
    return acc;
  }, {});

  useEffect(() => {
    if (isOpen && !selectedCompany && Object.keys(groupedModels).length > 0) {
      setSelectedCompany(Object.keys(groupedModels)[0]);
    }
  }, [isOpen, groupedModels]);

  const filteredModels = selectedCompany && groupedModels[selectedCompany]
    ? groupedModels[selectedCompany].filter(
        (model) =>
          model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getPricingDisplay = (model) => {
    if (!model.pricing) return "";
    const promptPrice = parseFloat(model.pricing.prompt || 0);
    if (promptPrice === 0) return "FREE";
    if (promptPrice < 0.0001) return "$";
    if (promptPrice < 0.001) return "$$";
    return "$$$";
  };

  const getCompanyIcon = (company) => {
    const icons = {
      anthropic: "/icons/anthropic.png",
      openai: "/icons/openai.png", 
      google: "/icons/google.png",
      "meta-llama": "/icons/meta.png",
      "x-ai": "/icons/xai.png",
      deepseek: "/icons/deepseek.png",
    };
    return icons[company.toLowerCase()] || null;
  };

  const getCompanyDisplayName = (company) => {
    const names = {
      anthropic: "Anthropic",
      openai: "OpenAI",
      google: "Google",
      "meta-llama": "Meta",
      "x-ai": "xAI",
      deepseek: "DeepSeek",
    };
    return names[company.toLowerCase()] || company;
  };

  const CompanyIconDisplay = ({ company, size = "small" }) => {
    const iconPath = getCompanyIcon(company);
    const sizeClasses = size === "large" ? "w-9 h-9" : "w-8 h-8";
    const iconSize = size === "large" ? "w-5 h-5" : "w-4.5 h-4.5";
    
    if (iconPath) {
      return (
        <div className={`${sizeClasses} bg-amber-100/60 dark:bg-amber-800/60 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-amber-200 dark:border-amber-700`}>
          <img src={iconPath} alt={company} className={`${iconSize} object-contain`} />
        </div>
      );
    }
    
    const emojiMap = {
      anthropic: "🤖",
      openai: "⚡",
      google: "🔷",
      "meta-llama": "∞",
      "x-ai": "𝕏",
      deepseek: "🔍",
    };
    
    return (
      <div className={`${sizeClasses} bg-amber-100/60 dark:bg-amber-800/60 rounded-lg flex items-center justify-center text-base flex-shrink-0 border border-amber-200 dark:border-amber-700`}>
        {emojiMap[company.toLowerCase()] || "🔹"}
      </div>
    );
  };

  // Get random feature badges for each model
  const getModelFeatures = (modelId) => {
    const allFeatures = [
      { icon: Eye, label: "Vision", color: "bg-gradient-to-r from-emerald-500 to-green-600" },
      { icon: Wrench, label: "Tool Calling", color: "bg-gradient-to-r from-orange-500 to-red-600" },
      { icon: FileText, label: "PDF Comprehension", color: "bg-gradient-to-r from-purple-500 to-violet-600" },
      { icon: FileText, label: "Code Generation", color: "bg-gradient-to-r from-blue-500 to-cyan-600" },
      { icon: FileText, label: "Reasoning", color: "bg-gradient-to-r from-pink-500 to-rose-600" },
      { icon: FileText, label: "Long Context", color: "bg-gradient-to-r from-indigo-500 to-purple-600" },
    ];
    
    // Generate consistent random features based on model ID
    const hash = modelId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const startIndex = hash % allFeatures.length;
    return [
      allFeatures[startIndex % allFeatures.length],
      allFeatures[(startIndex + 1) % allFeatures.length],
      allFeatures[(startIndex + 2) % allFeatures.length],
    ];
  };

  // Model Info Dialog Component
  const ModelInfoDialog = ({ model, onClose }) => {
    if (!model) return null;

    const company = model.id.split("/")[0]?.toLowerCase() || "other";
    const features = getModelFeatures(model.id);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900 dark:via-orange-900 dark:to-yellow-900 rounded-2xl shadow-2xl border-2 border-amber-200 dark:border-amber-700 overflow-hidden"
          style={{ maxHeight: '90vh' }}
        >
          {/* Header */}
          <div className="p-6 border-b-2 border-amber-200 dark:border-amber-700 bg-white/40 dark:bg-amber-950/40">
            <div className="flex items-start gap-4">
              <CompanyIconDisplay company={company} size="large" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h2 className="text-2xl font-bold text-amber-950 dark:text-amber-50">
                    {getCompanyDisplayName(company)}: {model.name}
                  </h2>
                  {getPricingDisplay(model) && (
                    <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold rounded-lg shadow-md">
                      {getPricingDisplay(model)}
                    </span>
                  )}
                  {model.context_length > 100000 && (
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-lg shadow-md">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">
                  {model.description?.split('.')[0] || "Lightning-fast with surprising capability"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-amber-200 dark:hover:bg-amber-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-amber-900 dark:text-amber-200" />
              </button>
            </div>
          </div>

          {/* Content - Custom Scrollbar */}
          <div className="p-6 overflow-y-auto modern-scrollbar" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            {/* Description */}
            <div className="mb-6 bg-white/50 dark:bg-amber-950/50 p-4 rounded-xl border border-amber-200 dark:border-amber-700">
              <h3 className="text-base font-bold text-amber-950 dark:text-amber-50 mb-2">
                Description
              </h3>
              <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
                {model.description || `The fastest model in ${getCompanyDisplayName(company)}'s family, but don't confuse speed with simplicity. It handles complex tasks remarkably well while maintaining low latency. Perfect for real-time applications and rapid prototyping.`}
              </p>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-base font-bold text-amber-950 dark:text-amber-50 mb-3">
                Features
              </h3>
              <div className="flex flex-wrap gap-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`px-4 py-2.5 ${feature.color} rounded-xl flex items-center gap-2 shadow-lg`}
                  >
                    <feature.icon className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-bold">{feature.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/50 dark:bg-amber-950/50 p-4 rounded-xl border border-amber-200 dark:border-amber-700">
                <h3 className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">
                  Provider
                </h3>
                <p className="text-amber-950 dark:text-amber-50 text-sm font-semibold">
                  {getCompanyDisplayName(company)}
                </p>
              </div>
              <div className="bg-white/50 dark:bg-amber-950/50 p-4 rounded-xl border border-amber-200 dark:border-amber-700">
                <h3 className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">
                  Developer
                </h3>
                <p className="text-amber-950 dark:text-amber-50 text-sm font-semibold">
                  {getCompanyDisplayName(company)}
                </p>
              </div>
              <div className="bg-white/50 dark:bg-amber-950/50 p-4 rounded-xl border border-amber-200 dark:border-amber-700">
                <h3 className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">
                  Context Length
                </h3>
                <p className="text-amber-950 dark:text-amber-50 text-sm font-semibold">
                  {model.context_length ? `${(model.context_length / 1000).toFixed(0)}K tokens` : "N/A"}
                </p>
              </div>
              <div className="bg-white/50 dark:bg-amber-950/50 p-4 rounded-xl border border-amber-200 dark:border-amber-700">
                <h3 className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">
                  Added On
                </h3>
                <p className="text-amber-950 dark:text-amber-50 text-sm font-semibold">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Benchmark Performance */}
            <div>
              <h3 className="text-base font-bold text-amber-950 dark:text-amber-50 mb-1 flex items-center gap-2">
                Benchmark Performance
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-400 mb-4">
                via Artificial Analysis ↗
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Quality", value: 35, icon: "🎯", color: "from-blue-500 to-cyan-500" },
                  { label: "Speed", value: 38, icon: "⚡", color: "from-purple-500 to-pink-500" },
                  { label: "Cost", value: 56, icon: "💰", color: "from-rose-500 to-orange-500" },
                ].map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/60 dark:bg-amber-950/60 rounded-xl p-4 border-2 border-amber-200 dark:border-amber-700"
                  >
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24 mb-3">
                        <svg className="transform -rotate-90 w-24 h-24">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-amber-200 dark:text-amber-800"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="url(#gradient-${index})"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - metric.value / 100)}`}
                            className="transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" className="text-amber-500" stopColor="currentColor" />
                              <stop offset="100%" className="text-orange-600" stopColor="currentColor" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl mb-1">{metric.icon}</span>
                          <span className={`text-2xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                            {metric.value}%
                          </span>
                        </div>
                      </div>
                      <p className="text-center text-sm font-bold text-amber-900 dark:text-amber-100">
                        {metric.label}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ 
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1]
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[650px] bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/95 dark:via-orange-900/95 dark:to-yellow-900/95 rounded-2xl shadow-2xl border-2 border-amber-200 dark:border-amber-700 overflow-hidden"
          style={{
            fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            maxHeight: '85vh',
            willChange: 'transform'
          }}
        >
          {/* Header */}
          <div className="p-5 border-b-2 border-amber-200 dark:border-amber-700 bg-white/40 dark:bg-amber-950/40">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-amber-950 dark:text-amber-50">
                  Unlock all models
                </h2>
                <p className="text-amber-700 dark:text-amber-300 text-sm font-semibold mt-0.5">
                  $8/month • Premium Access
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                >
                  Upgrade Now
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-amber-200 dark:hover:bg-amber-800 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-amber-900 dark:text-amber-200" />
                </button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-amber-600 dark:text-amber-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models..."
                className="w-full pl-10 pr-10 py-2.5 bg-white/80 dark:bg-amber-900/60 text-sm text-amber-950 dark:text-amber-50 placeholder:text-amber-500 dark:placeholder:text-amber-400 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-shadow duration-200 border border-amber-200 dark:border-amber-700"
              />
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-amber-600 dark:text-amber-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex" style={{ height: '400px' }}>
            <div className="w-36 border-r-2 border-amber-200 dark:border-amber-700 bg-white/30 dark:bg-amber-950/30 overflow-y-auto modern-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {Object.keys(groupedModels).map((company) => (
                    <button
                      key={company}
                      onClick={() => setSelectedCompany(company)}
                      className={`w-full flex flex-col items-center gap-2 p-2.5 rounded-xl transition-all duration-200 transform ${
                        selectedCompany === company
                          ? "bg-gradient-to-br from-amber-200 to-orange-200 dark:from-amber-700 dark:to-orange-700 shadow-md border-2 border-amber-400 dark:border-amber-500 scale-100"
                          : "hover:bg-amber-100/50 dark:hover:bg-amber-800/50 border-2 border-transparent hover:scale-105 active:scale-95"
                      }`}
                    >
                      <CompanyIconDisplay company={company} />
                      <div className="w-full text-center">
                        <div className={`text-xs font-bold truncate ${
                          selectedCompany === company 
                            ? "text-amber-950 dark:text-amber-50" 
                            : "text-amber-900 dark:text-amber-100"
                        }`}>
                          {getCompanyDisplayName(company)}
                        </div>
                        <div className={`text-[10px] font-semibold ${
                          selectedCompany === company
                            ? "text-amber-800 dark:text-amber-200"
                            : "text-amber-700 dark:text-amber-400"
                        }`}>
                          {groupedModels[company].length} models
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto modern-scrollbar bg-white/20 dark:bg-amber-950/20">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : selectedCompany ? (
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-amber-200 dark:border-amber-700">
                    <CompanyIconDisplay company={selectedCompany} size="large" />
                    <div>
                      <h3 className="text-base font-bold text-amber-950 dark:text-amber-50">
                        {getCompanyDisplayName(selectedCompany)}
                      </h3>
                      <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
                        {filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''} available
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {filteredModels.length > 0 ? (
                      filteredModels.map((model) => (
                        <div
                          key={model.id}
                          onClick={() => {
                            onSelectModel(model);
                            onClose();
                          }}
                          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 transform group border-2 border-transparent hover:border-amber-300 dark:hover:border-amber-600 bg-white/40 dark:bg-amber-900/40 hover:bg-amber-100/60 dark:hover:bg-amber-800/60 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(model.id);
                            }}
                            className="flex-shrink-0 transition-transform duration-200 hover:scale-125 active:scale-90"
                          >
                            <Star
                              className={`w-4.5 h-4.5 transition-colors duration-200 ${
                                favoriteModels.includes(model.id)
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-amber-400 dark:text-amber-500 group-hover:text-yellow-500"
                              }`}
                            />
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-amber-950 dark:text-amber-50 font-bold text-sm truncate">
                                {model.name}
                              </span>
                              {getPricingDisplay(model) && (
                                <span className="text-green-600 dark:text-green-400 text-xs font-bold px-1.5 py-0.5 bg-green-100 dark:bg-green-900/40 rounded flex-shrink-0">
                                  {getPricingDisplay(model)}
                                </span>
                              )}
                              {model.context_length > 100000 && (
                                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-md flex-shrink-0">
                                  NEW
                                </span>
                              )}
                              {model.id === selectedModel?.id && (
                                <span className="px-2 py-0.5 bg-amber-500/30 text-amber-900 dark:text-amber-100 text-[10px] font-bold rounded-md flex items-center gap-1 flex-shrink-0">
                                  <Check className="w-3 h-3" /> SELECTED
                                </span>
                              )}
                            </div>
                            <p className="text-amber-700 dark:text-amber-300 text-xs truncate leading-tight">
                              {model.description || "No description available"}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 hover:bg-amber-200 dark:hover:bg-amber-700 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-90"
                            >
                              <Eye className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setInfoModel(model);
                              }}
                              className="p-1.5 hover:bg-amber-200 dark:hover:bg-amber-700 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-90"
                            >
                              <Info className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-amber-600 dark:text-amber-400 text-sm">
                        No models found matching your search
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-amber-600 dark:text-amber-400 text-sm">
                  Select a company to view models
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {infoModel && (
          <ModelInfoDialog
            model={infoModel}
            onClose={() => setInfoModel(null)}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .modern-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .modern-scrollbar::-webkit-scrollbar-track {
          background: rgba(251, 191, 36, 0.1);
          border-radius: 10px;
          margin: 4px;
        }
        .modern-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(251, 146, 60, 0.8) 0%, rgba(234, 88, 12, 0.8) 100%);
          border-radius: 10px;
          border: 2px solid rgba(251, 191, 36, 0.1);
        }
        .modern-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(251, 146, 60, 1) 0%, rgba(234, 88, 12, 1) 100%);
        }
        .modern-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
        .modern-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(251, 146, 60, 0.8) rgba(251, 191, 36, 0.1);
        }
      `}</style>
    </AnimatePresence>
  );
};

export default ModelSelector;