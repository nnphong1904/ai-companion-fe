"use client"

import { SendHorizonal } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (content: string) => void
  disabled?: boolean
}) {
  const [value, setValue] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim() || disabled) return
    onSend(value)
    setValue("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t bg-background p-3"
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1"
        autoComplete="off"
      />
      <Button
        type="submit"
        size="icon"
        disabled={disabled || !value.trim()}
        className="shrink-0"
      >
        <SendHorizonal className="h-4 w-4" />
      </Button>
    </form>
  )
}
