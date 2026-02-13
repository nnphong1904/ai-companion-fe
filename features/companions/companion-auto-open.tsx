"use client"

import { useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export function CompanionAutoOpen() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const companionId = searchParams.get("companion")
  const handledRef = useRef<string | null>(null)

  useEffect(() => {
    if (!companionId || handledRef.current === companionId) return
    handledRef.current = companionId

    // Replace current URL to remove query param, then push modal route
    window.history.replaceState(null, "", "/")
    router.push(`/companions/${companionId}`, { scroll: false })
  }, [companionId, router])

  return null
}
