import { BottomNav } from "@/components/layout/bottom-nav"
import { DesktopSidebar } from "@/components/layout/desktop-sidebar"

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
