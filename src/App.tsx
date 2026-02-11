import ChatUI from "@/components/chat/chat-ui"
import { ShieldCheck } from "lucide-react"

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono selection:bg-emerald-500/30">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tighter text-white uppercase">Aegis-v1</h1>
              <p className="text-[10px] text-emerald-500/70 leading-none">Scam Honeypot & Intelligence System</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs font-medium uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Live
            </div>
            <div className="px-3 py-1 border border-slate-700 bg-slate-800 rounded italic lowercase text-slate-400">
              node_v20.x | gemini-flash
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 lg:p-6">
        <ChatUI />
      </main>

      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-[-1] opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#34d399 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} />
    </div>
  )
}
