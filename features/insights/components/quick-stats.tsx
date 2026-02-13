import { BookOpen, Calendar, MessageCircle } from "lucide-react"

export function QuickStats({
  totalMessages,
  totalMemories,
  daysTogether,
}: {
  totalMessages: number
  totalMemories: number
  daysTogether: number
}) {
  const stats = [
    { label: "Messages", value: totalMessages, icon: MessageCircle },
    { label: "Memories", value: totalMemories, icon: BookOpen },
    { label: "Days", value: daysTogether, icon: Calendar },
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center gap-1.5 rounded-xl border border-border/50 bg-card/50 p-3"
        >
          <stat.icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-xl font-bold tabular-nums">{stat.value}</span>
          <span className="text-[10px] text-muted-foreground">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
