"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message } from "../types"

export function ChatMessage({
  message,
  onToggleMemory,
}: {
  message: Message
  onToggleMemory?: (id: string) => void
}) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-2", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "relative max-w-[80%] rounded-2xl px-4 py-2.5",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-muted",
        )}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>

        {!isUser && onToggleMemory && (
          <button
            onClick={() => onToggleMemory(message.id)}
            className={cn(
              "mt-1.5 inline-flex items-center gap-1 text-xs transition-colors",
              message.isMemory
                ? "text-amber-400"
                : "text-muted-foreground hover:text-amber-400",
            )}
          >
            <Star className={cn("h-3.5 w-3.5", message.isMemory && "fill-current")} />
            {message.isMemory ? "Saved" : "Save Memory"}
          </button>
        )}
      </div>
    </div>
  )
}
