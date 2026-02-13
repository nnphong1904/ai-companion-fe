"use client"

import { useRef } from "react"

const SWIPE_THRESHOLD = 50
const HOLD_DELAY = 200

export { HOLD_DELAY }

export function GestureArea({
  onTapLeft,
  onTapRight,
  onSwipeLeft,
  onSwipeRight,
  onPause,
  onResume,
  children,
}: {
  onTapLeft: () => void
  onTapRight: () => void
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onPause?: () => void
  onResume?: () => void
  children: React.ReactNode
}) {
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isHoldingRef = useRef(false)

  function handlePointerDown(e: React.PointerEvent) {
    pointerStartRef.current = { x: e.clientX, y: e.clientY }
    isHoldingRef.current = false
    holdTimerRef.current = setTimeout(() => {
      isHoldingRef.current = true
      onPause?.()
    }, HOLD_DELAY)
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
    if (isHoldingRef.current) {
      isHoldingRef.current = false
      onResume?.()
      return
    }
    const start = pointerStartRef.current
    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y

    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) onSwipeLeft()
      else onSwipeRight()
      return
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const tapX = e.clientX - rect.left
    if (tapX < rect.width / 3) onTapLeft()
    else onTapRight()
  }

  function handlePointerCancel() {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
    if (isHoldingRef.current) {
      isHoldingRef.current = false
      onResume?.()
    }
  }

  return (
    <div
      className="relative flex flex-1 overflow-hidden touch-pan-y"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerCancel}
    >
      {children}
    </div>
  )
}
