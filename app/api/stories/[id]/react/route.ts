import { NextRequest, NextResponse } from "next/server"
import { fetchApi, ApiError, REACTION_MAP } from "@/lib/api-fetch"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const { media_id, reaction: emoji } = await req.json()
    const reaction = REACTION_MAP[emoji] ?? emoji
    await fetchApi(`/stories/${id}/react`, {
      method: "POST",
      body: JSON.stringify({ media_id, reaction }),
    })
    return NextResponse.json({ data: { status: "ok" } })
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500
    const message = error instanceof Error ? error.message : "Failed to react"
    return NextResponse.json({ error: message }, { status })
  }
}
