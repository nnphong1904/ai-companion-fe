import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { MoodBadge } from "@/features/mood"
import { RelationshipBar } from "@/features/mood"
import { formatRelativeTime } from "@/lib/format"
import type { Companion } from "@/types/shared"

export function CompanionCard({ companion }: { companion: Companion }) {
  return (
    <Link href={`/companions/${companion.id}`} scroll={false}>
      <Card className="group transition-colors hover:bg-accent/50">
        <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
          <Avatar className="h-16 w-16">
            <AvatarImage src={companion.avatarUrl} alt={companion.name} />
            <AvatarFallback className="text-lg">{companion.name[0]}</AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h3 className="font-semibold leading-none">{companion.name}</h3>
            <p className="text-xs text-muted-foreground">
              {formatRelativeTime(companion.lastInteraction)}
            </p>
          </div>

          <MoodBadge mood={companion.mood} />
          <RelationshipBar level={companion.relationshipLevel} className="w-full" />
        </CardContent>
      </Card>
    </Link>
  )
}
