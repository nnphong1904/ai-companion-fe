import "server-only";
import { fetchApi, type BackendStory, type BackendStoryMedia } from "@/lib/api-fetch";
import type { Story, StorySlide } from "@/features/stories/types";

type StoriesCompanionGroup = {
  companion_id: string;
  companion_name: string;
  avatar_url: string;
  latest_at: string;
  stories: BackendStory[];
};

type StoriesResponse = {
  companions: StoriesCompanionGroup[];
};

function mediaToSlide(m: BackendStoryMedia): StorySlide {
  return {
    id: m.id,
    storyId: m.story_id,
    type: m.media_type,
    content: m.media_url,
    duration: m.duration,
  };
}

export async function getStories(): Promise<Story[]> {
  const data = await fetchApi<StoriesResponse>("/stories").catch((err) => {
    console.error("[getStories] fetch error:", err);
    return null;
  });

  console.log("[getStories] raw response:", JSON.stringify(data, null, 2));

  const groups = data?.companions ?? [];
  console.log("[getStories] groups count:", groups.length);
  if (groups.length === 0) return [];

  const stories = groups.map((group) => {
    // Merge all media across the companion's stories into one slide list
    const slides = group.stories
      .flatMap((s) => (s.media ?? []).map((m) => ({ ...m, story_id: m.story_id ?? s.id })))
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mediaToSlide);

    console.log(`[getStories] ${group.companion_name}: ${group.stories.length} stories, ${slides.length} slides`);

    return {
      id: group.companion_id,
      companionId: group.companion_id,
      companionName: group.companion_name,
      companionAvatarUrl: group.avatar_url,
      slides,
      viewed: false,
    };
  });

  console.log("[getStories] returning", stories.length, "stories");
  return stories;
}
