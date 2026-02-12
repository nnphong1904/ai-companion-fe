import { NextRequest, NextResponse } from "next/server"
import { fetchApi, ApiError } from "@/lib/api-fetch"

export async function POST(req: NextRequest) {
  try {
    const { companion_id } = await req.json()
    const data = await fetchApi("/onboarding/select-companion", {
      method: "POST",
      body: JSON.stringify({ companion_id }),
    })
    return NextResponse.json({ data })
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500
    const message = error instanceof Error ? error.message : "Failed to select companion"
    return NextResponse.json({ error: message }, { status })
  }
}
