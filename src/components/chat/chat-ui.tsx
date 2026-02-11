"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Terminal,
  Cpu,
  Database,
  Activity,
  Eye,
  RefreshCw,
  ShieldCheck,
  Lock,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageBubble } from "./message-bubble"
import { ChatInput } from "./chat-input"
// import { AnimatedAvatar } from "./animated-avatar"
import { speak, stopSpeaking } from "@/lib/speech"
import { generateUUID } from "@/lib/utils"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatUI() {
  const [isHoneypotMode, setIsHoneypotMode] = React.useState(false)
  const [extractedIntelligence, setExtractedIntelligence] = React.useState<any>(null)
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [ttsEnabled, setTtsEnabled] = React.useState(true)
  // const [speaking, setSpeaking] = React.useState(false)
  const bottomRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length, isLoading, extractedIntelligence])

  async function handleSend() {
    const text = input.trim()
    if (!text || isLoading) return

    stopSpeaking()
    const userMsg: ChatMessage = { id: generateUUID(), role: "user", content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    try {
      const body: any = {
        messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
      }

      if (isHoneypotMode) {
        body.agent_type = 'honeypot'
      }

      // Use proxy in dev, direct URL in prod
      const baseUrl = import.meta.env.DEV
        ? ""
        : import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "https://chatbot-1-fnli.onrender.com";

      const res = await fetch(`${baseUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Failed to get response")

      const contentType = res.headers.get("Content-Type")
      const isJson = contentType && contentType.includes("application/json")

      if (isHoneypotMode || isJson) {
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        if (!isHoneypotMode) setIsHoneypotMode(true)

        const assistantMsg: ChatMessage = {
          id: generateUUID(),
          role: "assistant",
          content: data.agent_reply || "..."
        }
        setMessages((prev) => [...prev, assistantMsg])
        if (data.extracted_intelligence) setExtractedIntelligence(data.extracted_intelligence)

        if (ttsEnabled && assistantMsg.content) {
          speak(assistantMsg.content)
        }
      } else {
        if (!res.body) throw new Error("No response body")
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let full = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          full += decoder.decode(value, { stream: true })
        }
        const assistantMsg: ChatMessage = { id: generateUUID(), role: "assistant", content: full.trim() }
        setMessages((prev) => [...prev, assistantMsg])
        if (ttsEnabled && assistantMsg.content) {
          speak(assistantMsg.content)
        }
      }
    } catch (e) {
      console.error("chat error", e)
      setMessages((prev) => [...prev, {
        id: generateUUID(),
        role: "assistant",
        content: "CRITICAL: Response generation failed. Check system logs."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  function replayLastReply() {
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant")
    if (!lastAssistant) return
    stopSpeaking()
    speak(lastAssistant.content)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 font-mono text-slate-300">
      <div className="flex flex-col gap-6">
        {/* System Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusCard icon={<Activity size={16} />} label="Traffic" value="INTERCEPTING" color="text-emerald-500" />
          <StatusCard icon={<Cpu size={16} />} label="Neural Engine" value={isHoneypotMode ? "HONEYPOT-V1" : "ASSISTANT-V2"} color="text-blue-400" />
          <StatusCard icon={<Lock size={16} />} label="Protocol" value="AES-256" color="text-slate-500" />
        </div>

        {/* Main Terminal Container */}
        <Card className="bg-slate-900 border-slate-800 border-2 rounded-none relative overflow-hidden flex flex-col min-h-[650px] shadow-2xl shadow-emerald-500/5">
          {/* Header */}
          <div className="bg-slate-800/80 p-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-slate-950 rounded border border-slate-700">
                <Terminal size={18} className="text-emerald-500" />
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Secure_Terminal_Console</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-500/70 font-bold uppercase">System Link Active</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsHoneypotMode(!isHoneypotMode)}
                className={`h-8 text-[10px] font-bold border-2 tracking-widest transition-all rounded-none ${isHoneypotMode
                  ? "bg-rose-500/10 border-rose-500 text-rose-500 hover:bg-rose-500/20"
                  : "bg-slate-950 border-slate-700 text-slate-400 hover:bg-slate-800"
                  }`}
              >
                {isHoneypotMode ? "TERMINATE HONEYPOT" : "ARM HONEYPOT"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={replayLastReply}
                className="h-8 w-8 p-0 bg-slate-950 border-slate-700 rounded-none text-slate-400 hover:text-white"
              >
                <RefreshCw size={14} />
              </Button>
            </div>
          </div>

          {/* Conversation Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-95">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center space-y-4 opacity-30"
                >
                  <ShieldCheck size={48} />
                  <p className="text-xs text-center max-w-xs leading-relaxed uppercase tracking-widest">
                    {isHoneypotMode
                      ? "Standby: Awaiting scam-signature detection. Intelligence extraction protocols armed."
                      : "System Initialized. Console ready for general inquiries."}
                  </p>
                </motion.div>
              ) : (
                messages.map((m) => <MessageBubble key={m.id} role={m.role} content={m.content} />)
              )}
            </AnimatePresence>
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Terminal Input Footer */}
          <div className="p-4 bg-slate-950 border-t border-slate-800">
            <ChatInput
              input={input}
              setInput={setInput}
              onSend={handleSend}
              disabled={isLoading}
              ttsEnabled={ttsEnabled}
              setTtsEnabled={(v) => {
                setTtsEnabled(v)
                if (!v) stopSpeaking()
              }}
            />
            <div className="mt-3 flex justify-between items-center px-1">
              <span className="text-[9px] text-slate-600 uppercase font-black">Auth: Root_Admin</span>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-blue-500" /> <span className="text-[9px] text-slate-600 font-bold uppercase">Assist</span></div>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> <span className="text-[9px] text-slate-600 font-bold uppercase">Safe</span></div>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> <span className="text-[9px] text-slate-600 font-bold uppercase">Scam</span></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Intelligence Sidebar */}
      <aside className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900 border-2 border-slate-800 p-5 shadow-xl h-full flex flex-col"
        >
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <Database size={18} className="text-emerald-500" />
            <h2 className="text-sm font-black uppercase tracking-tighter text-white">Vault_Intelligence</h2>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
            {!isHoneypotMode ? (
              <div className="py-20 text-center space-y-4 opacity-20">
                <Eye size={40} className="mx-auto" />
                <p className="text-[10px] uppercase font-bold tracking-widest leading-loose">
                  Honeypot Inactive<br />Extraction Standby
                </p>
              </div>
            ) : (
              <IntelligenceData data={extractedIntelligence} />
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="bg-slate-950 p-3 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-slate-500">Node_Status</span>
                <span className="text-[10px] text-emerald-500 font-bold">READY</span>
              </div>
              <p className="text-[9px] text-slate-600 leading-relaxed uppercase">
                Persona Profile: Indian Middle-Class<br />
                Logic: Autonomous Deception
              </p>
            </div>
          </div>
        </motion.div>
      </aside>
    </div>
  )
}

// --- Helper Components ---

function StatusCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-slate-500">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      </div>
      <span className={`text-[10px] font-black uppercase tracking-tighter ${color}`}>{value}</span>
    </div>
  )
}

function IntelligenceData({ data }: any) {
  const sections = [
    { label: "Financial: UPI IDs", items: data?.upi_ids, color: "text-rose-400", bg: "bg-rose-500/5" },
    { label: "Bank Accounts", items: data?.bank_accounts, color: "text-emerald-400", bg: "bg-emerald-500/5" },
    { label: "Bank Names", items: data?.bank_names, color: "text-emerald-300", bg: "bg-emerald-500/5" },
    { label: "IFSC Codes", items: data?.ifsc_codes, color: "text-blue-400", bg: "bg-blue-500/5" },
    { label: "Phone Numbers", items: data?.phone_numbers, color: "text-amber-400", bg: "bg-amber-500/5" },
    { label: "Phishing Links", items: data?.phishing_links, color: "text-rose-300", bg: "bg-rose-500/5" },
  ];

  return (
    <div className="space-y-5">
      {sections.map((section, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{section.label}</span>
            <span className="text-[10px] text-slate-700">[{section.items?.length || 0}]</span>
          </div>
          <div className={`p-2 border border-slate-800 ${section.bg} min-h-[30px]`}>
            {section.items?.length > 0 ? (
              section.items.map((item: string, i: number) => (
                <div key={i} className={`text-[10px] font-bold break-all mb-1 ${section.color}`}>
                  {`> ${item}`}
                </div>
              ))
            ) : (
              <span className="text-[9px] italic text-slate-800 uppercase tracking-widest">No signature captured</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-slate-800 border border-slate-700 px-4 py-2 flex gap-1 items-center shadow-lg">
        <span className="h-1 w-1 bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="h-1 w-1 bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="h-1 w-1 bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}