"use client"

import { createContext, use, useCallback, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import * as api from "@/lib/api"
import type { User } from "@/types"

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
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true)
      try {
        const loggedIn = await api.login(email, password)
        setUser(loggedIn)
        startTransition(() => router.push("/"))
      } finally {
        setIsLoading(false)
      }
    },
    [router],
  )

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      setIsLoading(true)
      try {
        const created = await api.signup(email, password, name)
        setUser(created)
        startTransition(() => router.push("/"))
      } finally {
        setIsLoading(false)
      }
    },
    [router],
  )

  const logout = useCallback(async () => {
    await api.logout()
    setUser(null)
    startTransition(() => router.push("/login"))
  }, [router])

  const state = useMemo<AuthState>(() => ({ user, isLoading }), [user, isLoading])
  const actions = useMemo<AuthActions>(() => ({ login, signup, logout }), [login, signup, logout])
  const value = useMemo(() => ({ state, actions }), [state, actions])

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth(): AuthContextValue {
  const ctx = use(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
