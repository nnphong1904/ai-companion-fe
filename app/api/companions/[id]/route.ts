import { NextRequest, NextResponse } from "next/server"
import { getCompanion } from "@/features/companions/queries"
import { ApiError } from "@/lib/api-fetch"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const companion = await getCompanion(id)
    if (!companion) {
      return NextResponse.json({ error: "Companion not found" }, { status: 404 })
    }
    return NextResponse.json({ data: companion })
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500
    const message = error instanceof Error ? error.message : "Failed to get companion"
    return NextResponse.json({ error: message }, { status })
  }
}
