export type Message = {
  id: string
  companionId: string
  role: "user" | "assistant"
  content: string
  createdAt: string
  isMemory: boolean
}
