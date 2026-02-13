"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ActiveStoryCard } from "./active-story-card"
import { PreviewStoryCard } from "./preview-story-card"
import { MobileStoryViewer } from "./mobile-story-viewer"
import type { StoriesViewer } from "../hooks/use-stories"

const DESKTOP_GAP = 12
const MD_BREAKPOINT = 768

export function StoryViewer({ viewer }: { viewer: StoriesViewer }) {
  const {
    isOpen,
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

  const measureRef = useRef<HTMLDivElement>(null)
  const [cardWidth, setCardWidth] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Reset visibility immediately when closed (no effect needed)
  if (!isOpen && isVisible) {
    setIsVisible(false)
  }

  useEffect(() => {
    if (!isOpen) return
    function measure() {
      if (measureRef.current) setCardWidth(measureRef.current.offsetWidth)
      setIsDesktop(window.innerWidth >= MD_BREAKPOINT)
    }
    requestAnimationFrame(() => {
      measure()
      setIsVisible(true)
    })
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [isOpen])

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Escape":
          close()
          break
        case "ArrowLeft":
          goPrev()
          break
        case "ArrowRight":
          goNext()
          break
        case " ":
          e.preventDefault()
          if (isPaused) resumeTimer()
          else pauseTimer()
          break
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, close, goNext, goPrev, isPaused, pauseTimer, resumeTimer])

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  if (!isOpen || activeStoryIndex < 0) return null

  // ── Mobile: fullscreen with drag gestures ──
  if (!isDesktop) {
    return <MobileStoryViewer viewer={viewer} isVisible={isVisible} />
  }

  // ── Desktop: card carousel ──
  function handleSwipeLeft() {
    if (activeStoryIndex < stories.length - 1) goToStory(activeStoryIndex + 1)
  }

  function handleSwipeRight() {
    if (activeStoryIndex > 0) goToStory(activeStoryIndex - 1)
  }

  const step = cardWidth + DESKTOP_GAP

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 overflow-hidden transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
      )}
      onClick={close}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Sizing reference */}
      <div
        ref={measureRef}
        className="pointer-events-none invisible absolute"
        style={{ width: "min(85vw, 400px)" }}
      />

      {/* Cards */}
      {stories.map((story, i) => {
        const offset = i - activeStoryIndex
        const isActive = offset === 0
        const distance = Math.abs(offset)
        const scale = isActive ? 1 : Math.max(0.78, 1 - distance * 0.1)
        const opacity = isActive ? 1 : Math.max(0.4, 1 - distance * 0.25)

        return (
          <div
            key={story.id}
            className={cn(
              "absolute top-1/2 left-1/2 transition-all duration-400 ease-out",
              isVisible ? "scale-100" : "scale-90",
            )}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(85vw, 400px)",
              height: "min(90dvh, 720px)",
              transform: `translate(-50%, -50%) translateX(${offset * step}px) scale(${scale})`,
              opacity,
              zIndex: isActive ? 10 : 5 - distance,
            }}
          >
            {isActive ? (
              <ActiveStoryCard
                story={story}
                slideIndex={activeSlideIndex}
                progress={progress}
                isPaused={isPaused}
                onTapLeft={goPrev}
                onTapRight={goNext}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onReact={react}
                onPause={pauseTimer}
                onResume={resumeTimer}
                onDurationResolved={setActiveSlideDuration}
              />
            ) : (
              <PreviewStoryCard
                story={story}
                onClick={() => goToStory(i)}
              />
            )}
          </div>
        )
      })}

      {/* Close button */}
      <button
        className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        onClick={close}
      >
        <X className="h-5 w-5" />
      </button>
    </div>,
    document.body,
  )
}
