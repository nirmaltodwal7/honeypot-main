"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type Props = {
  input: string
  setInput: (v: string) => void
  onSend: () => void
  disabled?: boolean
  ttsEnabled: boolean
  setTtsEnabled: (v: boolean) => void
}

export function ChatInput({ input, setInput, onSend, disabled, ttsEnabled, setTtsEnabled }: Props) {
  const formRef = React.useRef<HTMLFormElement>(null)
  return (
    <form
      ref={formRef}
      className="flex items-end gap-2 rounded-xl border border-slate-200 bg-white p-2"
      onSubmit={(e) => {
        e.preventDefault()
        onSend()
      }}
    >
      <label className="sr-only" htmlFor="chat-input">
        Message
      </label>
      <Textarea
        id="chat-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className={cn(
          "min-h-[44px] max-h-40 resize-none border-0 shadow-none focus-visible:ring-2 focus-visible:ring-blue-600/40 focus-visible:ring-offset-0 transition-shadow",
        )}
        rows={1}
        disabled={disabled}
      />
      <div className="flex items-center gap-2 pb-1">
        <Button
          type="button"
          variant={ttsEnabled ? "default" : "outline"}
          className={cn(
            ttsEnabled ? "bg-emerald-600 hover:bg-emerald-700" : "",
            "transition-transform active:scale-95",
          )}
          onClick={() => setTtsEnabled(!ttsEnabled)}
          aria-pressed={ttsEnabled}
          aria-label={ttsEnabled ? "Disable voice" : "Enable voice"}
        >
          {ttsEnabled ? "Voice On" : "Voice Off"}
        </Button>
        <Button
          type="submit"
          disabled={disabled || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 transition-transform active:scale-95"
          aria-label="Send message"
        >
          Send
        </Button>
      </div>
    </form>
  )
}
