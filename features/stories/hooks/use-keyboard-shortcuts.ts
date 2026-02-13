"use client"

import { useEffect } from "react"

type UseKeyboardShortcutsOptions = {
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  isPaused: boolean
  onPause: () => void
  onResume: () => void
}

export function useKeyboardShortcuts({
  isOpen,
  onClose,
  onNext,
  onPrev,
  isPaused,
  onPause,
  onResume,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          onPrev()
          break
        case "ArrowRight":
          onNext()
          break
        case " ":
          e.preventDefault()
          if (isPaused) onResume()
          else onPause()
          break
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, onNext, onPrev, isPaused, onPause, onResume])
}
