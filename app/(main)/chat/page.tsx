import { LogIn, MessageCircle, Search } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MoodBadge } from "@/features/mood"
import { formatRelativeTime } from "@/lib/format"
import { getMyCompanions } from "@/features/companions/queries"
import { getAuthToken } from "@/lib/api-fetch"

export default async function ChatIndexPage() {
  const token = await getAuthToken()
  const companions = token ? await getMyCompanions().catch(() => []) : []

  if (companions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <MessageCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold">
            {token ? "No conversations yet" : "Start chatting"}
          </h2>
          <p className="max-w-xs text-sm text-muted-foreground">
            {token
              ? "Pick a companion from the dashboard to start your first conversation."
              : "Log in to start chatting with your AI companions."}
          </p>
        </div>
        {token ? (
          <Button asChild>
            <Link href="/">
              <Search className="mr-2 h-4 w-4" />
              Browse Companions
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Log In
            </Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="py-6">
      <header className="px-4 pb-6">
        <h1 className="text-2xl font-bold">Chats</h1>
        <p className="text-sm text-muted-foreground">Pick a companion to chat with</p>
      </header>

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
    </div>
  )
}
