"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  CompanionProfileContent,
  CompanionProfileSkeleton,
} from "@/components/companion-profile"
import * as api from "@/lib/api"
import type { Companion } from "@/types"

export default function CompanionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [companion, setCompanion] = useState<Companion | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api.getCompanion(id).then((data) => {
      setCompanion(data)
      setIsLoading(false)
    })
  }, [id])

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

      {isLoading ? (
        <CompanionProfileSkeleton />
      ) : companion ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CompanionProfileContent companion={companion} />
        </div>
      ) : (
        <div className="px-4 pt-20 text-center">
          <p className="text-muted-foreground">Companion not found.</p>
          <Button asChild variant="link" className="mt-2">
            <Link href="/">Go back to dashboard</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
