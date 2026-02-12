"use client"

import { Button } from "@/components/ui/button"

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-20 text-center">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted-foreground">
        We couldn&apos;t load your dashboard. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
