import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WelcomeStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 flex flex-col items-center gap-8 px-6 text-center duration-700">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Sparkles className="h-10 w-10 text-primary" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to AI Companion
        </h1>
        <p className="mx-auto max-w-sm text-base leading-relaxed text-muted-foreground">
          Choose a companion who understands you. Someone to talk to, share memories with, and grow alongside.
        </p>
      </div>

      <Button size="lg" onClick={onContinue} className="mt-4 gap-2 px-8">
        Continue
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
