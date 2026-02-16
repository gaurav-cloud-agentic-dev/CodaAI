"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";
import { 
  MessageSquare, 
  Search, 
  FolderKanban, 
  FileCode, 
  Code, 
  GraduationCap, 
  PenTool, 
  Sparkles, 
  Lightbulb,
  Plus,
  Menu,
  ChevronDown,
  LogOut,
  Settings,
  Send
} from "lucide-react";

const suggestions = [
  { icon: Code, label: "Code", color: "from-blue-400 to-blue-500" },
  { icon: GraduationCap, label: "Learn", color: "from-green-400 to-emerald-500" },
  { icon: PenTool, label: "Write", color: "from-purple-400 to-violet-500" },
  { icon: Sparkles, label: "Life stuff", color: "from-pink-400 to-rose-500" },
  { icon: Lightbulb, label: "Claude's choice", color: "from-amber-400 to-orange-500" },
];

export default function HomePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [greeting, setGreeting] = useState("Afternoon");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Morning");
    else if (hour < 18) setGreeting("Afternoon");
    else setGreeting("Evening");
  }, []);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!session) {
    router.push("/auth/sign-in");
    return null;
  }

  const handleSignOut = async () => {
    const { signOut } = await import("@/lib/auth-client");
    await signOut();
    router.push("/auth/sign-in");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Glassmorphic Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-72 p-4 flex flex-col gap-4"
      >
        <GlassCard className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CodaAI
            </h1>
            <button className="p-2 hover:bg-white/50 rounded-xl transition-colors">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <GlassButton variant="primary" className="w-full mb-6">
            <Plus className="w-5 h-5 mr-2 inline" />
            New chat
          </GlassButton>

          {/* Search */}
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/50 rounded-xl transition-colors mb-6">
            <Search className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">Search</span>
          </button>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            <NavItem icon={MessageSquare} label="Chats" active />
            <NavItem icon={FolderKanban} label="Projects" />
            <NavItem icon={FileCode} label="Artifacts" />
            <NavItem icon={Code} label="Code" />
          </nav>

          {/* User Profile */}
          <div className="mt-auto pt-4 border-t border-white/20">
            <div className="flex items-center gap-3 p-2 hover:bg-white/50 rounded-xl cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-sm font-semibold">
                {session.user.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-500">Free plan</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="mt-2 flex gap-2">
              <GlassButton 
                onClick={handleSignOut}
                variant="ghost"
                className="flex-1 text-sm"
              >
                <LogOut className="w-4 h-4 mr-1 inline" />
                Sign out
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4">
        <GlassCard className="flex-1 flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between pb-4 border-b border-white/20">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/50 rounded-xl lg:hidden transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            
            <div className="flex-1" />
            
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-medium text-gray-600 bg-white/50 rounded-full backdrop-blur-sm">
                Free plan
              </span>
              <GlassButton variant="ghost" className="text-sm">
                Upgrade
              </GlassButton>
            </div>
          </header>

          {/* Chat Area */}
          <div className="flex-1 flex items-center justify-center px-4 overflow-y-auto">
            <div className="w-full max-w-3xl">
              {/* Greeting */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3">
                  <span className="text-3xl">✨</span>
                  {greeting}, {session.user.name?.split(" ")[0] || "there"}
                </h1>
              </motion.div>

              {/* Input Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8"
              >
                <GlassCard className="p-4">
                  <div className="flex items-center gap-3">
                    <GlassInput
                      placeholder="How can I help you today?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 border-0 bg-transparent focus:bg-transparent shadow-none"
                    />
                    <GlassButton variant="primary" className="rounded-full p-3">
                      <Send className="w-5 h-5" />
                    </GlassButton>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-white/50 rounded-lg transition-colors">
                      <span>Sonnet 4.5</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Suggestions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-3"
              >
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/50 backdrop-blur-md hover:bg-white/70 border border-white/30 rounded-xl transition-all shadow-glass"
                  >
                    <div className={`p-1.5 rounded-lg bg-gradient-to-r ${suggestion.color}`}>
                      <suggestion.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {suggestion.label}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
        active
          ? "bg-white/70 shadow-glass text-gray-900"
          : "hover:bg-white/40 text-gray-700"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}