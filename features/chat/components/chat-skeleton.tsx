import { Skeleton } from "@/components/ui/skeleton"

export function ChatSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className={`flex gap-2 ${i % 2 === 1 ? "flex-row-reverse" : ""}`}>
          <Skeleton
            className={`h-16 rounded-2xl ${i % 2 === 1 ? "w-[60%] rounded-br-md" : "w-[75%] rounded-bl-md"}`}
          />
        </div>
      ))}
    </div>
  )
}
