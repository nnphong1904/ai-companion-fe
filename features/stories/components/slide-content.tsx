"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import type { StorySlide } from "../types"

export function SlideContent({
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

  if (slide.type === "text") {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-1 items-center justify-center p-8",
          "bg-gradient-to-br",
          slide.backgroundColor,
        )}
      >
        <p className="max-w-sm text-center text-xl font-medium leading-relaxed text-white">
          {slide.content}
        </p>
      </div>
    )
  }

  if (slide.type === "video") {
    return (
      <div className="h-full w-full bg-black">
        <video
          ref={videoRef}
          src={slide.content}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover"
          onLoadedMetadata={(e) => {
            const video = e.currentTarget
            if (video.duration && isFinite(video.duration)) {
              onDurationResolved?.(video.duration * 1000)
            }
          }}
        />
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-black">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slide.content}
        alt=""
        className="h-full w-full object-cover"
      />
    </div>
  )
}
