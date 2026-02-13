import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Story } from "../types"

export function PreviewStoryCard({ story, onClick }: { story: Story; onClick: () => void }) {
  const slide = story.slides[0]
  if (!slide) return null

  return (
    <div
      onClick={onClick}
      className="flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-black/90"
    >
      <div className="flex items-center gap-2 px-3 py-3">
        <Avatar className="h-6 w-6">
          <AvatarImage src={story.companionAvatarUrl} alt={story.companionName} />
          <AvatarFallback className="text-[10px]">{story.companionName[0]}</AvatarFallback>
        </Avatar>
        <span className="truncate text-xs font-medium text-white/80">{story.companionName}</span>
      </div>
      <div
        className={cn(
          "flex flex-1 items-center justify-center overflow-hidden",
          slide.type === "text" && "bg-gradient-to-br p-4",
          slide.type === "text" && slide.backgroundColor,
        )}
      >
        {slide.type === "text" ? (
          <p className="line-clamp-3 text-center text-sm font-medium leading-relaxed text-white/90">
            {slide.content}
          </p>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={slide.content} alt="" className="h-full w-full object-cover" />
        )}
      </div>
    </div>
  )
}
