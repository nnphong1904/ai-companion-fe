import {
  getMockMemories,
  getMockMessages,
  getRandomAIResponse,
  mockCompanions,
  mockStories,
  mockUser,
} from "./mock-data"
import type { Companion, Memory, Message, Story, User } from "@/types"

// Simulates network latency
function delay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function login(
  ...[]: [email: string, password: string]
): Promise<User> {
  await delay(800)
  return mockUser
}

export async function signup(
  ...[]: [email: string, password: string, name: string]
): Promise<User> {
  await delay(800)
  return mockUser
}

export async function logout(): Promise<void> {
  await delay(300)
}

export async function getMe(): Promise<User> {
  await delay(300)
  return mockUser
}

// ─── Companions ──────────────────────────────────────────────────────────────

export async function getCompanions(): Promise<Companion[]> {
  await delay(600)
  return mockCompanions
}

export async function getCompanion(id: string): Promise<Companion | null> {
  await delay(400)
  return mockCompanions.find((c) => c.id === id) ?? null
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export async function getStories(): Promise<Story[]> {
  await delay(500)
  return mockStories
}

export async function markStoryViewed(...[]: [storyId: string]): Promise<void> {
  await delay(200)
}

export async function reactToStory(
  ...[]: [storyId: string, emoji: string]
): Promise<void> {
  await delay(200)
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export async function getMessages(companionId: string): Promise<Message[]> {
  await delay(600)
  return getMockMessages(companionId)
}

export async function sendMessage(
  companionId: string,
  content: string,
): Promise<{ userMessage: Message; aiResponse: string }> {
  await delay(1200)

  const userMessage: Message = {
    id: `m-${Date.now()}`,
    companionId,
    role: "user",
    content,
    createdAt: new Date().toISOString(),
    isMemory: false,
  }

  return { userMessage, aiResponse: getRandomAIResponse() }
}

export async function toggleMemory(
  ...[]: [messageId: string, isMemory: boolean]
): Promise<void> {
  await delay(300)
}

// ─── Memories ────────────────────────────────────────────────────────────────

export async function getMemories(companionId: string): Promise<Memory[]> {
  await delay(500)
  return getMockMemories(companionId)
}

export async function deleteMemory(
  ...[]: [memoryId: string]
): Promise<void> {
  await delay(300)
}
