"use client"

import { StoriesRow } from "./stories-row"
import { StoryViewer } from "./story-viewer"
import { useStoriesSection } from "../hooks/use-stories-section"
import type { Story } from "../types"

export function StoriesSection({ initialStories }: { initialStories: Story[] }) {
  const { stories, viewer } = useStoriesSection(initialStories)

  return (
    <>
      <StoriesRow stories={stories} onOpenStory={viewer.open} />
      <StoryViewer
        isOpen={viewer.isOpen}
        story={viewer.activeStory}
        slide={viewer.activeSlide}
        slideIndex={viewer.activeSlideIndex}
        progress={viewer.progress}
        isPaused={viewer.isPaused}
        onClose={viewer.close}
        onNext={viewer.goNext}
        onPrev={viewer.goPrev}
        onReact={viewer.react}
        onPause={viewer.pauseTimer}
        onResume={viewer.resumeTimer}
        onDurationResolved={viewer.setActiveSlideDuration}
      />
    </>
  )
}
