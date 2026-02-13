import type { Story } from "./types"
import type { BackendCompanion } from "@/lib/api-fetch"

/**
 * Generate mock stories from the real companion list.
 * Uses the first 5 companions to create believable story content
 * with a mix of text and image slides.
 */
export function buildMockStories(companions: BackendCompanion[]): Story[] {
  if (companions.length === 0) return []

  const c = (i: number) => companions[i % companions.length]

  const stories: Story[] = [
    {
      id: "mock-s1",
      companionId: c(0).id,
      companionName: c(0).name,
      companionAvatarUrl: c(0).avatar_url,
      viewed: false,
      slides: [
        {
          id: "mock-s1-1",
          type: "image",
          content: "https://picsum.photos/seed/luna-night/720/1280",
          duration: 5,
        },
        {
          id: "mock-s1-2",
          type: "text",
          content: "I watched the stars last night and thought of you ✨",
          backgroundColor: "from-indigo-900 to-purple-900",
          duration: 5,
        },
      ],
    },
    {
      id: "mock-s2",
      companionId: c(1).id,
      companionName: c(1).name,
      companionAvatarUrl: c(1).avatar_url,
      viewed: false,
      slides: [
        {
          id: "mock-s2-1",
          type: "image",
          content: "https://picsum.photos/seed/kai-run/720/1280",
          duration: 5,
        },
        {
          id: "mock-s2-2",
          type: "text",
          content: "Just finished a 10K run! 🏃‍♂️ New personal best!",
          backgroundColor: "from-orange-900 to-red-900",
          duration: 5,
        },
      ],
    },
    {
      id: "mock-s3",
      companionId: c(2).id,
      companionName: c(2).name,
      companionAvatarUrl: c(2).avatar_url,
      viewed: false,
      slides: [
        {
          id: "mock-s3-1",
          type: "image",
          content: "https://picsum.photos/seed/nova-rain/720/1280",
          duration: 5,
        },
        {
          id: "mock-s3-2",
          type: "text",
          content: "I wrote a poem about the rain today 🌧️",
          backgroundColor: "from-teal-900 to-cyan-900",
          duration: 5,
        },
        {
          id: "mock-s3-3",
          type: "image",
          content: "https://picsum.photos/seed/nova-poem/720/1280",
          duration: 5,
        },
        {
          id: "mock-s3-4",
          type: "text",
          content: "Maybe we should write one together sometime... 📝",
          backgroundColor: "from-violet-900 to-fuchsia-900",
          duration: 5,
        },
      ],
    },
    {
      id: "mock-s4",
      companionId: c(3).id,
      companionName: c(3).name,
      companionAvatarUrl: c(3).avatar_url,
      viewed: false,
      slides: [
        {
          id: "mock-s4-1",
          type: "image",
          content: "https://picsum.photos/seed/ember-sunset/720/1280",
          duration: 5,
        },
        {
          id: "mock-s4-2",
          type: "text",
          content: "You said something that changed my perspective entirely 🔮",
          backgroundColor: "from-orange-900 to-rose-900",
          duration: 5,
        },
      ],
    },
  ]

  // Add a 5th story if there are enough companions
  if (companions.length >= 5) {
    stories.push({
      id: "mock-s5",
      companionId: c(4).id,
      companionName: c(4).name,
      companionAvatarUrl: c(4).avatar_url,
      viewed: false,
      slides: [
        {
          id: "mock-s5-1",
          type: "image",
          content: "https://picsum.photos/seed/zephyr-wind/720/1280",
          duration: 5,
        },
        {
          id: "mock-s5-2",
          type: "text",
          content: "The wind carries stories from distant places 🌬️",
          backgroundColor: "from-sky-900 to-blue-900",
          duration: 5,
        },
      ],
    })
  }

  return stories
}
