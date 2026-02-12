"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Story } from "@/types"

type UseStoriesViewerArgs = {
  stories: Story[]
  onMarkViewed?: (storyId: string) => void
  onReact?: (storyId: string, emoji: string) => void
}

export function useStoriesViewer({ stories, onMarkViewed, onReact }: UseStoriesViewerArgs) {
  const [activeStoryIndex, setActiveStoryIndex] = useState(-1)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval>>(null)

  // Use a ref for the advance callback so the interval always calls the latest version
  const advanceRef = useRef<() => void>(null)

  const isOpen = activeStoryIndex >= 0
  const activeStory = isOpen ? stories[activeStoryIndex] : null
  const activeSlide = activeStory?.slides[activeSlideIndex] ?? null

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback(
    (duration: number) => {
      clearTimer()
      setProgress(0)
      const interval = 50
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          const next = prev + (interval / duration) * 100
          if (next >= 100) {
            advanceRef.current?.()
            return 0
          }
          return next
        })
      }, interval)
    },
    [clearTimer],
  )

  // Keep advanceRef in sync — safe inside useEffect
  useEffect(() => {
    advanceRef.current = () => {
      const story = stories[activeStoryIndex]
      if (!story) return

      if (activeSlideIndex < story.slides.length - 1) {
        const nextSlide = activeSlideIndex + 1
        setActiveSlideIndex(nextSlide)
        setProgress(0)
        const slide = story.slides[nextSlide]
        startTimer((slide?.duration ?? 5) * 1000)
      } else if (activeStoryIndex < stories.length - 1) {
        const nextIndex = activeStoryIndex + 1
        setActiveStoryIndex(nextIndex)
        setActiveSlideIndex(0)
        setProgress(0)
        const nextStory = stories[nextIndex]
        if (nextStory && !nextStory.viewed) {
          onMarkViewed?.(nextStory.id)
        }
        const slide = nextStory?.slides[0]
        startTimer((slide?.duration ?? 5) * 1000)
      } else {
        clearTimer()
        setActiveStoryIndex(-1)
        setActiveSlideIndex(0)
        setProgress(0)
      }
    }
  }, [activeStoryIndex, activeSlideIndex, stories, onMarkViewed, clearTimer, startTimer])

  const open = useCallback(
    (storyIndex: number) => {
      setActiveStoryIndex(storyIndex)
      setActiveSlideIndex(0)
      setProgress(0)
      const story = stories[storyIndex]
      if (story && !story.viewed) {
        onMarkViewed?.(story.id)
      }
      const slideDur = (story?.slides[0]?.duration ?? 5) * 1000
      startTimer(slideDur)
    },
    [stories, onMarkViewed, startTimer],
  )

  const close = useCallback(() => {
    clearTimer()
    setActiveStoryIndex(-1)
    setActiveSlideIndex(0)
    setProgress(0)
  }, [clearTimer])

  const goNext = useCallback(() => {
    advanceRef.current?.()
  }, [])

  const goPrev = useCallback(() => {
    if (activeSlideIndex > 0) {
      const newIndex = activeSlideIndex - 1
      setActiveSlideIndex(newIndex)
      const slide = activeStory?.slides[newIndex]
      startTimer((slide?.duration ?? 5) * 1000)
    } else if (activeStoryIndex > 0) {
      const prevIndex = activeStoryIndex - 1
      setActiveStoryIndex(prevIndex)
      const prevStory = stories[prevIndex]
      const lastSlideIndex = (prevStory?.slides.length ?? 1) - 1
      setActiveSlideIndex(lastSlideIndex)
      const slide = prevStory?.slides[lastSlideIndex]
      startTimer((slide?.duration ?? 5) * 1000)
    }
  }, [activeSlideIndex, activeStoryIndex, activeStory, stories, startTimer])

  const react = useCallback(
    (emoji: string) => {
      if (activeStory) {
        onReact?.(activeStory.id, emoji)
      }
    },
    [activeStory, onReact],
  )

  return {
    isOpen,
    activeStory,
    activeSlide,
    activeSlideIndex,
    progress,
    open,
    close,
    goNext,
    goPrev,
    react,
  }
}
