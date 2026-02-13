"use client"

import { useCallback, useRef, useState } from "react"

const SNAP_VELOCITY_THRESHOLD = 0.3
const SNAP_DISTANCE_RATIO = 0.3
const DISMISS_DISTANCE = 150
const TAP_SLOP = 10
const HOLD_DELAY = 200

type DragState = {
  startX: number
  startY: number
  startTime: number
  currentX: number
  currentY: number
  axis: "none" | "x" | "y"
  isDragging: boolean
}

type UseSwipeGestureOptions = {
  activeIndex: number
  totalCount: number
  onTapLeft: () => void
  onTapRight: () => void
  onSwipeToNext: () => void
  onSwipeToPrev: () => void
  onDismiss: () => void
  onHoldStart: () => void
  onHoldEnd: () => void
  onDragStart: () => void
  onDragCancel: () => void
}

export function useSwipeGesture({
  activeIndex,
  totalCount,
  onTapLeft,
  onTapRight,
  onSwipeToNext,
  onSwipeToPrev,
  onDismiss,
  onHoldStart,
  onHoldEnd,
  onDragStart,
  onDragCancel,
}: UseSwipeGestureOptions) {
  const dragRef = useRef<DragState | null>(null)
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isHoldingRef = useRef(false)

  const [dragX, setDragX] = useState(0)
  const [dragY, setDragY] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [dismissProgress, setDismissProgress] = useState(0)

  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 375

  const resetDrag = useCallback(() => {
    setDragX(0)
    setDragY(0)
    setDismissProgress(0)
    setIsAnimating(false)
    dragRef.current = null
  }, [])

  function handleTouchStart(e: React.TouchEvent) {
    if (isAnimating) return
    const touch = e.touches[0]
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      currentX: touch.clientX,
      currentY: touch.clientY,
      axis: "none",
      isDragging: false,
    }
    isHoldingRef.current = false
    holdTimerRef.current = setTimeout(() => {
      if (dragRef.current && !dragRef.current.isDragging) {
        isHoldingRef.current = true
        onHoldStart()
      }
    }, HOLD_DELAY)
  }

  function handleTouchMove(e: React.TouchEvent) {
    const drag = dragRef.current
    if (!drag || isAnimating) return

    const touch = e.touches[0]
    drag.currentX = touch.clientX
    drag.currentY = touch.clientY
    const dx = touch.clientX - drag.startX
    const dy = touch.clientY - drag.startY

    if (drag.axis === "none") {
      if (Math.abs(dx) > TAP_SLOP || Math.abs(dy) > TAP_SLOP) {
        drag.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y"
        drag.isDragging = true
        if (holdTimerRef.current) {
          clearTimeout(holdTimerRef.current)
          holdTimerRef.current = null
        }
        if (isHoldingRef.current) {
          isHoldingRef.current = false
          onHoldEnd()
        }
        onDragStart()
      }
      return
    }

    if (drag.axis === "x") {
      let offset = dx
      const atStart = activeIndex === 0 && dx > 0
      const atEnd = activeIndex === totalCount - 1 && dx < 0
      if (atStart || atEnd) {
        offset = dx * 0.3
      }
      setDragX(offset)
    } else {
      const downOffset = Math.max(0, dy)
      setDragY(downOffset)
      setDismissProgress(Math.min(downOffset / DISMISS_DISTANCE, 1))
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }

    if (isHoldingRef.current) {
      isHoldingRef.current = false
      onHoldEnd()
      dragRef.current = null
      return
    }

    const drag = dragRef.current
    if (!drag) return

    const dx = drag.currentX - drag.startX
    const dt = Date.now() - drag.startTime
    const velocityX = Math.abs(dx) / Math.max(dt, 1)

    if (!drag.isDragging) {
      dragRef.current = null
      const touch = e.changedTouches[0]
      if (touch.clientX < screenWidth / 3) {
        onTapLeft()
      } else {
        onTapRight()
      }
      return
    }

    if (drag.axis === "x") {
      const shouldSnap =
        Math.abs(dx) > screenWidth * SNAP_DISTANCE_RATIO ||
        velocityX > SNAP_VELOCITY_THRESHOLD

      if (shouldSnap && dx < 0 && activeIndex < totalCount - 1) {
        setIsAnimating(true)
        setDragX(-screenWidth)
        setTimeout(() => {
          setIsAnimating(false)
          setDragX(0)
          dragRef.current = null
          onSwipeToNext()
        }, 300)
      } else if (shouldSnap && dx > 0 && activeIndex > 0) {
        setIsAnimating(true)
        setDragX(screenWidth)
        setTimeout(() => {
          setIsAnimating(false)
          setDragX(0)
          dragRef.current = null
          onSwipeToPrev()
        }, 300)
      } else {
        setIsAnimating(true)
        setDragX(0)
        setTimeout(() => {
          resetDrag()
          onDragCancel()
        }, 300)
      }
    } else if (drag.axis === "y") {
      if (dismissProgress >= 0.8) {
        onDismiss()
        resetDrag()
      } else {
        setIsAnimating(true)
        setDragY(0)
        setDismissProgress(0)
        setTimeout(() => {
          resetDrag()
          onDragCancel()
        }, 300)
      }
    } else {
      resetDrag()
      onDragCancel()
    }
  }

  return {
    dragX,
    dragY,
    dismissProgress,
    isAnimating,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  }
}
