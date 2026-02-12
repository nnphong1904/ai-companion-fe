"use client"

import { Trash2 } from "lucide-react"
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
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/format"
import type { Memory } from "../types"

export function MemoryCard({
  memory,
  onDelete,
}: {
  memory: Memory
  onDelete: (id: string) => void
}) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="secondary">{memory.tag}</Badge>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="text-muted-foreground transition-colors hover:text-destructive">
                <Trash2 className="h-4 w-4" />
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

        <p className="text-sm leading-relaxed text-foreground/90">
          &ldquo;{memory.messageSnippet}&rdquo;
        </p>

        <time className="block text-xs text-muted-foreground">
          {formatDate(memory.createdAt)}
        </time>
      </CardContent>
    </Card>
  )
}
