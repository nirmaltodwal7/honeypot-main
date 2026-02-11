"use client"

let currentUtterance: SpeechSynthesisUtterance | null = null

export function speak(text: string, onStart?: () => void, onEnd?: () => void) {
  if (typeof window === "undefined") return
  stopSpeaking()

  if (!("speechSynthesis" in window)) {
    console.warn("[v0] Speech Synthesis not supported.")
    return
  }

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 1
  utterance.pitch = 1
  utterance.onstart = () => onStart?.()
  utterance.onend = () => onEnd?.()
  currentUtterance = utterance
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (typeof window === "undefined") return
  if (currentUtterance) {
    window.speechSynthesis.cancel()
    currentUtterance = null
  }
}
