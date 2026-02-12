import { NextRequest, NextResponse } from "next/server"
import { getMessages } from "@/features/chat/queries"
import { fetchApi, ApiError, transformMessage, type BackendMessage } from "@/lib/api-fetch"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const messages = await getMessages(id)
    return NextResponse.json({ data: messages })
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500
    const message = error instanceof Error ? error.message : "Failed to get messages"
    return NextResponse.json({ error: message }, { status })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const { content } = await req.json()
    const data = await fetchApi<BackendMessage[]>(`/companions/${id}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    })
    return NextResponse.json({
      data: {
        userMessage: transformMessage(data[0]),
        companionMessage: transformMessage(data[1]),
      },
    })
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500
    const message = error instanceof Error ? error.message : "Failed to send message"
    return NextResponse.json({ error: message }, { status })
  }
}
