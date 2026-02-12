import { NextResponse } from "next/server"
import { getAllCompanions } from "@/features/companions/queries"
import { ApiError } from "@/lib/api-fetch"

export async function GET() {
  try {
    const companions = await getAllCompanions()
    return NextResponse.json({ data: companions })
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500
    const message = error instanceof Error ? error.message : "Failed to get companions"
    return NextResponse.json({ error: message }, { status })
  }
}
