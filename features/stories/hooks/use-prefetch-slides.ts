"use client"

import { useEffect } from "react"
import { preload } from "react-dom"
import type { Story } from "../types"

/**
 * Speculatively prefetches the next slide (and next story's first slide)
 * so assets are cached before auto-advance fires.
 *
 * Uses React's built-in preload() API (React 19+) which integrates with
 * Next.js to inject <link rel="preload"> into <head> without manual DOM manipulation.
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

    // Next slide in current story
    const nextSlide = story.slides[activeSlideIndex + 1]
    if (nextSlide && nextSlide.type !== "text") {
      preload(nextSlide.content, { as: nextSlide.type === "video" ? "video" : "image" })
    }

    // If on last slide, prefetch next story's first slide
    if (activeSlideIndex >= story.slides.length - 1) {
      const nextStory = stories[activeStoryIndex + 1]
      const firstSlide = nextStory?.slides[0]
      if (firstSlide && firstSlide.type !== "text") {
        preload(firstSlide.content, { as: firstSlide.type === "video" ? "video" : "image" })
      }
    }
  }, [activeStoryIndex, activeSlideIndex, stories])
}
