"use client"

import { useState } from "react"
import { useStoriesViewer } from "./use-stories"
import { reactToStory } from "@/features/stories/actions"
import type { Story } from "../types"

export function useStoriesSection(initialStories: Story[]) {
  const [stories, setStories] = useState(initialStories)

  const viewer = useStoriesViewer({
    stories,
    onMarkViewed: (storyId) => {
      setStories((prev) =>
        prev.map((s) => (s.id === storyId ? { ...s, viewed: true } : s)),
      )
    },
    onReact: (storyId, slideId, emoji) => {
      reactToStory(storyId, slideId, emoji)
    },
  })

  return { stories, viewer }
}
