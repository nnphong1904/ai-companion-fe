"use client"

import { LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NAV_ITEMS, isNavActive } from "@/lib/nav-items"
import { useAuth } from "@/features/auth"

export function DesktopSidebar() {
  const pathname = usePathname()
  const { state, actions } = useAuth()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col border-r bg-card md:flex">
      <div className="p-5">
        <h1 className="text-lg font-bold">AI Companion</h1>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isNavActive(href, pathname)
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t p-3">
        <button
          onClick={() => actions.logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Logout
          {state.user ? (
            <span className="ml-auto truncate text-xs text-muted-foreground/70">
              {state.user.name}
            </span>
          ) : null}
        </button>
      </div>
    </aside>
  )
}
