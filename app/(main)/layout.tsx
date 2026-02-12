"use client"

import { BottomNav, DesktopSidebar } from "@/components/bottom-nav"

export default function MainLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <div className="min-h-dvh pb-16 md:pb-0 md:pl-56">
      <DesktopSidebar />
      {children}
      {modal}
      <BottomNav />
    </div>
  )
}
