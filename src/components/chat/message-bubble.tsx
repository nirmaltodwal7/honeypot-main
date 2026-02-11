"use client"

// import * as React from "react"
import { motion } from "framer-motion" // Add this line

export function MessageBubble({ role, content }: { role: string, content: string }) {
  const isAssistant = role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
    >
      <div className="flex items-center gap-2 mb-1 px-1">
        <span className={`text-[9px] font-black uppercase tracking-tighter ${isAssistant ? 'text-emerald-500' : 'text-slate-500'}`}>
          {isAssistant ? "AI_RESPONSE" : "EXTERNAL_INPUT"}
        </span>
        <div className={`h-[1px] w-4 ${isAssistant ? 'bg-emerald-500/30' : 'bg-slate-700'}`} />
      </div>

      <div className={`max-w-[90%] p-4 rounded-lg text-sm leading-relaxed border font-mono ${isAssistant
          ? 'bg-slate-800/50 border-emerald-500/20 text-emerald-50 shadow-[0_0_20px_rgba(16,185,129,0.05)]'
          : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}>
        {content}
      </div>
    </motion.div>
  )
}