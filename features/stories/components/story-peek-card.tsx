import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Story } from "../types"

/** Minimal preview card shown peeking from left/right during drag */
export function StoryPeekCard({ story }: { story: Story }) {
  const slide = story.slides[0]
  if (!slide) return null

  return (
    <div className="relative h-full w-full bg-black">
      {/* Slide content fills entire area */}
      <div className="absolute inset-0">
        {slide.type === "text" ? (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center p-8 bg-gradient-to-br",
              slide.backgroundColor,
            )}
          >
            <p className="max-w-sm text-center text-xl font-medium leading-relaxed text-white">
              {slide.content}
            </p>
          </div>
        ) : slide.type === "video" ? (
          <video
            src={slide.content}
            muted
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={slide.content} alt="" className="h-full w-full object-cover" />
        )}
      </div>

      {/* Top overlay: progress + header */}
      <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/60 to-transparent">
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
      </div>
    </div>
  )
}
