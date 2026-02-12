import { getAllCompanions } from "@/features/companions/queries"
import { OnboardingClient } from "./onboarding-client"

export const dynamic = "force-dynamic"

export default async function OnboardingPage() {
  const companions = await getAllCompanions()

  return <OnboardingClient companions={companions} />
}
