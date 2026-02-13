import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Story } from "../types"

/** Minimal preview card shown peeking from left/right during drag */
export function StoryPeekCard({ story }: { story: Story }) {
  const slide = story.slides[0]
  if (!slide) return null

  return (
    <div className="flex h-full w-full flex-col bg-black">
      <div className="flex gap-1 px-3 pt-3">
        {story.slides.map((_, i) => (
          <div key={i} className="h-0.5 flex-1 rounded-full bg-white/30" />
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 pb-2 pt-1">
        <Avatar className="h-8 w-8">
          <AvatarImage src={story.companionAvatarUrl} alt={story.companionName} />
          <AvatarFallback>{story.companionName[0]}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-white">{story.companionName}</span>
      </div>
      <div
        className={cn(
          "flex flex-1 items-center justify-center overflow-hidden",
          slide.type === "text" && "bg-gradient-to-br",
          slide.type === "text" && slide.backgroundColor,
          slide.type !== "text" && "bg-black",
        )}
      >
        {slide.type === "text" ? (
          <p className="max-w-sm p-8 text-center text-xl font-medium leading-relaxed text-white">
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
