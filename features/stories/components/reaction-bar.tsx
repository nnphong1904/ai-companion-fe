"use client"

import { useEmojiConfetti } from "./emoji-confetti"

const REACTIONS = ["❤️", "😢", "😍", "😡"] as const

export function ReactionBar({ onReact }: { onReact: (emoji: string) => void }) {
  const { confetti, trigger } = useEmojiConfetti()

  return (
    <>
      <div className="flex justify-center gap-4 pb-4 pt-2">
        {REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={(e) => {
              e.stopPropagation()
              trigger(emoji, e.clientX, e.clientY)
              onReact(emoji)
            }}
            className="text-2xl transition-transform hover:scale-110 active:scale-125"
          >
            {emoji}
          </button>
        ))}
      </div>
      {confetti}
    </>
  )
}

export function ReactionBarOverlay({ onReact }: { onReact: (emoji: string) => void }) {
  const { confetti, trigger } = useEmojiConfetti()

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/60 to-transparent pb-5 pt-10"
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center gap-4">
          {REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={(e) => {
                e.stopPropagation()
                trigger(emoji, e.clientX, e.clientY)
                onReact(emoji)
              }}
              className="text-2xl transition-transform hover:scale-110 active:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      {confetti}
    </>
  )
}
