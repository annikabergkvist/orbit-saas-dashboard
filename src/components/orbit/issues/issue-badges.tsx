import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { IssueStatus } from "@/lib/status"

export type { IssueStatus, MyTaskStatus, WorkItemStatus } from "@/lib/status"

type IssuePriority = "low" | "medium" | "high"

// We intentionally map statuses/priorities to CSS tokens (variables) so:
// - we never hardcode colors in React components
// - design updates happen in one place (`globals.css`)
const statusVars: Record<IssueStatus, { bg: string; fg: string; label: string }> = {
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
  completed: {
    bg: "var(--status-completed)",
    fg: "var(--status-completed-foreground)",
    label: "Completed",
  },
  overdue: {
    bg: "var(--status-overdue)",
    fg: "var(--status-overdue-foreground)",
    label: "Overdue",
  },
}

const priorityVars: Record<IssuePriority, { color: string; label: string }> = {
  low: { color: "var(--priority-low-foreground)", label: "Low" },
  medium: { color: "var(--priority-medium-foreground)", label: "Medium" },
  high: { color: "var(--priority-high-foreground)", label: "High" },
}


export type TaskTag = "research" | "development" | "ux-writing" | "design" | "documentation"

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
      className={cn(
        "h-6 rounded-full border-transparent px-3 py-1 text-xs font-medium",
        className
      )}
      style={style}
    >
      {children}
    </Badge>
  )
}

/** Left-edge strip on task cards; matches status badge background tokens. */
export function issueStatusStripBackground(status: IssueStatus): string {
  return statusVars[status].bg
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

export function IssuePriorityBadge({ priority }: { priority: IssuePriority }) {
  const t = priorityVars[priority]
  return (
    <TokenBadge
      style={{
        backgroundColor: "transparent",
        color: t.color,
        borderColor: t.color,
        borderWidth: 1.5,
        borderStyle: "solid",
      }}
    >
      {t.label}
    </TokenBadge>
  )
}

/** Neutral project-type pill (Development, Design, Documentation — same grey for all). */
export function CategoryTokenBadge({ label }: { label: string }) {
  return (
    <TokenBadge
      style={{
        backgroundColor: "var(--category-pill-bg, var(--category))",
        color: "var(--category-foreground)",
      }}
    >
      {label}
    </TokenBadge>
  )
}

const taskTagLabels: Record<TaskTag, string> = {
  research: "Research",
  design: "Design",
  development: "Development",
  "ux-writing": "UX Writing",
  documentation: "Documentation",
}

/** Kanban task category pill — same neutral grey as project grid categories. */
export function TaskTagBadge({ tag }: { tag: TaskTag }) {
  return <CategoryTokenBadge label={taskTagLabels[tag]} />
}
