import { BottomNav, DesktopSidebar } from "@/components/layout"

export const dynamic = "force-dynamic"

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
