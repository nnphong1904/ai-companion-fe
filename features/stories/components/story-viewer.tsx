"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { Story, StorySlide } from "../types"

const REACTIONS = ["❤️", "😢", "😍", "😡"] as const

function ProgressBars({
  total,
  current,
  progress,
  isPaused,
}: {
  total: number
  current: number
  progress: number
  isPaused?: boolean
}) {
  return (
    <div className="flex gap-1 px-3 pt-3">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
          <div
            className={cn(
              "h-full rounded-full bg-white transition-all duration-100 ease-linear",
              isPaused && i === current && "transition-none",
            )}
            style={{
              width:
                i < current ? "100%" : i === current ? `${progress}%` : "0%",
            }}
          />
        </div>
      ))}
    </div>
  )
}

function SlideContent({
  slide,
  isPaused,
  onDurationResolved,
}: {
  slide: StorySlide
  isPaused?: boolean
  onDurationResolved?: (durationMs: number) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (slide.type !== "video" || !videoRef.current) return
    if (isPaused) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch(() => {})
    }
  }, [isPaused, slide.type])

  return (
    <div
      className={cn(
        "flex flex-1 items-center justify-center p-8",
        "animate-in fade-in zoom-in-[0.98] duration-300",
        slide.type === "text" && "bg-gradient-to-br",
        slide.backgroundColor,
      )}
    >
      {slide.type === "text" ? (
        <p className="max-w-sm text-center text-xl font-medium leading-relaxed text-white">
          {slide.content}
        </p>
      ) : slide.type === "video" ? (
        <video
          ref={videoRef}
          src={slide.content}
          autoPlay
          muted
          playsInline
          className="max-h-full max-w-full rounded-lg object-contain"
          onLoadedMetadata={(e) => {
            const video = e.currentTarget
            if (video.duration && isFinite(video.duration)) {
              onDurationResolved?.(video.duration * 1000)
            }
          }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slide.content}
          alt=""
          className="max-h-full max-w-full rounded-lg object-contain"
        />
      )}
    </div>
  )
}

function StoryHeader({
  story,
  onClose,
}: {
  story: Story
  onClose: () => void
}) {
  return (
    <div className="flex items-center gap-2 px-3 pb-2 pt-1">
      <Avatar className="h-8 w-8">
        <AvatarImage src={story.companionAvatarUrl} alt={story.companionName} />
        <AvatarFallback>{story.companionName[0]}</AvatarFallback>
      </Avatar>
      <span className="flex-1 text-sm font-medium text-white">{story.companionName}</span>
      <button
        onClick={onClose}
        className="rounded-full p-1 text-white/80 transition-colors hover:text-white"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

function ReactionBar({ onReact }: { onReact: (emoji: string) => void }) {
  return (
    <div className="flex justify-center gap-4 pb-6 pt-3">
      {REACTIONS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onReact(emoji)}
          className="text-2xl transition-transform active:scale-125"
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}

const SWIPE_THRESHOLD = 50
const HOLD_DELAY = 200

function GestureArea({
  onNext,
  onPrev,
  onPause,
  onResume,
  children,
}: {
  onNext: () => void
  onPrev: () => void
  onPause?: () => void
  onResume?: () => void
  children: React.ReactNode
}) {
  const pointerStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isHoldingRef = useRef(false)

  function handlePointerDown(e: React.PointerEvent) {
    pointerStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() }
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

    // Horizontal swipe detection
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) onNext()
      else onPrev()
      return
    }

    // Tap: left third = prev, right two-thirds = next
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const tapX = e.clientX - rect.left
    if (tapX < rect.width / 3) {
      onPrev()
    } else {
      onNext()
    }
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

export function StoryViewer({
  isOpen,
  story,
  slide,
  slideIndex,
  progress,
  isPaused,
  onClose,
  onNext,
  onPrev,
  onReact,
  onPause,
  onResume,
  onDurationResolved,
}: {
  isOpen: boolean
  story: Story | null
  slide: StorySlide | null
  slideIndex: number
  progress: number
  isPaused?: boolean
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  onReact: (emoji: string) => void
  onPause?: () => void
  onResume?: () => void
  onDurationResolved?: (durationMs: number) => void
}) {
  if (!story || !slide) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex h-dvh max-h-dvh w-screen max-w-none flex-col gap-0 border-0 bg-black p-0 sm:max-w-sm sm:rounded-xl [&>button]:hidden">
        <DialogTitle className="sr-only">{story.companionName}&apos;s story</DialogTitle>

        <ProgressBars
          total={story.slides.length}
          current={slideIndex}
          progress={progress}
          isPaused={isPaused}
        />

        <StoryHeader story={story} onClose={onClose} />

        <GestureArea
          onNext={onNext}
          onPrev={onPrev}
          onPause={onPause}
          onResume={onResume}
        >
          <SlideContent
            key={`${story.id}-${slideIndex}`}
            slide={slide}
            isPaused={isPaused}
            onDurationResolved={onDurationResolved}
          />
        </GestureArea>

        <ReactionBar onReact={onReact} />
      </DialogContent>
    </Dialog>
  )
}
