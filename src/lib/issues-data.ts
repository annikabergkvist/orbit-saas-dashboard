import type { WorkItemStatus } from "@/lib/status"
import { isDueOverdue, parseDueLabel, projectsSeed } from "@/lib/projects-data"
import { CURRENT_USER_ID, teamMembersSeed } from "@/lib/team-data"

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
  id: CURRENT_USER_ID,
  name: teamMembersSeed.find((m) => m.id === CURRENT_USER_ID)!.name,
  avatarUrl: teamMembersSeed.find((m) => m.id === CURRENT_USER_ID)!.avatarUrl,
}

/** Curated roster used for issue assignment — derived from team-data. */
export const issueAssignees: IssueAssignee[] = teamMembersSeed.map(({ id, name, avatarUrl }) => ({
  id,
  name,
  avatarUrl,
}))

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

function seedIssue(
  id: string,
  title: string,
  assigneeId: string,
  projectSlug: string,
  status: WorkItemStatus = "in_progress"
): Issue {
  return {
    id,
    title,
    description: "Tracked in the Orbit issues backlog.",
    status,
    priority: "medium",
    assigneeId,
    projectSlug,
    dueLabel: "Jun 30",
    createdLabel: "Jun 8",
    comments: [],
  }
}

/** Spread workload across the team — counts stay derived on the Team page. */
const workloadIssues: Issue[] = [
  seedIssue("ORB-211", "Auth session refresh edge cases", "u-annika", "frontend-integration"),
  seedIssue("ORB-212", "Timeline card loading skeleton", "u-annika", "frontend-integration"),
  seedIssue("ORB-213", "Invoice table empty state copy", "u-sara", "customer-portal-v2", "todo"),
  seedIssue("ORB-214", "Plan change confirmation modal", "u-sara", "customer-portal-v2"),
  seedIssue("ORB-215", "Billing error toast patterns", "u-sara", "customer-portal-v2", "in_review"),
  seedIssue("ORB-216", "Self-service nav IA tweaks", "u-sara", "customer-portal-v2", "todo"),
  seedIssue("ORB-217", "Chart tooltip focus trap", "u-alex", "analytics-dashboard"),
  seedIssue("ORB-218", "Export progress indicator", "u-alex", "analytics-dashboard", "todo"),
  seedIssue("ORB-219", "Retention cohort filter chips", "u-alex", "analytics-dashboard"),
  seedIssue("ORB-220", "Executive summary print styles", "u-alex", "analytics-dashboard", "in_review"),
  seedIssue("ORB-221", "Dashboard shell lazy routes", "u-alex", "frontend-integration"),
  seedIssue("ORB-222", "Notification popover keyboard nav", "u-alex", "frontend-integration", "todo"),
  seedIssue("ORB-223", "FCM token migration checklist", "u-jordan", "mobile-app-launch", "todo"),
  seedIssue("ORB-224", "Billing contrast audit follow-ups", "u-maria", "customer-portal-v2"),
  seedIssue("ORB-225", "Webhook signature code sample", "u-priya", "api-documentation", "todo"),
  seedIssue("ORB-226", "Rate limit error examples", "u-priya", "api-documentation"),
  seedIssue("ORB-227", "Slack install OAuth redirect", "u-chris", "slack-integration"),
  seedIssue("ORB-228", "Channel picker search debounce", "u-chris", "slack-integration", "todo"),
  seedIssue("ORB-229", "Routing filter validation rules", "u-chris", "slack-integration"),
  seedIssue("ORB-230", "Notification payload size cap", "u-chris", "slack-integration", "in_review"),
  seedIssue("ORB-231", "Regression suite for push tokens", "u-ryan", "mobile-app-launch", "todo"),
  seedIssue("ORB-232", "Image lazy-load below-fold audit", "u-lisa", "performance-optimization"),
  seedIssue("ORB-233", "Bundle split vendor chunks", "u-lisa", "performance-optimization", "todo"),
  seedIssue("ORB-234", "Query waterfall batching pass", "u-lisa", "performance-optimization"),
  seedIssue("ORB-235", "LCP hero image priority hints", "u-lisa", "performance-optimization", "in_review"),
  seedIssue("ORB-236", "Font subsetting for shell", "u-lisa", "performance-optimization", "todo"),
  seedIssue("ORB-237", "Prefetch tuning for projects route", "u-lisa", "performance-optimization"),
  seedIssue("ORB-238", "Cache header stale-while-revalidate", "u-lisa", "performance-optimization", "todo"),
  seedIssue("ORB-239", "Third-party script defer audit", "u-lisa", "performance-optimization"),
  seedIssue("ORB-240", "Critical CSS extraction spike", "u-lisa", "performance-optimization", "in_review"),
  seedIssue("ORB-241", "Performance budget CI gate", "u-lisa", "performance-optimization", "todo"),
]

const coreIssues: Issue[] = [
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
    assigneeId: "u-jordan",
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

export const issuesSeed: Issue[] = [...coreIssues, ...workloadIssues]

/** Open (non-completed) issues for an assignee — shared by Team and dashboard KPIs. */
export function countOpenIssuesForAssignee(
  assigneeId: string,
  issues: Issue[] = issuesSeed
): number {
  return issues.filter(
    (issue) => issue.assigneeId === assigneeId && issue.status !== "completed"
  ).length
}

/** All issues assigned to a team member — dashboard My Tasks, filters, etc. */
export function getIssuesForAssignee(
  assigneeId: string,
  issues: Issue[] = issuesSeed
): Issue[] {
  return issues.filter((issue) => issue.assigneeId === assigneeId)
}

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
