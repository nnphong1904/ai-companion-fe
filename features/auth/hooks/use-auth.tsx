"use client"

import { createContext, use, useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import * as api from "@/lib/api"
import { getToken, removeToken, setToken } from "@/lib/token"
import type { User } from "../types"

type AuthState = {
  user: User | null
  isLoading: boolean
}

type AuthActions = {
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

type AuthContextValue = {
  state: AuthState
  actions: AuthActions
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)

  // Restore session from token cookie on mount
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setIsLoading(false)
      return
    }
    api
      .getMe(token)
      .then(setUser)
      .catch(() => removeToken())
      .finally(() => setIsLoading(false))
  }, [])

  async function login(email: string, password: string) {
    setIsLoading(true)
    try {
      const { token, user: loggedIn } = await api.login(email, password)
      setToken(token)
      setUser(loggedIn)
      startTransition(() => router.push("/"))
    } finally {
      setIsLoading(false)
    }
  }

  async function signup(email: string, password: string, name: string) {
    setIsLoading(true)
    try {
      const { token, user: created } = await api.signup(email, password, name)
      setToken(token)
      setUser(created)
      startTransition(() => router.push("/onboarding"))
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    await api.logout()
    removeToken()
    setUser(null)
    startTransition(() => router.push("/login"))
  }

  const state: AuthState = { user, isLoading }
  const actions: AuthActions = { login, signup, logout }

  return <AuthContext value={{ state, actions }}>{children}</AuthContext>
}

export function useAuth(): AuthContextValue {
  const ctx = use(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
