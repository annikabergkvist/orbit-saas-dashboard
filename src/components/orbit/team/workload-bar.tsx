import { cn } from "@/lib/utils"
import type { WorkloadLevel } from "@/lib/team-data"
import { workloadLabel } from "@/lib/team-data"

const barColor: Record<WorkloadLevel, string> = {
  light: "bg-emerald-500",
  balanced: "bg-emerald-500",
  heavy: "bg-amber-400",
  overloaded: "bg-red-500",
}

/** Scale bar against 12 tasks — same cap used for overloaded threshold context. */
const WORKLOAD_CAP = 12

export function WorkloadBar({
  activeCount,
  level,
  className,
}: {
  activeCount: number
  level: WorkloadLevel
  className?: string
}) {
  const width =
    activeCount === 0 ? 0 : Math.max(8, Math.min(100, (activeCount / WORKLOAD_CAP) * 100))

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">Workload</span>
        <span className="font-medium text-foreground">
          {workloadLabel(level)} · {activeCount} {activeCount === 1 ? "task" : "tasks"}
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-foreground/[0.08]"
        role="meter"
        aria-valuenow={activeCount}
        aria-valuemin={0}
        aria-valuemax={WORKLOAD_CAP}
        aria-label={`${workloadLabel(level)} workload, ${activeCount} active tasks`}
      >
        <div
          className={cn("h-full rounded-full transition-all", barColor[level])}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}
