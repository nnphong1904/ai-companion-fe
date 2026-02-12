"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function StoryAvatar({
  name,
  avatarUrl,
  viewed,
  onClick,
}: {
  name: string
  avatarUrl: string
  viewed: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex shrink-0 flex-col items-center gap-1.5"
    >
      <div
        className={cn(
          "rounded-full p-[2.5px]",
          viewed
            ? "bg-muted"
            : "bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500",
        )}
      >
        <Avatar className="h-14 w-14 border-2 border-background">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
      </div>
      <span className="max-w-16 truncate text-xs text-muted-foreground">{name}</span>
    </button>
  )
}
