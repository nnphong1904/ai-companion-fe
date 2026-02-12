import { NextResponse } from "next/server"
import { getStories } from "@/features/stories/queries"
import { ApiError } from "@/lib/api-fetch"

export async function GET() {
  try {
    const stories = await getStories()
    return NextResponse.json({ data: stories })
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500
    const message = error instanceof Error ? error.message : "Failed to get stories"
    return NextResponse.json({ error: message }, { status })
  }
}
