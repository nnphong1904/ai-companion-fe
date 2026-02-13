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
    type: m.media_type,
    content: m.media_url,
    duration: m.duration,
  };
}

export async function getStories(): Promise<Story[]> {
  const data = await fetchApi<StoriesResponse>("/stories").catch(() => null);

  const groups = data?.companions ?? [];
  if (groups.length === 0) return [];

  return groups.map((group) => {
    // Merge all media across the companion's stories into one slide list
    const slides = group.stories
      .flatMap((s) => s.media)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mediaToSlide);

    return {
      id: group.companion_id,
      companionId: group.companion_id,
      companionName: group.companion_name,
      companionAvatarUrl: group.avatar_url,
      slides,
      viewed: false,
    };
  });
}
