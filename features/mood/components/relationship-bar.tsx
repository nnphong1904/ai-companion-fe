import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { getRelationshipLabel } from "../lib/mood"

export function RelationshipBar({
  level,
  className,
}: {
  level: number
  className?: string
}) {
  const label = getRelationshipLabel(level)

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-muted-foreground tabular-nums">{level}%</span>
      </div>
      <Progress value={level} className="h-1.5" />
    </div>
  )
}
