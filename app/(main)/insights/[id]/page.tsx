import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CompanionInsights } from "@/features/insights"
import { getCompanion } from "@/features/companions/queries"
import { getInsights } from "@/features/insights/queries"

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const companion = await getCompanion(id)

  if (!companion) notFound()

  const insights = await getInsights(id)

  return (
    <div className="mx-auto max-w-lg py-4">
      <div className="flex items-center gap-2 px-4">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/companions/${id}`}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-sm font-medium text-muted-foreground">Relationship Insights</h1>
      </div>
      <CompanionInsights companion={companion} insights={insights} />
    </div>
  )
}
