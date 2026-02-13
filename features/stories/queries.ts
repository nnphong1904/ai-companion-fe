import "server-only";
import {
  fetchApi,
  transformStory,
  type BackendStory,
  type BackendCompanion,
} from "@/lib/api-fetch";
import type { Story } from "@/features/stories/types";
import { buildMockStories } from "./mock-data";

export async function getStories(): Promise<Story[]> {
  const [stories, companions] = await Promise.all([
    fetchApi<BackendStory[] | null>("/stories"),
    fetchApi<BackendCompanion[] | null>("/companions"),
  ]);

  console.log("stories", stories);

  const companionList = companions ?? [];

  // If backend has real stories, use them
  if (stories && stories.length > 0) {
    const companionMap = new Map(companionList.map((c) => [c.id, c]));
    return stories.map((s) =>
      transformStory(s, companionMap.get(s.companion_id)),
    );
  }

  // Fallback to mock stories built from real companion data
  return buildMockStories(companionList);
}
