import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { IssueStatus, WorkItemStatus } from "@/lib/status"

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

/** Plain status label (e.g. for group headers / icon-only rows). */
export function issueStatusLabel(status: IssueStatus): string {
  return statusVars[status].label
}

// How "full" the progress ring reads for each status (Linear-style circle).
const STATUS_PROGRESS: Record<WorkItemStatus, number> = {
  todo: 0,
  in_progress: 0.5,
  in_review: 0.75,
  completed: 1,
}

/**
 * Linear-style status indicator: an outlined circle with a radial "pie" fill
 * that grows as the issue advances, and a check when completed.
 */
export function IssueStatusIcon({
  status,
  className,
}: {
  status: WorkItemStatus
  className?: string
}) {
  const color = statusVars[status].fg
  const progress = STATUS_PROGRESS[status]
  const r = 3.5
  const circumference = 2 * Math.PI * r

  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("size-[15px] shrink-0", className)}
      aria-hidden
    >
      <circle
        cx="8"
        cy="8"
        r="7"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity={status === "todo" ? 0.55 : 0.9}
      />
      {status === "completed" ? (
        <>
          <circle cx="8" cy="8" r="7.5" fill={color} />
          <path
            d="M4.8 8.3l2.1 2.1 4.3-4.6"
            fill="none"
            stroke="var(--card)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : progress > 0 ? (
        <circle
          cx="8"
          cy="8"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={r * 2}
          strokeDasharray={`${progress * circumference} ${circumference}`}
          transform="rotate(-90 8 8)"
        />
      ) : null}
    </svg>
  )
}

const PRIORITY_LEVEL: Record<IssuePriority, number> = { low: 1, medium: 2, high: 3 }
const PRIORITY_BAR_HEIGHTS = [5, 9, 13]

/** Linear-style priority signal bars (ascending). Inactive bars read as muted. */
export function IssuePriorityBars({
  priority,
  className,
}: {
  priority: IssuePriority
  className?: string
}) {
  const level = PRIORITY_LEVEL[priority]
  const color = priorityVars[priority].color
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("size-4 shrink-0 text-muted-foreground", className)}
      aria-hidden
    >
      {PRIORITY_BAR_HEIGHTS.map((h, i) => (
        <rect
          key={i}
          x={1.5 + i * 4.5}
          y={14 - h}
          width={3}
          height={h}
          rx={1}
          fill={i < level ? color : "currentColor"}
          opacity={i < level ? 1 : 0.3}
        />
      ))}
    </svg>
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
