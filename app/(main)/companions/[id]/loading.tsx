import { CompanionProfileSkeleton } from "@/features/companions/companion-profile-skeleton"

export default function CompanionLoading() {
  return (
    <div className="mx-auto max-w-lg py-4">
      <CompanionProfileSkeleton />
    </div>
  )
}
