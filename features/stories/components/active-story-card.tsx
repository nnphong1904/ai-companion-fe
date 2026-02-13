"use client"

import { ProgressBars } from "./progress-bars"
import { SlideContent } from "./slide-content"
import { StoryHeader } from "./story-header"
import { ReactionBar } from "./reaction-bar"
import { GestureArea } from "./gesture-area"
import type { Story } from "../types"

export function ActiveStoryCard({
  story,
  slideIndex,
  progress,
  isPaused,
  onTapLeft,
  onTapRight,
  onSwipeLeft,
  onSwipeRight,
  onReact,
  onPause,
  onResume,
  onDurationResolved,
}: {
  story: Story
  slideIndex: number
  progress: number
  isPaused: boolean
  onTapLeft: () => void
  onTapRight: () => void
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onReact: (emoji: string) => void
  onPause: () => void
  onResume: () => void
  onDurationResolved: (ms: number) => void
}) {
  const slide = story.slides[slideIndex]
  if (!slide) return null

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-black md:rounded-2xl">
      <ProgressBars
        total={story.slides.length}
        current={slideIndex}
        progress={progress}
        isPaused={isPaused}
      />
      <StoryHeader story={story} />
      <GestureArea
        onTapLeft={onTapLeft}
        onTapRight={onTapRight}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
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
    </div>
  )
}
