import type { WorkItemStatus } from "@/lib/status"
import { isDueOverdue, parseDueLabel, projectsSeed } from "@/lib/projects-data"

export type IssuePriority = "low" | "medium" | "high"

export type IssueAssignee = {
  id: string
  name: string
  avatarUrl: string
}

export type IssueComment = {
  id: string
  authorId: string
  body: string
  timeLabel: string
}

export type Issue = {
  id: string
  title: string
  description: string
  status: WorkItemStatus
  priority: IssuePriority
  assigneeId: string
  projectSlug: string
  /** Parsed by parseDueLabel (e.g. "Jun 20", "Completed"). */
  dueLabel: string
  createdLabel: string
  comments: IssueComment[]
}

/** Quick-view tabs above the list. */
export type IssueTab = "all" | "active" | "backlog"

/** Status filter also supports the derived "overdue" pseudo-status. */
export type IssueStatusFilter = WorkItemStatus | "overdue"

export type IssueSortKey = "priority" | "due" | "created" | "title"
export type SortDir = "asc" | "desc"

/**
 * Signed-in user — single source of truth for "assigned to me".
 * Mirrors the user in the app shell (dashboard-shell.tsx).
 */
export const CURRENT_USER: IssueAssignee = {
  id: "u-annika",
  name: "Annika Bergkvist",
  avatarUrl: "/avatars/annika.png?v=2",
}

/** Curated roster used for issue assignment (distinct avatars). */
export const issueAssignees: IssueAssignee[] = [
  CURRENT_USER,
  { id: "u-sara", name: "Sara Chen", avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg" },
  { id: "u-alex", name: "Alex Johnson", avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg" },
  { id: "u-maria", name: "Maria Lopez", avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg" },
  { id: "u-priya", name: "Priya Singh", avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg" },
  { id: "u-chris", name: "Chris Morgan", avatarUrl: "https://randomuser.me/api/portraits/men/52.jpg" },
  { id: "u-ryan", name: "Ryan Cooper", avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg" },
]

const assigneeById = new Map(issueAssignees.map((a) => [a.id, a]))

export function getAssignee(id: string): IssueAssignee | undefined {
  return assigneeById.get(id)
}

const projectTitleBySlug = new Map(projectsSeed.map((p) => [p.slug, p.title]))

export function getProjectTitle(slug: string): string {
  return projectTitleBySlug.get(slug) ?? slug
}

/** Project options for filters / the new-issue form. */
export const issueProjects = projectsSeed.map((p) => ({ slug: p.slug, title: p.title }))

/** Group order + labels for the status-grouped list. */
export const ISSUE_STATUS_ORDER: WorkItemStatus[] = [
  "todo",
  "in_progress",
  "in_review",
  "completed",
]

export const issuesSeed: Issue[] = [
  {
    id: "ORB-201",
    title: "Implement SSO with SAML",
    description:
      "Add SAML-based single sign-on for enterprise workspaces, including IdP-initiated login and SCIM user provisioning.",
    status: "in_progress",
    priority: "high",
    assigneeId: "u-annika",
    projectSlug: "frontend-integration",
    dueLabel: "Jun 20",
    createdLabel: "May 28",
    comments: [
      {
        id: "c-201-1",
        authorId: "u-alex",
        body: "Okta sandbox is ready — I'll drop the IdP metadata URL in the thread.",
        timeLabel: "2d ago",
      },
    ],
  },
  {
    id: "ORB-202",
    title: "Checkout fails with two discount codes",
    description:
      "Applying two stacked discount codes in one cart throws a 500. Reproduces on staging with SAVE10 + WELCOME.",
    status: "in_progress",
    priority: "high",
    assigneeId: "u-sara",
    projectSlug: "customer-portal-v2",
    dueLabel: "Jun 6",
    createdLabel: "May 30",
    comments: [
      {
        id: "c-202-1",
        authorId: "u-sara",
        body: "Root cause looks like a double-apply in the totals reducer. Patch incoming.",
        timeLabel: "5d ago",
      },
    ],
  },
  {
    id: "ORB-203",
    title: "CSV export times out beyond 10k rows",
    description:
      "Large workspaces hit a gateway timeout exporting analytics to CSV. Needs streaming or background job.",
    status: "todo",
    priority: "medium",
    assigneeId: "u-alex",
    projectSlug: "analytics-dashboard",
    dueLabel: "Jun 25",
    createdLabel: "Jun 2",
    comments: [
      {
        id: "c-203-1",
        authorId: "u-priya",
        body: "Customers on the Scale plan are most affected — worth prioritising.",
        timeLabel: "1d ago",
      },
    ],
  },
  {
    id: "ORB-204",
    title: "Android push notifications dropped after release",
    description:
      "Push delivery stopped on Android following the last build. Likely an FCM token refresh regression.",
    status: "todo",
    priority: "high",
    assigneeId: "u-annika",
    projectSlug: "mobile-app-launch",
    dueLabel: "May 30",
    createdLabel: "May 20",
    comments: [
      {
        id: "c-204-1",
        authorId: "u-ryan",
        body: "Confirmed missing token refresh on app upgrade. Adding a migration step.",
        timeLabel: "6d ago",
      },
    ],
  },
  {
    id: "ORB-205",
    title: "Dark mode polish for billing screens",
    description:
      "Tighten contrast and fix the invoice table borders in dark mode across the billing flow.",
    status: "in_review",
    priority: "low",
    assigneeId: "u-maria",
    projectSlug: "customer-portal-v2",
    dueLabel: "Jun 22",
    createdLabel: "Jun 1",
    comments: [
      {
        id: "c-205-1",
        authorId: "u-maria",
        body: "Ready for review — screenshots attached in Figma.",
        timeLabel: "8h ago",
      },
    ],
  },
  {
    id: "ORB-206",
    title: "Document webhooks in the API reference",
    description:
      "Add a webhooks section covering event types, signatures, retries, and a verification example.",
    status: "todo",
    priority: "medium",
    assigneeId: "u-priya",
    projectSlug: "api-documentation",
    dueLabel: "Jul 1",
    createdLabel: "Jun 5",
    comments: [
      {
        id: "c-206-1",
        authorId: "u-priya",
        body: "Outlining the event catalogue first, then the signature verification snippet.",
        timeLabel: "3d ago",
      },
    ],
  },
  {
    id: "ORB-207",
    title: "Optimise dashboard LCP",
    description:
      "Reduce Largest Contentful Paint on the dashboard shell by deferring non-critical charts and trimming bundle size.",
    status: "in_progress",
    priority: "high",
    assigneeId: "u-annika",
    projectSlug: "performance-optimization",
    dueLabel: "Jun 18",
    createdLabel: "May 25",
    comments: [
      {
        id: "c-207-1",
        authorId: "u-chris",
        body: "Code-splitting the chart library already shaved ~120ms off LCP locally.",
        timeLabel: "1d ago",
      },
    ],
  },
  {
    id: "ORB-208",
    title: "Configurable Slack routing filters",
    description:
      "Let users route notifications to channels by project and priority, with an allow/deny filter list.",
    status: "in_review",
    priority: "medium",
    assigneeId: "u-chris",
    projectSlug: "slack-integration",
    dueLabel: "Jun 24",
    createdLabel: "Jun 3",
    comments: [
      {
        id: "c-208-1",
        authorId: "u-chris",
        body: "Filter UI is done; double-checking the rate-limit handling before merge.",
        timeLabel: "12h ago",
      },
    ],
  },
  {
    id: "ORB-209",
    title: "Onboarding empty states",
    description:
      "Add friendly empty states and first-run guidance across the onboarding flow.",
    status: "completed",
    priority: "medium",
    assigneeId: "u-ryan",
    projectSlug: "customer-portal-v2",
    dueLabel: "Completed",
    createdLabel: "May 15",
    comments: [
      {
        id: "c-209-1",
        authorId: "u-ryan",
        body: "Shipped — conversion on the first-run step is already up.",
        timeLabel: "4d ago",
      },
    ],
  },
  {
    id: "ORB-210",
    title: "Audit billing role permissions",
    description:
      "Review who can view and edit billing, and tighten the role matrix for the finance scope.",
    status: "completed",
    priority: "low",
    assigneeId: "u-sara",
    projectSlug: "api-documentation",
    dueLabel: "Completed",
    createdLabel: "May 10",
    comments: [
      {
        id: "c-210-1",
        authorId: "u-sara",
        body: "Locked editing to Admins; everyone else is read-only now.",
        timeLabel: "1w ago",
      },
    ],
  },
]

/** Derived: an issue is overdue when it's not completed and past its due date. */
export function isIssueOverdue(issue: Issue, reference: Date = new Date()): boolean {
  return issue.status !== "completed" && isDueOverdue(issue.dueLabel, reference)
}

/** Next sequential id, e.g. "ORB-210" -> "ORB-211". */
export function nextIssueId(issues: Issue[]): string {
  let max = 0
  for (const issue of issues) {
    const n = parseInt(issue.id.replace(/^ORB-/, ""), 10)
    if (!Number.isNaN(n) && n > max) max = n
  }
  return `ORB-${max + 1}`
}

function tabMatches(tab: IssueTab, status: WorkItemStatus): boolean {
  if (tab === "active") return status === "in_progress" || status === "in_review"
  if (tab === "backlog") return status === "todo"
  return true
}

export type IssueFilters = {
  tab?: IssueTab
  status?: IssueStatusFilter
  priority?: IssuePriority
  assigneeId?: string
  projectSlug?: string
  search?: string
}

/** Filters issues by tab + the filter bar. Tab and status compose as AND. */
export function filterIssues(issues: Issue[], filters: IssueFilters = {}): Issue[] {
  const tab = filters.tab ?? "all"
  const query = filters.search?.trim().toLowerCase() ?? ""

  return issues.filter((issue) => {
    if (!tabMatches(tab, issue.status)) return false

    if (filters.status) {
      if (filters.status === "overdue") {
        if (!isIssueOverdue(issue)) return false
      } else if (issue.status !== filters.status) {
        return false
      }
    }

    if (filters.priority && issue.priority !== filters.priority) return false
    if (filters.assigneeId && issue.assigneeId !== filters.assigneeId) return false
    if (filters.projectSlug && issue.projectSlug !== filters.projectSlug) return false

    if (query) {
      const haystack = `${issue.id} ${issue.title} ${issue.description}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }

    return true
  })
}

const priorityRank: Record<IssuePriority, number> = { high: 0, medium: 1, low: 2 }

function dueTime(label: string): number {
  const date = parseDueLabel(label)
  return date ? date.getTime() : Number.POSITIVE_INFINITY
}

export function sortIssues(
  issues: Issue[],
  key: IssueSortKey,
  dir: SortDir
): Issue[] {
  const sign = dir === "asc" ? 1 : -1
  return [...issues].sort((a, b) => {
    let cmp = 0
    switch (key) {
      case "priority":
        cmp = priorityRank[a.priority] - priorityRank[b.priority]
        break
      case "due":
        cmp = dueTime(a.dueLabel) - dueTime(b.dueLabel)
        break
      case "created":
        cmp = dueTime(a.createdLabel) - dueTime(b.createdLabel)
        break
      case "title":
        cmp = a.title.localeCompare(b.title)
        break
    }
    return cmp * sign
  })
}

/** Groups issues into the fixed status order (empty groups included). */
export function groupIssuesByStatus(
  issues: Issue[]
): { status: WorkItemStatus; issues: Issue[] }[] {
  return ISSUE_STATUS_ORDER.map((status) => ({
    status,
    issues: issues.filter((issue) => issue.status === status),
  }))
}
