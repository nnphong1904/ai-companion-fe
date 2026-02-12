import { NextRequest, NextResponse } from "next/server"
import { getMemories } from "@/features/memories/queries"
import { fetchApi, ApiError, transformMemory, type BackendMemory } from "@/lib/api-fetch"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const memories = await getMemories(id)
    return NextResponse.json({ data: memories })
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500
    const message = error instanceof Error ? error.message : "Failed to get memories"
    return NextResponse.json({ error: message }, { status })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const { content, tag } = await req.json()
    const data = await fetchApi<BackendMemory>(`/companions/${id}/memories`, {
      method: "POST",
      body: JSON.stringify({ content, tag }),
    })
    return NextResponse.json({ data: transformMemory(data) })
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500
    const message = error instanceof Error ? error.message : "Failed to save memory"
    return NextResponse.json({ error: message }, { status })
  }
}
