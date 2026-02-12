import Link from "next/link"
import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { CompanionCard } from "./companion-card"
import type { Companion } from "@/types/shared"

export function CompanionsGrid({
  companions,
  showAdd,
}: {
  companions: Companion[]
  showAdd?: boolean
}) {
  return (
    <section className="px-4">
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">Your Companions</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companions.map((companion) => (
          <CompanionCard key={companion.id} companion={companion} />
        ))}
        {showAdd ? (
          <Link href="/companions/add">
            <Card className="group h-full cursor-pointer border-dashed transition-colors hover:bg-accent/50">
              <CardContent className="flex flex-col items-center justify-center gap-3 p-5 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/10">
                  <Plus className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold leading-none">Add Companion</h3>
                  <p className="text-xs text-muted-foreground">Connect with someone new</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ) : null}
      </div>
    </section>
  )
}
