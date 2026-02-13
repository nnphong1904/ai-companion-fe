import { Home } from "lucide-react"

export const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
] as const

export function isNavActive(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}
