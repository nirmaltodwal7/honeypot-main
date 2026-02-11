"use client"
import { cn } from "@/lib/utils"

type Props = {
  speaking?: boolean
  size?: number
}

export function AnimatedAvatar({ speaking = false, size = 56 }: Props) {
  // Simple animated equalizer bars + face that smiles when speaking
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "relative rounded-full bg-blue-600/10 border border-blue-600/30 flex items-center justify-center overflow-hidden",
          speaking ? "ring-2 ring-blue-600/40" : "animate-breathe",
        )}
        style={{ width: size, height: size }}
        aria-hidden="true"
        aria-label={speaking ? "Assistant is speaking" : "Assistant is idle"}
      >
        {/* Face */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
          </div>
          <div
            className={cn(
              "mt-1 h-1 w-6 rounded-full bg-blue-600 transition-all",
              speaking ? "scale-110 translate-y-[1px]" : "opacity-80",
            )}
          />
        </div>

        {/* Equalizer bars (animate when speaking) */}
        <div
          className={cn(
            "absolute bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-1",
            speaking ? "opacity-100" : "opacity-40",
          )}
        >
          <span
            className={cn("eq-bar w-[3px] bg-blue-600 rounded-sm", speaking ? "animate-equalize-1" : "")}
            style={{ height: speaking ? 12 : 6, animationDelay: "0ms" }}
          />
          <span
            className={cn("eq-bar w-[3px] bg-blue-600 rounded-sm", speaking ? "animate-equalize-2" : "")}
            style={{ height: speaking ? 18 : 8, animationDelay: "120ms" }}
          />
          <span
            className={cn("eq-bar w-[3px] bg-blue-600 rounded-sm", speaking ? "animate-equalize-3" : "")}
            style={{ height: speaking ? 10 : 6, animationDelay: "240ms" }}
          />
        </div>
      </div>

      <div className="hidden sm:block">
        <p className="text-sm font-medium text-blue-700">Chatbot</p>
        <p className="text-xs text-muted-foreground">{speaking ? "Speaking..." : "Ready"}</p>
      </div>
    </div>
  )
}
