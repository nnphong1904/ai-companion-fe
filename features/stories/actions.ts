"use server"

import { fetchApi, REACTION_MAP } from "@/lib/api-fetch"

export async function reactToStory(
  storyId: string,
  mediaId: string,
  emoji: string,
): Promise<void> {
  // Skip API call for mock stories
  if (storyId.startsWith("mock-")) return

  const reaction = REACTION_MAP[emoji] ?? "love"
  await fetchApi(`/stories/${storyId}/react`, {
    method: "POST",
    body: JSON.stringify({ media_id: mediaId, reaction }),
  })
}
