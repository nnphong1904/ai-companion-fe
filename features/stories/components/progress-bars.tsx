import { cn } from "@/lib/utils"

export function ProgressBars({
  total,
  current,
  progress,
  isPaused,
}: {
  total: number
  current: number
  progress: number
  isPaused?: boolean
}) {
  return (
    <div className="flex gap-1 px-3 pt-3">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
          <div
            className={cn(
              "h-full rounded-full bg-white transition-all duration-100 ease-linear",
              isPaused && i === current && "transition-none",
            )}
            style={{
              width:
                i < current ? "100%" : i === current ? `${progress}%` : "0%",
            }}
          />
        </div>
      ))}
    </div>
  )
}
