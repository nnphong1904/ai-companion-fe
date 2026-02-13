"use client"

import { useCallback, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProgressBars } from "./progress-bars"
import { SlideContent } from "./slide-content"
import { StoryHeader } from "./story-header"
import { ReactionBarOverlay } from "./reaction-bar"
import { StoryPeekCard } from "./story-peek-card"
import { HOLD_DELAY } from "./gesture-area"
import type { StoriesViewer } from "../hooks/use-stories"

const SNAP_VELOCITY_THRESHOLD = 0.3 // px/ms — a flick faster than this snaps
const SNAP_DISTANCE_RATIO = 0.3 // drag 30% of screen width to snap
const DISMISS_DISTANCE = 150 // px down to dismiss
const TAP_SLOP = 10 // px — movement below this is a tap, not a drag

type DragState = {
  startX: number
  startY: number
  startTime: number
  currentX: number
  currentY: number
  axis: "none" | "x" | "y"
  isDragging: boolean
}

export function MobileStoryViewer({
  viewer,
  isVisible,
}: {
  viewer: StoriesViewer
  isVisible: boolean
}) {
  const {
    stories,
    activeStoryIndex,
    activeSlideIndex,
    progress,
    isPaused,
    close,
    goNext,
    goPrev,
    goToStory,
    react,
    pauseTimer,
    resumeTimer,
    setActiveSlideDuration,
  } = viewer

  const dragRef = useRef<DragState | null>(null)
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isHoldingRef = useRef(false)

  // Drag offset applied via state for re-renders
  const [dragX, setDragX] = useState(0)
  const [dragY, setDragY] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [dismissProgress, setDismissProgress] = useState(0) // 0..1

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
    // Hold-to-pause
    isHoldingRef.current = false
    holdTimerRef.current = setTimeout(() => {
      if (dragRef.current && !dragRef.current.isDragging) {
        isHoldingRef.current = true
        pauseTimer()
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

    // Determine axis lock after passing tap slop
    if (drag.axis === "none") {
      if (Math.abs(dx) > TAP_SLOP || Math.abs(dy) > TAP_SLOP) {
        drag.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y"
        drag.isDragging = true
        // Cancel hold timer once dragging starts
        if (holdTimerRef.current) {
          clearTimeout(holdTimerRef.current)
          holdTimerRef.current = null
        }
        if (isHoldingRef.current) {
          isHoldingRef.current = false
          resumeTimer()
        }
        pauseTimer()
      }
      return
    }

    if (drag.axis === "x") {
      // Clamp with rubber-band at edges
      let offset = dx
      const atStart = activeStoryIndex === 0 && dx > 0
      const atEnd = activeStoryIndex === stories.length - 1 && dx < 0
      if (atStart || atEnd) {
        offset = dx * 0.3 // rubber-band
      }
      setDragX(offset)
    } else {
      // Only allow downward drag for dismiss
      const downOffset = Math.max(0, dy)
      setDragY(downOffset)
      setDismissProgress(Math.min(downOffset / DISMISS_DISTANCE, 1))
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    // Clear hold timer
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }

    // Handle hold release
    if (isHoldingRef.current) {
      isHoldingRef.current = false
      resumeTimer()
      dragRef.current = null
      return
    }

    const drag = dragRef.current
    if (!drag) return

    const dx = drag.currentX - drag.startX
    const dy = drag.currentY - drag.startY
    const dt = Date.now() - drag.startTime
    const velocityX = Math.abs(dx) / Math.max(dt, 1)

    // If no axis was locked, treat as a tap
    if (!drag.isDragging) {
      dragRef.current = null
      // Tap zone detection
      const touch = e.changedTouches[0]
      const tapX = touch.clientX
      if (tapX < screenWidth / 3) {
        goPrev()
      } else {
        goNext()
      }
      return
    }

    if (drag.axis === "x") {
      const shouldSnap =
        Math.abs(dx) > screenWidth * SNAP_DISTANCE_RATIO ||
        velocityX > SNAP_VELOCITY_THRESHOLD

      if (shouldSnap && dx < 0 && activeStoryIndex < stories.length - 1) {
        // Snap to next story
        setIsAnimating(true)
        setDragX(-screenWidth)
        setTimeout(() => {
          // Reset position instantly (no transition) THEN switch story
          setIsAnimating(false)
          setDragX(0)
          dragRef.current = null
          goToStory(activeStoryIndex + 1)
        }, 300)
      } else if (shouldSnap && dx > 0 && activeStoryIndex > 0) {
        // Snap to previous story
        setIsAnimating(true)
        setDragX(screenWidth)
        setTimeout(() => {
          setIsAnimating(false)
          setDragX(0)
          dragRef.current = null
          goToStory(activeStoryIndex - 1)
        }, 300)
      } else {
        // Bounce back
        setIsAnimating(true)
        setDragX(0)
        setTimeout(() => {
          resetDrag()
          resumeTimer()
        }, 300)
      }
    } else if (drag.axis === "y") {
      if (dismissProgress >= 0.8) {
        close()
        resetDrag()
      } else {
        // Bounce back
        setIsAnimating(true)
        setDragY(0)
        setDismissProgress(0)
        setTimeout(() => {
          resetDrag()
          resumeTimer()
        }, 300)
      }
    } else {
      resetDrag()
      resumeTimer()
    }
  }

  const activeStory = stories[activeStoryIndex]
  const prevStory = activeStoryIndex > 0 ? stories[activeStoryIndex - 1] : null
  const nextStory = activeStoryIndex < stories.length - 1 ? stories[activeStoryIndex + 1] : null

  const dismissScale = 1 - dismissProgress * 0.15
  const backdropOpacity = 1 - dismissProgress * 0.5

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 overflow-hidden transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
      )}
      style={{ width: "100vw", height: "100dvh" }}
    >
      {/* Backdrop — fades on dismiss drag */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: backdropOpacity }}
      />

      {/* Touch surface */}
      <div
        className="relative h-full w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Story strip — all stories laying out, translated by drag */}
        <div
          className={cn(
            "absolute inset-0",
            isAnimating && "transition-transform duration-300 ease-out",
          )}
          style={{
            transform: `translateX(${dragX}px) translateY(${dragY}px) scale(${dismissScale})`,
            borderRadius: dismissProgress > 0 ? `${dismissProgress * 24}px` : undefined,
            overflow: dismissProgress > 0 ? "hidden" : undefined,
          }}
        >
          {/* Active story */}
          <div className="absolute inset-0 bg-black">
            {/* Slide content fills entire area */}
            <div className="absolute inset-0">
              <SlideContent
                key={`${activeStory.id}-${activeSlideIndex}`}
                slide={activeStory.slides[activeSlideIndex]}
                isPaused={isPaused}
                onDurationResolved={setActiveSlideDuration}
              />
            </div>

            {/* Top overlay: progress + header */}
            <div className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/60 to-transparent">
              <ProgressBars
                total={activeStory.slides.length}
                current={activeSlideIndex}
                progress={progress}
                isPaused={isPaused}
              />
              <StoryHeader story={activeStory} />
            </div>

            {/* Bottom overlay: reactions */}
            <ReactionBarOverlay onReact={react} />
          </div>

          {/* Peek: previous story (left) — visible during drag */}
          {prevStory && dragX > 0 ? (
            <div
              className="absolute inset-y-0 right-full w-screen bg-black"
            >
              <StoryPeekCard story={prevStory} />
            </div>
          ) : null}

          {/* Peek: next story (right) — visible during drag */}
          {nextStory && dragX < 0 ? (
            <div
              className="absolute inset-y-0 left-full w-screen bg-black"
            >
              <StoryPeekCard story={nextStory} />
            </div>
          ) : null}
        </div>
      </div>

      {/* Close button */}
      <button
        className="absolute right-3 top-14 z-50 rounded-full bg-black/40 p-1.5 text-white/80 transition-colors hover:text-white"
        onClick={close}
      >
        <X className="h-5 w-5" />
      </button>
    </div>,
    document.body,
  )
}
