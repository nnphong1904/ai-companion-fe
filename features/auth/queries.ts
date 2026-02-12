import "server-only"
import {
  fetchApi,
  transformUser,
  type BackendUser,
} from "@/lib/api-fetch"
import type { User } from "@/features/auth/types"

export async function getMe(): Promise<User> {
  const data = await fetchApi<BackendUser>("/auth/me")
  return transformUser(data)
}
