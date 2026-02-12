import { NextRequest, NextResponse } from "next/server"
import { fetchApi, ApiError, transformMemory, type BackendMemory } from "@/lib/api-fetch"

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const data = await fetchApi<BackendMemory>(`/memories/${id}/pin`, {
      method: "PATCH",
    })
    return NextResponse.json({ data: transformMemory(data) })
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500
    const message = error instanceof Error ? error.message : "Failed to toggle pin"
    return NextResponse.json({ error: message }, { status })
  }
}
