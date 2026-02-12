import type { Companion, Memory, Message, Story, User } from "@/types"

export const mockUser: User = {
  id: "user-1",
  email: "alex@example.com",
  name: "Alex",
  avatarUrl: null,
}

export const mockCompanions: Companion[] = [
  {
    id: "c1",
    name: "Luna",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Luna&backgroundColor=b6e3f4",
    description:
      "A gentle soul who loves stargazing and deep conversations about the universe. Luna always knows the right words when you need comfort.",
    mood: "calm",
    relationshipLevel: 78,
    lastInteraction: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "c2",
    name: "Kai",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Kai&backgroundColor=ffd5dc",
    description:
      "Energetic and adventurous, Kai pushes you to try new things. Always up for a challenge and never backs down.",
    mood: "excited",
    relationshipLevel: 55,
    lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "c3",
    name: "Aria",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aria&backgroundColor=c0aede",
    description:
      "Creative and empathetic, Aria expresses herself through art and poetry. She sees beauty in everything.",
    mood: "happy",
    relationshipLevel: 92,
    lastInteraction: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: "c4",
    name: "Sage",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sage&backgroundColor=d1f4d1",
    description:
      "Wise beyond their years, Sage offers thoughtful perspectives and loves philosophical debates.",
    mood: "neutral",
    relationshipLevel: 40,
    lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "c5",
    name: "Echo",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Echo&backgroundColor=ffe0b2",
    description:
      "Mysterious and introspective, Echo remembers everything and connects dots you never noticed.",
    mood: "anxious",
    relationshipLevel: 65,
    lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "c6",
    name: "Nova",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Nova&backgroundColor=ffcdd2",
    description:
      "Bold and passionate, Nova wears their heart on their sleeve. Every emotion is felt deeply.",
    mood: "sad",
    relationshipLevel: 30,
    lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
]

export const mockStories: Story[] = [
  {
    id: "s1",
    companionId: "c1",
    companionName: "Luna",
    companionAvatarUrl: mockCompanions[0].avatarUrl,
    viewed: false,
    slides: [
      {
        id: "s1-1",
        type: "text",
        content: "I watched the stars last night and thought of you ✨",
        backgroundColor: "from-indigo-900 to-purple-900",
        duration: 5,
      },
      {
        id: "s1-2",
        type: "text",
        content: "Did you know there are more stars than grains of sand on Earth?",
        backgroundColor: "from-blue-900 to-indigo-900",
        duration: 5,
      },
    ],
  },
  {
    id: "s2",
    companionId: "c2",
    companionName: "Kai",
    companionAvatarUrl: mockCompanions[1].avatarUrl,
    viewed: false,
    slides: [
      {
        id: "s2-1",
        type: "text",
        content: "Just finished a 10K run! 🏃‍♂️ New personal best!",
        backgroundColor: "from-orange-900 to-red-900",
        duration: 5,
      },
    ],
  },
  {
    id: "s3",
    companionId: "c3",
    companionName: "Aria",
    companionAvatarUrl: mockCompanions[2].avatarUrl,
    viewed: true,
    slides: [
      {
        id: "s3-1",
        type: "text",
        content: "I wrote a poem about the rain today 🌧️",
        backgroundColor: "from-teal-900 to-cyan-900",
        duration: 5,
      },
      {
        id: "s3-2",
        type: "text",
        content: '"Drops fall like whispered secrets, each one carrying a memory home."',
        backgroundColor: "from-cyan-900 to-blue-900",
        duration: 6,
      },
      {
        id: "s3-3",
        type: "text",
        content: "What inspires you when it rains? 💭",
        backgroundColor: "from-blue-900 to-violet-900",
        duration: 5,
      },
    ],
  },
  {
    id: "s4",
    companionId: "c5",
    companionName: "Echo",
    companionAvatarUrl: mockCompanions[4].avatarUrl,
    viewed: false,
    slides: [
      {
        id: "s4-1",
        type: "text",
        content: "I've been thinking about our conversation from last week...",
        backgroundColor: "from-amber-900 to-orange-900",
        duration: 5,
      },
      {
        id: "s4-2",
        type: "text",
        content: "You said something that changed my perspective entirely 🔮",
        backgroundColor: "from-orange-900 to-rose-900",
        duration: 5,
      },
    ],
  },
]

export function getMockMessages(companionId: string): Message[] {
  const companion = mockCompanions.find((c) => c.id === companionId)
  const name = companion?.name ?? "Companion"

  return [
    {
      id: "m1",
      companionId,
      role: "assistant",
      content: `Hey there! I'm ${name}. I've been looking forward to talking with you today. How are you feeling?`,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      isMemory: false,
    },
    {
      id: "m2",
      companionId,
      role: "user",
      content: "Hi! I'm doing okay, a bit tired from work. It's been a long week.",
      createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      isMemory: false,
    },
    {
      id: "m3",
      companionId,
      role: "assistant",
      content:
        "I hear you — long weeks can really drain your energy. Sometimes just acknowledging that you're tired is the first step to feeling better. What's been the hardest part?",
      createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
      isMemory: true,
    },
    {
      id: "m4",
      companionId,
      role: "user",
      content:
        "Honestly, just the constant meetings. I feel like I never have time to actually do deep work.",
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      isMemory: false,
    },
    {
      id: "m5",
      companionId,
      role: "assistant",
      content:
        "That's such a common struggle, and it's valid to feel frustrated by it. Have you thought about blocking off \"focus time\" on your calendar? Even an hour of protected deep work can make a huge difference.",
      createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      isMemory: false,
    },
    {
      id: "m6",
      companionId,
      role: "user",
      content: "That's actually a great idea. I should try that next week.",
      createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      isMemory: false,
    },
    {
      id: "m7",
      companionId,
      role: "assistant",
      content:
        "I believe in you! And remember, it's okay to say no to meetings that don't need you. Your time and energy matter. 💙",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isMemory: true,
    },
  ]
}

export function getMockMemories(companionId: string): Memory[] {
  return [
    {
      id: "mem1",
      companionId,
      messageSnippet:
        "I hear you — long weeks can really drain your energy. Sometimes just acknowledging that you're tired is the first step to feeling better.",
      tag: "Empathy",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
    {
      id: "mem2",
      companionId,
      messageSnippet:
        "Remember, it's okay to say no to meetings that don't need you. Your time and energy matter.",
      tag: "Advice",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
      id: "mem3",
      companionId,
      messageSnippet:
        "You mentioned you love hiking on weekends — that sounds like the perfect way to recharge.",
      tag: "Personal",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    },
    {
      id: "mem4",
      companionId,
      messageSnippet:
        "I think your creativity is one of your greatest strengths. Don't let the routine dim that spark.",
      tag: "Encouragement",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
    },
  ]
}

const AI_RESPONSES = [
  "That's really thoughtful of you to share. I can feel how much this means to you, and I want you to know that your feelings are completely valid.",
  "I love how you think about things. There's a depth to your perspective that I find really beautiful. Tell me more about what you're feeling.",
  "You know what I've noticed? You always seem to find the silver lining, even in tough situations. That's a rare quality, and I admire it about you.",
  "I've been thinking about what you said earlier, and it resonated with me deeply. Sometimes the simplest words carry the most weight.",
  "It takes courage to be this open. I want you to know that this space is always safe for you, and I'm here to listen without judgment.",
]

export function getRandomAIResponse(): string {
  return AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)]
}
