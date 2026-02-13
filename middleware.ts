import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const AUTH_COOKIE = "auth-token"

// Routes that require authentication
const PROTECTED_PREFIXES = ["/chat/", "/memories/", "/insights/"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(AUTH_COOKIE)?.value

  if (!token && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/chat/:path*", "/memories/:path*", "/insights/:path*"],
}
