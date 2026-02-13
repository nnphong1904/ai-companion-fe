"use client"

import { useEffect } from "react"
import type { Story } from "../types"

/**
 * Speculatively prefetches the next slide (and next story's first slide)
 * so assets are cached before auto-advance fires.
 */
export function usePrefetchSlides(
  stories: Story[],
  activeStoryIndex: number,
  activeSlideIndex: number,
) {
  useEffect(() => {
    if (activeStoryIndex < 0) return

    const story = stories[activeStoryIndex]
    if (!story) return

    const targets: string[] = []

    // Next slide in current story
    const nextSlide = story.slides[activeSlideIndex + 1]
    if (nextSlide && nextSlide.type !== "text") {
      targets.push(nextSlide.content)
    }

    // If on last slide, prefetch next story's first slide
    if (activeSlideIndex >= story.slides.length - 1) {
      const nextStory = stories[activeStoryIndex + 1]
      const firstSlide = nextStory?.slides[0]
      if (firstSlide && firstSlide.type !== "text") {
        targets.push(firstSlide.content)
      }
    }

    for (const url of targets) {
      const img = new Image()
      img.src = url
    }
  }, [activeStoryIndex, activeSlideIndex, stories])
}
