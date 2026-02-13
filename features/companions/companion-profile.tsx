"use client"

import { BookOpen, MessageCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoodBadge } from "@/features/mood/components/mood-badge"
import { RelationshipBar } from "@/features/mood/components/relationship-bar"
import type { Companion } from "@/types/shared"

export function CompanionProfileContent({
  companion,
  onNavigate,
  isAuthenticated = true,
}: {
  companion: Companion
  onNavigate?: (href: string) => void
  isAuthenticated?: boolean
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
        <Button asChild className="flex-1">
          <Link
            href={isAuthenticated ? `/chat/${companion.id}` : "/login"}
            onClick={onNavigate && isAuthenticated ? (e) => { e.preventDefault(); onNavigate(`/chat/${companion.id}`) } : undefined}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {isAuthenticated ? "Chat" : "Log in to Chat"}
          </Link>
        </Button>
        {isAuthenticated ? (
          <Button asChild variant="secondary" className="flex-1">
            <Link
              href={`/memories/${companion.id}`}
              onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate(`/memories/${companion.id}`) } : undefined}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Memories
            </Link>
          </Button>
        ) : null}
      </div>
      {isAuthenticated ? (
        <Button asChild variant="outline" size="sm" className="w-full max-w-xs">
          <Link
            href={`/insights/${companion.id}`}
            onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate(`/insights/${companion.id}`) } : undefined}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Relationship Insights
          </Link>
        </Button>
      ) : null}
    </div>
  )
}
