import { NextRequest, NextResponse } from "next/server"
import { fetchApi, ApiError, transformUser, type BackendUser } from "@/lib/api-fetch"

const COOKIE_NAME = "auth-token"
const MAX_AGE = 86400

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const data = await fetchApi<{ token: string; user: BackendUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    const { token, user: backendUser } = data
    const user = transformUser(backendUser)

    const res = NextResponse.json({ user })
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE,
    })
    return res
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500
    const message = error instanceof Error ? error.message : "Login failed"
    return NextResponse.json({ error: message }, { status })
  }
}
