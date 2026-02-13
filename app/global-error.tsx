"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-dvh items-center justify-center bg-background text-foreground antialiased">
        <div className="space-y-4 text-center">
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={reset}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
