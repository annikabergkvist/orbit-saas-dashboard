/** Shared work-item statuses (issues, my tasks, kanban through completed). */
export type WorkItemStatus = "todo" | "in_progress" | "in_review" | "completed"

/** Issue tracker statuses — work items plus overdue. */
export type IssueStatus = WorkItemStatus | "overdue"

/** Kanban column ids (work items through completed). */
export type BoardColumnId = WorkItemStatus

/** Project grid lifecycle tabs. */
export type ProjectLifecycle =
  | "planning"
  | "active"
  | "in_review"
  | "completed"
  | "launched"

/** Dashboard “My Tasks” card — no launched/overdue. */
export type MyTaskStatus = WorkItemStatus

export const PROJECT_LIFECYCLE_LABELS: Record<ProjectLifecycle, string> = {
  planning: "Planning",
  active: "Active",
  in_review: "In Review",
  completed: "Completed",
  launched: "Launched",
}

export const BOARD_COLUMN_LABELS: Record<BoardColumnId, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  completed: "Completed",
}

export function isWorkItemStatus(value: string): value is WorkItemStatus {
  return (
    value === "todo" ||
    value === "in_progress" ||
    value === "in_review" ||
    value === "completed"
  )
}

export function isIssueStatus(value: string): value is IssueStatus {
  return isWorkItemStatus(value) || value === "overdue"
}

export function isBoardColumnId(value: string): value is BoardColumnId {
  return isWorkItemStatus(value)
}

export function isProjectLifecycle(value: string): value is ProjectLifecycle {
  return (
    value === "planning" ||
    value === "active" ||
    value === "in_review" ||
    value === "completed" ||
    value === "launched"
  )
}
