"use client"

import { LogIn, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NAV_ITEMS, isNavActive } from "@/lib/nav-items"
import { useAuth } from "@/features/auth"

export function BottomNav() {
  const pathname = usePathname()
  const { state, actions } = useAuth()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/80 backdrop-blur-lg md:hidden">
      <div className="flex items-center justify-around py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors",
              isNavActive(href, pathname) ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
        {!state.isLoading ? (
          state.user ? (
            <button
              onClick={() => actions.logout()}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs text-muted-foreground transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs text-muted-foreground transition-colors"
            >
              <LogIn className="h-5 w-5" />
              Login
            </Link>
          )
        ) : null}
      </div>
    </nav>
  )
}
