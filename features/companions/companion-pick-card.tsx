import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { MoodBadge } from "@/features/mood/components/mood-badge"
import { cn } from "@/lib/utils"
import type { Companion } from "@/types/shared"

export function CompanionPickCard({
  companion,
  isSelected,
  onSelect,
}: {
  companion: Companion
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <Card
      className={cn(
        "cursor-pointer py-0 transition-all duration-200",
        isSelected
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : "hover:bg-accent/50",
      )}
      onClick={onSelect}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-14 w-14 shrink-0">
          <AvatarImage src={companion.avatarUrl} alt={companion.name} />
          <AvatarFallback className="text-lg">{companion.name[0]}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{companion.name}</h3>
            <MoodBadge mood={companion.mood} />
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
            {companion.description}
          </p>
        </div>

        <div
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
            isSelected
              ? "border-primary bg-primary"
              : "border-muted-foreground/30",
          )}
        >
          {isSelected ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 text-primary-foreground"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
