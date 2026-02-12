import type { User } from "@/features/auth/types"

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "Request failed")
  }
  return data as T
}

export async function login(email: string, password: string): Promise<User> {
  const { user } = await request<{ user: User }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
  return user
}

export async function signup(
  email: string,
  password: string,
  name: string,
): Promise<User> {
  const { user } = await request<{ user: User }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  })
  return user
}

export async function logout(): Promise<void> {
  await request("/api/auth/logout", { method: "POST" })
}

export async function getMe(): Promise<User> {
  const { user } = await request<{ user: User }>("/api/auth/me")
  return user
}
