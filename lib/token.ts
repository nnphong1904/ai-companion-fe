const COOKIE_NAME = "auth-token"
const MAX_AGE = 86400 // 24 hours

export function setToken(token: string): void {
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${MAX_AGE}; SameSite=Lax`
}

export function getToken(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
  return match ? match[1] : null
}

export function removeToken(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
}
