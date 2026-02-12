import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CompanionProfileContent } from "@/features/companions"
import { getCompanion } from "@/features/companions/queries"

export default async function CompanionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const companion = await getCompanion(id)

  if (!companion) notFound()

  return (
    <div className="mx-auto max-w-lg py-4">
      <div className="px-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CompanionProfileContent companion={companion} />
      </div>
    </div>
  )
}
