import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/features/auth/hooks/use-auth"
import { getAuthToken } from "@/lib/api-fetch"
import { getMe } from "@/features/auth/queries"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "AI Companion",
  description: "Your personal AI companion — chat, connect, and create memories together.",
  other: { "color-scheme": "dark" },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const token = await getAuthToken()
  const initialUser = token ? await getMe().catch(() => null) : null

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider initialUser={initialUser}>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
