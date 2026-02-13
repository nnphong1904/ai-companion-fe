import ReactDOM from "react-dom"
import type { Story } from "../types"

/**
 * SSR preload — call from a server component.
 * Injects <link rel="preload"> into <head> for the first slide of each story.
 */
export function preloadStoryAssets(stories: Story[]) {
  for (const story of stories) {
    const firstSlide = story.slides[0]
    if (firstSlide?.type === "image") {
      ReactDOM.preload(firstSlide.content, { as: "image" })
    } else if (firstSlide?.type === "video") {
      ReactDOM.preload(firstSlide.content, { as: "video" })
    }
  }
}
