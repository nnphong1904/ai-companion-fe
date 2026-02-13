"use client"

import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProgressBars } from "./progress-bars"
import { SlideContent } from "./slide-content"
import { StoryHeader } from "./story-header"
import { ReactionBarOverlay } from "./reaction-bar"
import { StoryPeekCard } from "./story-peek-card"
import { useSwipeGesture } from "../hooks/use-swipe-gesture"
import type { StoriesViewer } from "../hooks/use-stories"

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

  const { dragX, dragY, dismissProgress, isAnimating, handlers } =
    useSwipeGesture({
      activeIndex: activeStoryIndex,
      totalCount: stories.length,
      onTapLeft: goPrev,
      onTapRight: goNext,
      onSwipeToNext: () => goToStory(activeStoryIndex + 1),
      onSwipeToPrev: () => goToStory(activeStoryIndex - 1),
      onDismiss: close,
      onHoldStart: pauseTimer,
      onHoldEnd: resumeTimer,
      onDragStart: pauseTimer,
      onDragCancel: resumeTimer,
    })

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
        onTouchStart={handlers.onTouchStart}
        onTouchMove={handlers.onTouchMove}
        onTouchEnd={handlers.onTouchEnd}
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
            <div className="absolute inset-0">
              <SlideContent
                key={`${activeStory.id}-${activeSlideIndex}`}
                slide={activeStory.slides[activeSlideIndex]}
                isPaused={isPaused}
                onDurationResolved={setActiveSlideDuration}
              />
            </div>

            <div className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/60 to-transparent">
              <ProgressBars
                total={activeStory.slides.length}
                current={activeSlideIndex}
                progress={progress}
                isPaused={isPaused}
              />
              <StoryHeader story={activeStory} />
            </div>

            <ReactionBarOverlay onReact={react} />
          </div>

          {/* Peek: previous story (left) */}
          {prevStory && dragX > 0 ? (
            <div className="absolute inset-y-0 right-full w-screen bg-black">
              <StoryPeekCard story={prevStory} />
            </div>
          ) : null}

          {/* Peek: next story (right) */}
          {nextStory && dragX < 0 ? (
            <div className="absolute inset-y-0 left-full w-screen bg-black">
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
