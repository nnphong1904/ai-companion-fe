import { NextRequest, NextResponse } from "next/server"
import { fetchApi, ApiError } from "@/lib/api-fetch"

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    await fetchApi(`/memories/${id}`, { method: "DELETE" })
    return NextResponse.json({ data: { status: "deleted" } })
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500
    const message = error instanceof Error ? error.message : "Failed to delete memory"
    return NextResponse.json({ error: message }, { status })
  }
}
