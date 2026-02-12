"use server"

import { fetchApi } from "@/lib/api-fetch"

export async function selectCompanions(
  companionIds: string[],
): Promise<void> {
  await Promise.all(
    companionIds.map((id) =>
      fetchApi("/onboarding/select-companion", {
        method: "POST",
        body: JSON.stringify({ companion_id: id }),
      }),
    ),
  )
}
