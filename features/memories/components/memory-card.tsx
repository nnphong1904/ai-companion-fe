"use client"

import { Pin, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatRelativeTime } from "@/lib/format"
import type { Memory } from "../types"

export function MemoryCard({
  memory,
  onDelete,
  onTogglePin,
}: {
  memory: Memory
  onDelete: (id: string) => void
  onTogglePin?: (id: string) => void
}) {
  return (
    <div
      className={cn(
        "group rounded-xl border bg-card p-4 transition-colors",
        memory.pinned && "border-amber-500/30 bg-amber-500/5",
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {memory.pinned ? (
            <Pin className="h-3 w-3 fill-current text-amber-400" />
          ) : null}
          <time className="text-xs text-muted-foreground">
            {formatRelativeTime(memory.createdAt)}
          </time>
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onTogglePin ? (
            <button
              onClick={() => onTogglePin(memory.id)}
              className={cn(
                "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-amber-400",
                memory.pinned && "text-amber-400",
              )}
            >
              <Pin className={cn("h-3.5 w-3.5", memory.pinned && "fill-current")} />
            </button>
          ) : null}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete memory?</AlertDialogTitle>
                <AlertDialogDescription>
                  This memory will be permanently removed. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(memory.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-foreground/90">
        &ldquo;{memory.content}&rdquo;
      </p>

      {memory.tag ? (
        <div className="mt-3">
          <Badge variant="secondary" className="text-[10px] font-normal">
            {memory.tag}
          </Badge>
        </div>
      ) : null}
    </div>
  )
}
