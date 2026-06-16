import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { TeamPresence } from "@/lib/team-data"

export function PresenceDot({
  presence,
  ringClassName = "ring-card",
  className,
}: {
  presence: TeamPresence
  ringClassName?: string
  className?: string
}) {
  if (presence === "offline") {
    return (
      <span
        className={cn(
          "absolute right-0 bottom-0 flex size-3 items-center justify-center rounded-full bg-zinc-300 ring-2",
          ringClassName,
          className
        )}
        aria-hidden
      >
        <XIcon className="size-2 text-zinc-600" strokeWidth={2.75} />
      </span>
    )
  }

  return (
    <span
      className={cn(
        "absolute right-0 bottom-0 size-2.5 rounded-full ring-2",
        ringClassName,
        presence === "online" && "bg-emerald-500",
        presence === "away" && "bg-amber-400",
        className
      )}
      aria-hidden
    />
  )
}
