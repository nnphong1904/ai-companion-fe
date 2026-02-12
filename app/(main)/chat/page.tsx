"use client"

import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MoodBadge } from "@/components/mood-badge"
import { formatRelativeTime } from "@/lib/format"
import * as api from "@/lib/api"
import type { Companion } from "@/types"

function ChatListSkeleton() {
  return (
    <div className="space-y-2 px-4">
      {Array.from({ length: 4 }, (_, i) => (
        <Card key={i}>
          <CardContent className="flex items-center gap-3 p-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ChatIndexPage() {
  const [companions, setCompanions] = useState<Companion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api.getCompanions().then((data) => {
      setCompanions(data)
      setIsLoading(false)
    })
  }, [])

  return (
    <div className="py-6">
      <header className="px-4 pb-6">
        <h1 className="text-2xl font-bold">Chats</h1>
        <p className="text-sm text-muted-foreground">Pick a companion to chat with</p>
      </header>

      {isLoading ? (
        <ChatListSkeleton />
      ) : (
        <div className="space-y-2 px-4">
          {companions.map((companion) => (
            <Link key={companion.id} href={`/chat/${companion.id}`} className="block">
              <Card className="py-0 transition-colors hover:bg-accent/50">
                <CardContent className="flex items-center gap-3 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={companion.avatarUrl} alt={companion.name} />
                    <AvatarFallback>{companion.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{companion.name}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatRelativeTime(companion.lastInteraction)}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <MoodBadge mood={companion.mood} />
                    </div>
                  </div>
                  <MessageCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
