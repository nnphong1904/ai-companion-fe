"use client"

import { useEffect, useRef, useState } from "react"
import type { Story } from "../types"

type UseStoriesViewerArgs = {
  stories: Story[]
  onMarkViewed?: (storyId: string) => void
  onReact?: (storyId: string, slideId: string, emoji: string) => void
}

export function useStoriesViewer({ stories, onMarkViewed, onReact }: UseStoriesViewerArgs) {
  const [activeStoryIndex, setActiveStoryIndex] = useState(-1)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval>>(null)
  const slideStartTimeRef = useRef<number>(0)
  const slideDurationMsRef = useRef<number>(0)

  // Use a ref for the advance callback so the interval always calls the latest version
  const advanceRef = useRef<() => void>(null)

  const isOpen = activeStoryIndex >= 0
  const activeStory = isOpen ? stories[activeStoryIndex] : null
  const activeSlide = activeStory?.slides[activeSlideIndex] ?? null

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  function startTimer(duration: number) {
    clearTimer()
    setProgress(0)
    setIsPaused(false)
    slideStartTimeRef.current = Date.now()
    slideDurationMsRef.current = duration
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
  }

  function pauseTimer() {
    if (!timerRef.current) return
    const elapsed = Date.now() - slideStartTimeRef.current
    slideDurationMsRef.current = Math.max(slideDurationMsRef.current - elapsed, 0)
    clearTimer()
    setIsPaused(true)
  }

  function resumeTimer() {
    if (!isPaused) return
    setIsPaused(false)
    const remaining = slideDurationMsRef.current
    if (remaining <= 0) {
      advanceRef.current?.()
      return
    }
    slideStartTimeRef.current = Date.now()
    const interval = 50
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (interval / remaining) * 100
        if (next >= 100) {
          advanceRef.current?.()
          return 0
        }
        return next
      })
    }, interval)
  }

  // Override slide duration (used when video reports its actual duration)
  function setActiveSlideDuration(durationMs: number) {
    startTimer(durationMs)
  }

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
        // Don't start timer for video — let video's onLoadedMetadata handle it
        if (slide?.type === "video") {
          clearTimer()
        } else {
          startTimer((slide?.duration ?? 5) * 1000)
        }
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
        if (slide?.type === "video") {
          clearTimer()
        } else {
          startTimer((slide?.duration ?? 5) * 1000)
        }
      } else {
        clearTimer()
        setActiveStoryIndex(-1)
        setActiveSlideIndex(0)
        setProgress(0)
      }
    }
  })

  function open(storyIndex: number) {
    setActiveStoryIndex(storyIndex)
    setActiveSlideIndex(0)
    setProgress(0)
    setIsPaused(false)
    const story = stories[storyIndex]
    if (story && !story.viewed) {
      onMarkViewed?.(story.id)
    }
    const slide = story?.slides[0]
    if (slide?.type === "video") {
      // Don't start timer — video's metadata callback will set the duration
      clearTimer()
    } else {
      startTimer((slide?.duration ?? 5) * 1000)
    }
  }

  function close() {
    clearTimer()
    setActiveStoryIndex(-1)
    setActiveSlideIndex(0)
    setProgress(0)
    setIsPaused(false)
  }

  function goNext() {
    advanceRef.current?.()
  }

  function goPrev() {
    if (activeSlideIndex > 0) {
      const newIndex = activeSlideIndex - 1
      setActiveSlideIndex(newIndex)
      const slide = activeStory?.slides[newIndex]
      if (slide?.type === "video") {
        clearTimer()
      } else {
        startTimer((slide?.duration ?? 5) * 1000)
      }
    } else if (activeStoryIndex > 0) {
      const prevIndex = activeStoryIndex - 1
      setActiveStoryIndex(prevIndex)
      const prevStory = stories[prevIndex]
      const lastSlideIndex = (prevStory?.slides.length ?? 1) - 1
      setActiveSlideIndex(lastSlideIndex)
      const slide = prevStory?.slides[lastSlideIndex]
      if (slide?.type === "video") {
        clearTimer()
      } else {
        startTimer((slide?.duration ?? 5) * 1000)
      }
    }
  }

  function react(emoji: string) {
    if (activeStory && activeSlide) {
      onReact?.(activeStory.id, activeSlide.id, emoji)
    }
  }

  return {
    isOpen,
    activeStory,
    activeSlide,
    activeSlideIndex,
    progress,
    isPaused,
    open,
    close,
    goNext,
    goPrev,
    react,
    pauseTimer,
    resumeTimer,
    setActiveSlideDuration,
  }
}
