export type StorySlide = {
  id: string
  type: "text" | "image"
  content: string
  backgroundColor?: string
  duration: number // seconds
}

export type Story = {
  id: string
  companionId: string
  companionName: string
  companionAvatarUrl: string
  slides: StorySlide[]
  viewed: boolean
}
