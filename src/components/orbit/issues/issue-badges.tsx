import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type IssueStatus = "todo" | "in_progress" | "in_review" | "done"
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
    done: { bg: "var(--status-done)", fg: "var(--status-done-foreground)", label: "Completed" },
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
      className={cn(
        "h-6 rounded-sm border-transparent px-3 py-1 text-xs font-medium",
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

/** Category pill using the same tokens as {@link IssueStatusBadge} (homepage task cards). */
export function CategoryTokenBadge({
  label,
  status,
}: {
  label: string
  status: IssueStatus
}) {
  const t = statusVars[status]
  return (
    <TokenBadge
      style={{
        backgroundColor: t.bg,
        color: t.fg,
      }}
    >
      {label}
    </TokenBadge>
  )
}

export type TaskTag = "research" | "development" | "ux-writing" | "design" | "documentation"

const taskTagVars: Record<TaskTag, { bg: string; fg: string; label: string }> = {
  research: {
    bg: "var(--tag-research)",
    fg: "var(--tag-research-foreground)",
    label: "Research",
  },
  design: {
    bg: "var(--tag-design)",
    fg: "var(--tag-design-foreground)",
    label: "Design",
  },
  development: {
    bg: "var(--tag-development)",
    fg: "var(--tag-development-foreground)",
    label: "Development",
  },
  "ux-writing": {
    bg: "var(--tag-ux-writing)",
    fg: "var(--tag-ux-writing-foreground)",
    label: "UX Writing",
  },
  documentation: {
    bg: "var(--tag-documentation)",
    fg: "var(--tag-documentation-foreground)",
    label: "Documentation",
  },
}

/** Kanban / board task category pill with per-tag colors. */
export function TaskTagBadge({ tag }: { tag: TaskTag }) {
  const t = taskTagVars[tag]
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

