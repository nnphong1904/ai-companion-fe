import { ChatListSkeleton } from "@/features/chat"

export default function ChatListLoading() {
  return (
    <div className="py-6">
      <div className="space-y-2 px-4 pt-14">
        <ChatListSkeleton />
      </div>
    </div>
  )
}
