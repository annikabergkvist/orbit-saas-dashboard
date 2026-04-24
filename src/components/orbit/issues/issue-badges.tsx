import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type IssueStatus = "todo" | "in_progress" | "in_review" | "done"
type IssuePriority = "low" | "medium" | "high"

// We intentionally map statuses/priorities to CSS tokens (variables) so:
// - we never hardcode colors in React components
// - design updates happen in one place (`globals.css`)
const statusVars: Record<IssueStatus, { bg: string; fg: string; label: string }> =
  {
    todo: { bg: "var(--status-todo)", fg: "var(--status-todo-foreground)", label: "To Do" },
    in_progress: {
      bg: "var(--status-in-progress)",
      fg: "var(--status-in-progress-foreground)",
      label: "In Progress",
    },
    in_review: {
      bg: "var(--status-in-review)",
      fg: "var(--status-in-review-foreground)",
      label: "In Review",
    },
    done: { bg: "var(--status-done)", fg: "var(--status-done-foreground)", label: "Done" },
  }

const priorityVars: Record<
  IssuePriority,
  { bg: string; fg: string; label: string }
> = {
  low: { bg: "var(--priority-low)", fg: "var(--priority-low-foreground)", label: "Low" },
  medium: {
    bg: "var(--priority-medium)",
    fg: "var(--priority-medium-foreground)",
    label: "Medium",
  },
  high: { bg: "var(--priority-high)", fg: "var(--priority-high-foreground)", label: "High" },
}

// Reusable badge wrapper for token-based background/foreground.
function TokenBadge({
  style,
  className,
  children,
}: {
  style: React.CSSProperties
  className?: string
  children: React.ReactNode
}) {
  return (
    <Badge
      variant="secondary"
      // Match KPI delta pill radius (`rounded-md`) instead of the default badge pill.
      className={cn("rounded-sm border-transparent font-medium", className)}
      style={style}
    >
      {children}
    </Badge>
  )
}

export function IssueStatusBadge({ status }: { status: IssueStatus }) {
  const t = statusVars[status]
  return (
    <TokenBadge
      style={{
        backgroundColor: t.bg,
        color: t.fg,
      }}
    >
      {t.label}
    </TokenBadge>
  )
}

export function IssuePriorityBadge({
  priority,
  showBackground = false,
}: {
  priority: IssuePriority
  showBackground?: boolean
}) {
  const t = priorityVars[priority]
  return (
    <TokenBadge
      style={{
        backgroundColor: showBackground ? t.bg : "transparent",
        color: t.fg,
      }}
    >
      {t.label}
    </TokenBadge>
  )
}

