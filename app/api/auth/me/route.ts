import { NextResponse } from "next/server"
import { getMe } from "@/features/auth/queries"
import { ApiError } from "@/lib/api-fetch"

export async function GET() {
  try {
    const user = await getMe()
    return NextResponse.json({ user })
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 })
  }
}
