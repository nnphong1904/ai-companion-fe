import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Story } from "../types"

export function StoryHeader({ story }: { story: Story }) {
  return (
    <div className="flex items-center gap-2 px-3 pb-2 pt-1">
      <Avatar className="h-8 w-8">
        <AvatarImage src={story.companionAvatarUrl} alt={story.companionName} />
        <AvatarFallback>{story.companionName[0]}</AvatarFallback>
      </Avatar>
      <span className="flex-1 text-sm font-medium text-white">{story.companionName}</span>
    </div>
  )
}
