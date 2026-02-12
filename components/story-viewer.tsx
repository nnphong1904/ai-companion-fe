"use client"

import { X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { Story, StorySlide } from "@/types"
import { cn } from "@/lib/utils"

const REACTIONS = ["❤️", "😢", "😍", "😡"] as const

function ProgressBars({
  total,
  current,
  progress,
}: {
  total: number
  current: number
  progress: number
}) {
  return (
    <div className="flex gap-1 px-3 pt-3">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
          <div
            className="h-full rounded-full bg-white transition-all duration-100 ease-linear"
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

function SlideContent({ slide }: { slide: StorySlide }) {
  return (
    <div
      className={cn(
        "flex flex-1 items-center justify-center p-8",
        slide.type === "text" && "bg-gradient-to-br",
        slide.backgroundColor,
      )}
    >
      {slide.type === "text" ? (
        <p className="max-w-sm text-center text-xl font-medium leading-relaxed text-white">
          {slide.content}
        </p>
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

export function StoryViewer({
  isOpen,
  story,
  slide,
  slideIndex,
  progress,
  onClose,
  onNext,
  onPrev,
  onReact,
}: {
  isOpen: boolean
  story: Story | null
  slide: StorySlide | null
  slideIndex: number
  progress: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  onReact: (emoji: string) => void
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
        />

        <StoryHeader story={story} onClose={onClose} />

        {/* Tap zones */}
        <div className="relative flex flex-1 overflow-hidden">
          <button
            onClick={onPrev}
            className="absolute inset-y-0 left-0 z-10 w-1/3"
            aria-label="Previous"
          />
          <button
            onClick={onNext}
            className="absolute inset-y-0 right-0 z-10 w-2/3"
            aria-label="Next"
          />
          <SlideContent slide={slide} />
        </div>

        <ReactionBar onReact={onReact} />
      </DialogContent>
    </Dialog>
  )
}
