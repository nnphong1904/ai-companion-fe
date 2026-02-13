export function formatRelativeTime(isoDate: string): string {
  const now = Date.now()
  const then = new Date(isoDate).getTime()
  const diffMs = now - then

  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  return new Date(isoDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}
