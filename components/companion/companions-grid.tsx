import { CompanionCard } from "./companion-card"
import type { Companion } from "@/types/shared"

export function CompanionsGrid({ companions }: { companions: Companion[] }) {
  return (
    <section className="px-4">
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">Your Companions</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companions.map((companion) => (
          <CompanionCard key={companion.id} companion={companion} />
        ))}
      </div>
    </section>
  )
}
