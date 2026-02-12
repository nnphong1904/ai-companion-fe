"use client"

import { BookOpen, MessageCircle } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoodBadge } from "@/features/mood"
import { RelationshipBar } from "@/features/mood"
import type { Companion } from "@/types/shared"

export function CompanionProfileContent({
  companion,
  onNavigate,
}: {
  companion: Companion
  onNavigate?: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-6 px-4 pt-4">
      <Avatar className="h-28 w-28 border-4 border-primary/20">
        <AvatarImage src={companion.avatarUrl} alt={companion.name} />
        <AvatarFallback className="text-3xl">{companion.name[0]}</AvatarFallback>
      </Avatar>

      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">{companion.name}</h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {companion.description}
        </p>
      </div>

      <MoodBadge mood={companion.mood} className="text-sm" />

      <RelationshipBar level={companion.relationshipLevel} className="w-full max-w-xs" />

      <div className="flex w-full max-w-xs gap-3">
        <Button asChild className="flex-1" onClick={onNavigate}>
          <Link href={`/chat/${companion.id}`}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat
          </Link>
        </Button>
        <Button asChild variant="secondary" className="flex-1" onClick={onNavigate}>
          <Link href={`/memories/${companion.id}`}>
            <BookOpen className="mr-2 h-4 w-4" />
            Memories
          </Link>
        </Button>
      </div>
    </div>
  )
}
