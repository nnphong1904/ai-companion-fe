import { StoryAvatar } from "./story-avatar"
import type { Story } from "../types"

export function StoriesRow({
  stories,
  onOpenStory,
}: {
  stories: Story[]
  onOpenStory: (index: number) => void
}) {
  return (
    <section className="px-4">
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">Stories</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {stories.map((story, i) => (
          <StoryAvatar
            key={story.id}
            name={story.companionName}
            avatarUrl={story.companionAvatarUrl}
            viewed={story.viewed}
            onClick={() => onOpenStory(i)}
          />
        ))}
      </div>
    </section>
  )
}
