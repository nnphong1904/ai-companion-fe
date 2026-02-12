"use client"

import { useState } from "react"
import { ChooseCompanionStep, WelcomeStep } from "@/features/auth"
import { cn } from "@/lib/utils"

export default function OnboardingPage() {
  const [step, setStep] = useState<"welcome" | "choose">("welcome")

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-background via-background to-purple-950/20">
      {step === "welcome" ? (
        <WelcomeStep onContinue={() => setStep("choose")} />
      ) : (
        <ChooseCompanionStep />
      )}

      {/* Step indicator */}
      <div className="fixed bottom-8 flex gap-2">
        <div
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            step === "welcome" ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30",
          )}
        />
        <div
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            step === "choose" ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30",
          )}
        />
      </div>
    </div>
  )
}
