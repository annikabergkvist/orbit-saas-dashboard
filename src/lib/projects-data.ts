import type { BoardColumnId, MyTaskStatus, ProjectLifecycle } from "@/lib/status"

export type { BoardColumnId, ProjectLifecycle } from "@/lib/status"

export type ProjectType = "development" | "design" | "documentation"

export type ProjectPriority = "high" | "medium" | "low"

export type ProjectMember = {
  id: string
  name: string
  avatarUrl: string
}

export type ProjectSummary = {
  id: string
  slug: string
  title: string
  description: string
  type: ProjectType
  priority: ProjectPriority
  lifecycle: ProjectLifecycle
  progress: number
  comments: number
  attachments: number
  /** Shown next to the calendar icon (e.g. "Tomorrow", "May 15", "Completed"). */
  dueLabel: string
  /** Days active — shown on the dashboard projects overview card. */
  activeDays?: number
  /** Gantt placement for the dashboard timeline card (active projects). */
  timeline?: {
    startLabel: string
    endLabel: string
    startDay: number
    endDay: number
    lane: number
  }
  team: ProjectMember[]
}

export type ProjectSort =
  | "name-asc"
  | "name-desc"
  | "progress-desc"
  | "progress-asc"
  | "priority-desc"

/** Dashboard-only sort modes — scoped to active work, not the full `/projects` list. */
export type DashboardProjectSort = "priority" | "at-risk" | "progress"

export const DASHBOARD_PROJECTS_VISIBLE = 4
export const DASHBOARD_TIMELINE_VISIBLE = 4

/** Four active projects on the dashboard timeline (matches reference layout). */
export const dashboardTimelineProjectSlugs = [
  "performance-optimization",
  "customer-portal-v2",
  "frontend-integration",
  "mobile-app-launch",
] as const

export const projectSortOptions: { value: ProjectSort; label: string }[] = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "progress-desc", label: "Progress (high to low)" },
  { value: "progress-asc", label: "Progress (low to high)" },
  { value: "priority-desc", label: "Priority (high first)" },
]

export const dashboardProjectSortOptions: {
  value: DashboardProjectSort
  label: string
}[] = [
  { value: "priority", label: "Priority" },
  { value: "at-risk", label: "Needs attention" },
  { value: "progress", label: "Progress" },
]

/** Timeline bar accent — encodes project category (matches `/projects` type badges). */
export const projectTypeAccentColors: Record<ProjectType, string> = {
  development: "var(--primary)",
  design: "var(--activity-completed)",
  documentation: "var(--status-chart-completed)",
}

/** Distinct chart accents for dashboard rings — stable per project, not by priority. */
const dashboardProjectAccentPalette = [
  "var(--primary)",
  "var(--activity-created)",
  "var(--activity-completed)",
  "var(--status-chart-completed)",
  "var(--status-chart-in-review)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

export function getProjectTypeAccentColor(type: ProjectType): string {
  return projectTypeAccentColors[type]
}

export function getProjectAccentColor(project: ProjectSummary): string {
  const index = projectsSeed.findIndex((entry) => entry.slug === project.slug)
  const paletteIndex = index >= 0 ? index : 0
  return dashboardProjectAccentPalette[
    paletteIndex % dashboardProjectAccentPalette.length
  ]
}

const priorityOrder = { high: 0, medium: 1, low: 2 } as const

export function sortProjects(
  projects: ProjectSummary[],
  sort: ProjectSort
): ProjectSummary[] {
  const list = [...projects]
  switch (sort) {
    case "name-asc":
      return list.sort((a, b) => a.title.localeCompare(b.title))
    case "name-desc":
      return list.sort((a, b) => b.title.localeCompare(a.title))
    case "progress-desc":
      return list.sort((a, b) => b.progress - a.progress)
    case "progress-asc":
      return list.sort((a, b) => a.progress - b.progress)
    case "priority-desc":
      return list.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      )
  }
}

function sortDashboardProjects(
  projects: ProjectSummary[],
  sort: DashboardProjectSort
): ProjectSummary[] {
  const list = [...projects]
  switch (sort) {
    case "priority":
      return list.sort((a, b) => {
        const byPriority = priorityOrder[a.priority] - priorityOrder[b.priority]
        if (byPriority !== 0) return byPriority
        return a.progress - b.progress
      })
    case "at-risk":
      return list.sort((a, b) => {
        const score = (project: ProjectSummary) =>
          priorityOrder[project.priority] * 100 + (100 - project.progress)
        return score(a) - score(b)
      })
    case "progress":
      return list.sort((a, b) => b.progress - a.progress)
  }
}

/**
 * A project "needs attention" when it is still in flight (not completed or
 * launched) and is either past its due date or a high-priority project that is
 * not yet near the finish line. Heuristic placeholder until real risk signals
 * exist; mirrors the dashboard "Needs Attention" KPI.
 */
export function projectNeedsAttention(project: ProjectSummary): boolean {
  if (project.lifecycle === "completed" || project.lifecycle === "launched") {
    return false
  }
  return (
    isDueOverdue(project.dueLabel) ||
    (project.priority === "high" && project.progress < 80)
  )
}

export function countActiveProjects(): number {
  return projectsSeed.filter((p) => p.lifecycle === "active").length
}

export function countProjectsNeedingAttention(): number {
  return projectsSeed.filter(projectNeedsAttention).length
}

/** Same filtering/sorting as `/projects` — single source of truth for project lists. */
export function listProjects(options?: {
  lifecycle?: ProjectLifecycle | "all"
  sort?: ProjectSort
  search?: string
  needsAttention?: boolean
}): ProjectSummary[] {
  const lifecycle = options?.lifecycle ?? "all"
  const sort = options?.sort ?? "name-asc"
  const query = options?.search?.trim().toLowerCase() ?? ""

  let list =
    lifecycle === "all"
      ? [...projectsSeed]
      : projectsSeed.filter((p) => p.lifecycle === lifecycle)

  if (options?.needsAttention) {
    list = list.filter(projectNeedsAttention)
  }

  if (query) {
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    )
  }

  return sortProjects(list, sort)
}

/** Dashboard projects card — active work only, sorted for at-a-glance decisions. */
export function getDashboardProjects(
  sort: DashboardProjectSort = "priority"
): ProjectSummary[] {
  const active = listProjects({ lifecycle: "active", sort: "name-asc" })
  return sortDashboardProjects(active, sort)
}

/** Active projects for the dashboard Gantt card (fixed set of four). */
export function getDashboardTimelineProjects(): ProjectSummary[] {
  return dashboardTimelineProjectSlugs
    .map((slug) => projectsSeed.find((p) => p.slug === slug))
    .filter(
      (project): project is ProjectSummary =>
        project != null && project.timeline != null
    )
}

export const projectsSeed: ProjectSummary[] = [
  {
    id: "p-1",
    slug: "slack-integration",
    title: "Slack Integration",
    description:
      "Connect workspace notifications to Slack channels with configurable routing and filters.",
    type: "development",
    priority: "high",
    lifecycle: "active",
    progress: 60,
    comments: 12,
    attachments: 4,
    dueLabel: "Tomorrow",
    activeDays: 18,
    timeline: {
      startLabel: "12 Oct",
      endLabel: "22 Oct",
      startDay: 0,
      endDay: 10,
      lane: 2,
    },
    team: [
      {
        id: "m-1",
        name: "Sara Chen",
        avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
      },
      {
        id: "m-2",
        name: "Alex Johnson",
        avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
      },
      {
        id: "m-3",
        name: "Maria Lopez",
        avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg",
      },
    ],
  },
  {
    id: "p-2",
    slug: "customer-portal-v2",
    title: "Customer Portal v2",
    description:
      "Redesign self-service billing, invoices, and plan changes with clearer empty states.",
    type: "design",
    priority: "medium",
    lifecycle: "active",
    progress: 45,
    comments: 8,
    attachments: 2,
    dueLabel: "Jun 8",
    activeDays: 12,
    timeline: {
      startLabel: "11 Oct",
      endLabel: "19 Oct",
      startDay: 0,
      endDay: 7,
      lane: 3,
    },
    team: [
      {
        id: "m-4",
        name: "Jordan Lee",
        avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      },
      {
        id: "m-5",
        name: "Priya Singh",
        avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg",
      },
      {
        id: "m-16",
        name: "Sara Chen",
        avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
      },
      {
        id: "m-17",
        name: "Alex Johnson",
        avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
      },
    ],
  },
  {
    id: "p-3",
    slug: "analytics-dashboard",
    title: "Analytics Dashboard",
    description:
      "Executive-friendly charts for activation, retention, and revenue with exportable reports.",
    type: "development",
    priority: "low",
    lifecycle: "planning",
    progress: 20,
    comments: 5,
    attachments: 1,
    dueLabel: "Jun 2",
    team: [
      {
        id: "m-6",
        name: "Chris Morgan",
        avatarUrl: "https://randomuser.me/api/portraits/men/52.jpg",
      },
      {
        id: "m-7",
        name: "Emma Wilson",
        avatarUrl: "https://randomuser.me/api/portraits/women/17.jpg",
      },
      {
        id: "m-8",
        name: "David Park",
        avatarUrl: "https://randomuser.me/api/portraits/men/36.jpg",
      },
    ],
  },
  {
    id: "p-4",
    slug: "api-documentation",
    title: "API Documentation",
    description:
      "Public reference for REST endpoints, auth flows, webhooks, and SDK examples across languages.",
    type: "documentation",
    priority: "high",
    lifecycle: "completed",
    progress: 100,
    comments: 24,
    attachments: 9,
    dueLabel: "Completed",
    team: [
      {
        id: "m-9",
        name: "Nina Brooks",
        avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        id: "m-10",
        name: "Tom Rivera",
        avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
      },
    ],
  },
  {
    id: "p-5",
    slug: "performance-optimization",
    title: "Performance Optimization",
    description:
      "Reduce bundle size, improve LCP on the dashboard shell, and tune data-fetch waterfalls.",
    type: "development",
    priority: "high",
    lifecycle: "active",
    progress: 78,
    comments: 15,
    attachments: 3,
    dueLabel: "Jun 14",
    activeDays: 16,
    timeline: {
      startLabel: "12 Oct",
      endLabel: "28 Oct",
      startDay: 0,
      endDay: 16,
      lane: 1,
    },
    team: [
      {
        id: "m-11",
        name: "Lisa Zhang",
        avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      {
        id: "m-12",
        name: "James O'Neil",
        avatarUrl: "https://randomuser.me/api/portraits/men/11.jpg",
      },
      {
        id: "m-13",
        name: "Olivia Hart",
        avatarUrl: "https://randomuser.me/api/portraits/women/21.jpg",
      },
    ],
  },
  {
    id: "p-7",
    slug: "frontend-integration",
    title: "Frontend Integration",
    description:
      "Wire the Orbit dashboard shell to live APIs, shared design tokens, and auth — including timeline, projects, and notifications surfaces.",
    type: "development",
    priority: "high",
    lifecycle: "in_review",
    progress: 98,
    comments: 19,
    attachments: 5,
    dueLabel: "Oct 25",
    activeDays: 23,
    timeline: {
      startLabel: "15 Oct",
      endLabel: "25 Oct",
      startDay: 3,
      endDay: 13,
      lane: 5,
    },
    team: [
      {
        id: "m-3",
        name: "Maria Lopez",
        avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg",
      },
      {
        id: "m-5",
        name: "Priya Singh",
        avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg",
      },
      {
        id: "m-2",
        name: "Alex Johnson",
        avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
      },
    ],
  },
  {
    id: "p-6",
    slug: "mobile-app-launch",
    title: "Mobile App Launch",
    description:
      "App store assets, rollout checklist, and phased release for iOS and Android builds.",
    type: "design",
    priority: "high",
    lifecycle: "launched",
    progress: 92,
    comments: 31,
    attachments: 7,
    dueLabel: "Launched",
    activeDays: 21,
    timeline: {
      startLabel: "17 Oct",
      endLabel: "2 Nov",
      startDay: 5,
      endDay: 21,
      lane: 8,
    },
    team: [
      {
        id: "m-14",
        name: "Ryan Cooper",
        avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        id: "m-15",
        name: "Annika Bergkvist",
        avatarUrl: "/avatars/annika.png?v=2",
      },
    ],
  },
]

export type TaskTag = "research" | "development" | "ux-writing" | "design" | "documentation"

export type BoardTask = {
  id: string
  title: string
  description?: string
  column: BoardColumnId
  tags?: TaskTag[]
  priority?: ProjectPriority
  progress?: number
  comments: number
  attachments: number
  dueLabel: string
  assignees: ProjectMember[]
  images?: string[]
  /** Launched cards: shown with calendar icon in footer, e.g. "May 15 - 09:00AM" */
  launchDateTime?: string
}

export type ProjectBoard = {
  boardTitle: string
  extraTeamCount: number
  tasks: BoardTask[]
}

export const boardColumns: {
  id: BoardColumnId
  label: string
  headerClass: string
  dotClass: string
}[] = [
  {
    id: "todo",
    label: "To Do",
    headerClass:
      "bg-[var(--status-todo)] text-[var(--status-todo-foreground)]",
    dotClass: "bg-[var(--status-todo-foreground)]/50",
  },
  {
    id: "in_progress",
    label: "In Progress",
    headerClass:
      "bg-[var(--status-in-progress)] text-[var(--status-in-progress-foreground)]",
    dotClass: "bg-[var(--status-in-progress-foreground)]",
  },
  {
    id: "in_review",
    label: "In Review",
    headerClass:
      "bg-[var(--status-in-review)] text-[var(--status-in-review-foreground)]",
    dotClass: "bg-[var(--status-in-review-foreground)]",
  },
  {
    id: "completed",
    label: "Completed",
    headerClass:
      "bg-[var(--status-completed)] text-[var(--status-completed-foreground)]",
    dotClass: "bg-[var(--status-completed-foreground)]",
  },
]

const designTeamBoardTasks: BoardTask[] = [
  {
    id: "cp-p1",
    title: "Billing empty states",
    description:
      "Map every billing error and zero-data scenario for invoices, payments, and plan changes.",
    column: "todo",
    tags: ["research"],
    comments: 2,
    attachments: 1,
    dueLabel: "Jun 6",
    assignees: [
      {
        id: "m-5",
        name: "Priya Singh",
        avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg",
      },
    ],
  },
  {
    id: "cp-p2",
    title: "Plan change flow wireframes",
    description:
      "Low-fi flows for upgrade, downgrade, and cancellation with clearer confirmation steps.",
    column: "todo",
    tags: ["design"],
    priority: "medium",
    comments: 0,
    attachments: 3,
    dueLabel: "Jun 14",
    assignees: [
      {
        id: "m-4",
        name: "Jordan Lee",
        avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      },
    ],
  },
  {
    id: "cp-ip1",
    title: "Self-service dashboard UI",
    description:
      "High-fidelity layouts for the home dashboard, usage summary, and quick actions.",
    column: "in_progress",
    tags: ["design"],
    priority: "high",
    progress: 55,
    comments: 9,
    attachments: 6,
    dueLabel: "May 18",
    assignees: [
      {
        id: "m-4",
        name: "Jordan Lee",
        avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      },
    ],
  },
  {
    id: "cp-ip2",
    title: "Moodboards",
    description:
      "Visual direction for billing screens, cards, and typography across light mode.",
    column: "in_review",
    tags: ["ux-writing"],
    progress: 72,
    comments: 4,
    attachments: 5,
    dueLabel: "Jun 4",
    assignees: [
      {
        id: "m-5",
        name: "Priya Singh",
        avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=120&fit=crop",
      "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=200&h=120&fit=crop",
    ],
  },
  {
    id: "cp-ip3",
    title: "Invoice table component",
    description:
      "Responsive specs and states for sortable invoice history with export and filters.",
    column: "in_progress",
    tags: ["development"],
    priority: "high",
    progress: 38,
    comments: 14,
    attachments: 2,
    dueLabel: "Tomorrow",
    assignees: [
      {
        id: "m-17",
        name: "Alex Johnson",
        avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
      },
    ],
  },
  {
    id: "cp-c1",
    title: "Navigation & IA sign-off",
    description:
      "Final information architecture for v2 approved with product and engineering.",
    column: "completed",
    tags: ["research"],
    comments: 6,
    attachments: 0,
    dueLabel: "Jun 9",
    assignees: [
      {
        id: "m-16",
        name: "Sara Chen",
        avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
      },
    ],
  },
  {
    id: "cp-c2",
    title: "Form accessibility audit",
    description:
      "WCAG pass on payment and profile forms with fixes logged for the dev handoff.",
    column: "completed",
    tags: ["development"],
    comments: 11,
    attachments: 4,
    dueLabel: "Jun 9",
    assignees: [
      {
        id: "m-17",
        name: "Alex Johnson",
        avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
      },
    ],
  },
  {
    id: "cp-l1",
    title: "Beta waitlist landing page",
    description:
      "Shipped pre-launch page with signup, FAQ, and brand assets tied to the portal refresh.",
    column: "completed",
    tags: ["design"],
    comments: 7,
    attachments: 3,
    dueLabel: "Apr 28",
    launchDateTime: "May 15 - 09:00AM",
    assignees: [
      {
        id: "m-4",
        name: "Jordan Lee",
        avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      },
    ],
  },
]

const boardsBySlug: Record<string, ProjectBoard> = {
  "customer-portal-v2": {
    boardTitle: "Design Team Board",
    extraTeamCount: 6,
    tasks: designTeamBoardTasks,
  },
  "slack-integration": {
    boardTitle: "Slack Integration Board",
    extraTeamCount: 2,
    tasks: [
      {
        id: "si-p1",
        title: "Channel routing rules",
        description: "Define how alerts map to public vs private channels per workspace.",
        column: "todo",
        tags: ["development"],
        priority: "high",
        comments: 5,
        attachments: 2,
        dueLabel: "Jun 15",
        assignees: [
          {
            id: "m-1",
            name: "Sara Chen",
            avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
          },
        ],
      },
      {
        id: "si-p2",
        title: "OAuth scope review",
        description: "Confirm minimal Slack scopes for install and reconnect flows.",
        column: "todo",
        tags: ["research"],
        comments: 1,
        attachments: 0,
        dueLabel: "Jun 16",
        assignees: [],
      },
      {
        id: "si-ip1",
        title: "Slack message templates",
        description: "Draft notification payloads for mentions, deploys, and billing events.",
        column: "in_progress",
        tags: ["ux-writing"],
        priority: "high",
        progress: 60,
        comments: 12,
        attachments: 8,
        dueLabel: "Tomorrow",
        assignees: [
          {
            id: "m-2",
            name: "Alex Johnson",
            avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
          },
        ],
      },
      {
        id: "si-ip2",
        title: "Webhook retry logic",
        description: "Queue failed deliveries with backoff and dead-letter reporting.",
        column: "in_progress",
        tags: ["development"],
        progress: 45,
        comments: 8,
        attachments: 3,
        dueLabel: "Jun 6",
        assignees: [
          {
            id: "m-1",
            name: "Sara Chen",
            avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
          },
        ],
      },
      {
        id: "si-ip3",
        title: "Install flow QA",
        description: "Test workspace connect in staging across Enterprise Grid and single teams.",
        column: "in_progress",
        tags: ["research"],
        progress: 28,
        comments: 4,
        attachments: 1,
        dueLabel: "May 19",
        assignees: [
          {
            id: "m-3",
            name: "Maria Lopez",
            avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg",
          },
        ],
      },
      {
        id: "si-ir1",
        title: "Notification payload review",
        description:
          "Legal and support review of alert copy before production rollout.",
        column: "in_review",
        tags: ["ux-writing"],
        priority: "medium",
        progress: 82,
        comments: 7,
        attachments: 2,
        dueLabel: "Jun 5",
        assignees: [
          {
            id: "m-2",
            name: "Alex Johnson",
            avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
          },
        ],
      },
      {
        id: "si-c1",
        title: "Staging smoke tests",
        description: "End-to-end checks for connect, disconnect, and sample alert delivery.",
        column: "completed",
        tags: ["development"],
        comments: 6,
        attachments: 2,
        dueLabel: "Jun 2",
        assignees: [],
      },
      {
        id: "si-c2",
        title: "Security review",
        description: "Completed threat model and token storage review with infra.",
        column: "completed",
        tags: ["research"],
        comments: 3,
        attachments: 5,
        dueLabel: "Jun 1",
        assignees: [],
      },
      {
        id: "si-l1",
        title: "Internal dogfood rollout",
        description: "Live for Orbit staff workspaces with feedback channel in #product-alerts.",
        column: "completed",
        tags: ["development"],
        comments: 18,
        attachments: 4,
        dueLabel: "Jun 10",
        launchDateTime: "May 8 - 02:30PM",
        assignees: [
          {
            id: "m-2",
            name: "Alex Johnson",
            avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
          },
        ],
      },
    ],
  },
  "analytics-dashboard": {
    boardTitle: "Analytics Dashboard Board",
    extraTeamCount: 1,
    tasks: [
      {
        id: "ad-p1",
        title: "Metric definitions workshop",
        description:
          "Align with product on activation, retention, and revenue formulas before building charts.",
        column: "todo",
        tags: ["research"],
        priority: "medium",
        comments: 3,
        attachments: 2,
        dueLabel: "Jun 5",
        assignees: [
          {
            id: "m-6",
            name: "Chris Morgan",
            avatarUrl: "https://randomuser.me/api/portraits/men/52.jpg",
          },
        ],
      },
      {
        id: "ad-ip1",
        title: "Executive summary layout",
        description:
          "Wireframes for the top-level KPI row and drill-down entry points on the dashboard home.",
        column: "in_progress",
        tags: ["design"],
        priority: "low",
        progress: 22,
        comments: 5,
        attachments: 4,
        dueLabel: "Jun 2",
        assignees: [
          {
            id: "m-7",
            name: "Emma Wilson",
            avatarUrl: "https://randomuser.me/api/portraits/women/17.jpg",
          },
        ],
      },
      {
        id: "ad-ip2",
        title: "Retention cohort charts",
        description:
          "Prototype weekly cohort views with filters for plan tier and signup source.",
        column: "in_review",
        tags: ["development"],
        progress: 68,
        comments: 6,
        attachments: 2,
        dueLabel: "Jun 4",
        assignees: [
          {
            id: "m-8",
            name: "David Park",
            avatarUrl: "https://randomuser.me/api/portraits/men/36.jpg",
          },
        ],
      },
      {
        id: "ad-ir1",
        title: "Executive summary copy review",
        description:
          "Product marketing sign-off on KPI labels, tooltips, and empty-state messaging.",
        column: "in_review",
        tags: ["ux-writing"],
        priority: "medium",
        progress: 90,
        comments: 4,
        attachments: 0,
        dueLabel: "Jun 3",
        assignees: [
          {
            id: "m-7",
            name: "Emma Wilson",
            avatarUrl: "https://randomuser.me/api/portraits/women/17.jpg",
          },
        ],
      },
      {
        id: "ad-c1",
        title: "Data source inventory",
        description:
          "Catalogued warehouse tables and event streams needed for v1 reporting scopes.",
        column: "completed",
        tags: ["research"],
        comments: 8,
        attachments: 6,
        dueLabel: "Jun 18",
        assignees: [
          {
            id: "m-8",
            name: "David Park",
            avatarUrl: "https://randomuser.me/api/portraits/men/36.jpg",
          },
        ],
      },
      {
        id: "ad-l1",
        title: "Internal metrics preview",
        description:
          "Read-only dashboard shipped to leadership for feedback before GA rollout.",
        column: "completed",
        tags: ["development"],
        comments: 12,
        attachments: 1,
        dueLabel: "Jun 6",
        launchDateTime: "May 20 - 10:00AM",
        assignees: [
          {
            id: "m-6",
            name: "Chris Morgan",
            avatarUrl: "https://randomuser.me/api/portraits/men/52.jpg",
          },
        ],
      },
    ],
  },
  "api-documentation": {
    boardTitle: "API Documentation Board",
    extraTeamCount: 0,
    tasks: [
      {
        id: "doc-p1",
        title: "Webhook event catalog",
        description:
          "Document payload shapes and retry semantics for billing and workspace events.",
        column: "todo",
        tags: ["documentation"],
        priority: "medium",
        comments: 2,
        attachments: 0,
        dueLabel: "Jun 8",
        assignees: [
          {
            id: "m-10",
            name: "Tom Rivera",
            avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
          },
        ],
      },
      {
        id: "doc-p2",
        title: "Rate limit reference",
        description:
          "Draft per-endpoint limits, burst rules, and 429 response examples for public API consumers.",
        column: "todo",
        tags: ["research"],
        comments: 0,
        attachments: 1,
        dueLabel: "Jun 10",
        assignees: [],
      },
      {
        id: "doc-ip1",
        title: "SDK quickstart guides",
        description:
          "Node and Python examples for auth, pagination, and error handling with copy-paste snippets.",
        column: "in_progress",
        tags: ["development"],
        priority: "high",
        progress: 85,
        comments: 14,
        attachments: 9,
        dueLabel: "Jun 19",
        assignees: [
          {
            id: "m-9",
            name: "Nina Brooks",
            avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
          },
        ],
      },
      {
        id: "doc-ip2",
        title: "GraphQL schema section",
        description:
          "Add queries and mutations for workspace settings with inline deprecation notes.",
        column: "in_progress",
        tags: ["documentation"],
        priority: "medium",
        progress: 40,
        comments: 6,
        attachments: 3,
        dueLabel: "Jun 1",
        assignees: [
          {
            id: "m-10",
            name: "Tom Rivera",
            avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
          },
        ],
      },
      {
        id: "doc-ir1",
        title: "SDK quickstart peer review",
        description:
          "Engineering review of Node and Python samples before publishing to the docs site.",
        column: "in_review",
        tags: ["documentation"],
        priority: "high",
        progress: 92,
        comments: 5,
        attachments: 4,
        dueLabel: "Jun 7",
        assignees: [
          {
            id: "m-9",
            name: "Nina Brooks",
            avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
          },
        ],
      },
      {
        id: "doc-c1",
        title: "REST reference v2",
        description:
          "Published endpoint reference with auth flows, rate limits, and changelog cross-links.",
        column: "completed",
        tags: ["documentation"],
        comments: 24,
        attachments: 12,
        dueLabel: "Jun 8",
        assignees: [
          {
            id: "m-9",
            name: "Nina Brooks",
            avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
          },
        ],
      },
      {
        id: "doc-c2",
        title: "Changelog archive",
        description:
          "Migrated two years of API release notes into searchable, version-tagged pages.",
        column: "completed",
        tags: ["ux-writing"],
        comments: 9,
        attachments: 2,
        dueLabel: "Jun 6",
        assignees: [
          {
            id: "m-10",
            name: "Tom Rivera",
            avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
          },
        ],
      },
      {
        id: "doc-l1",
        title: "Public docs site",
        description:
          "Live developer portal with search, versioning, and feedback widget on every page.",
        column: "completed",
        tags: ["documentation"],
        comments: 31,
        attachments: 5,
        dueLabel: "Jun 10",
        launchDateTime: "May 1 - 08:00AM",
        assignees: [
          {
            id: "m-10",
            name: "Tom Rivera",
            avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
          },
        ],
      },
    ],
  },
  "performance-optimization": {
    boardTitle: "Performance Board",
    extraTeamCount: 0,
    tasks: [
      {
        id: "perf-p1",
        title: "Image lazy-load audit",
        description:
          "List above-the-fold assets and defer non-critical images on dashboard routes.",
        column: "todo",
        tags: ["development"],
        priority: "medium",
        comments: 4,
        attachments: 1,
        dueLabel: "Jun 17",
        assignees: [
          {
            id: "m-13",
            name: "Olivia Hart",
            avatarUrl: "https://randomuser.me/api/portraits/women/21.jpg",
          },
        ],
      },
      {
        id: "perf-p2",
        title: "Cache header review",
        description:
          "Audit CDN and browser cache policies for static assets and API edge responses.",
        column: "todo",
        tags: ["research"],
        comments: 1,
        attachments: 0,
        dueLabel: "Jun 18",
        assignees: [],
      },
      {
        id: "perf-ip1",
        title: "Bundle split for shell",
        description:
          "Code-split sidebar and chart vendors to shrink the initial dashboard payload.",
        column: "in_progress",
        tags: ["development"],
        priority: "high",
        progress: 78,
        comments: 15,
        attachments: 3,
        dueLabel: "Jun 14",
        assignees: [
          {
            id: "m-11",
            name: "Lisa Zhang",
            avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
          },
        ],
      },
      {
        id: "perf-ip2",
        title: "Query waterfall fixes",
        description:
          "Parallelize dashboard data fetches and remove duplicate session lookups on load.",
        column: "in_progress",
        tags: ["development"],
        progress: 52,
        comments: 10,
        attachments: 2,
        dueLabel: "Jun 15",
        assignees: [
          {
            id: "m-12",
            name: "James O'Neil",
            avatarUrl: "https://randomuser.me/api/portraits/men/11.jpg",
          },
        ],
      },
      {
        id: "perf-ir1",
        title: "Bundle split PR review",
        description:
          "Performance team sign-off on chunk boundaries and lazy-load boundaries for the shell.",
        column: "in_review",
        tags: ["development"],
        priority: "high",
        progress: 88,
        comments: 6,
        attachments: 1,
        dueLabel: "Jun 12",
        assignees: [
          {
            id: "m-11",
            name: "Lisa Zhang",
            avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
          },
        ],
      },
      {
        id: "perf-c1",
        title: "LCP baseline report",
        description:
          "Captured lab and field metrics for home and projects views before optimizations.",
        column: "completed",
        tags: ["research"],
        comments: 7,
        attachments: 4,
        dueLabel: "Jun 5",
        assignees: [
          {
            id: "m-12",
            name: "James O'Neil",
            avatarUrl: "https://randomuser.me/api/portraits/men/11.jpg",
          },
        ],
      },
      {
        id: "perf-c2",
        title: "Font subsetting",
        description:
          "Reduced DM Sans payload with unicode-range splits for Latin-only dashboard routes.",
        column: "completed",
        tags: ["design"],
        comments: 4,
        attachments: 1,
        dueLabel: "Jun 3",
        assignees: [
          {
            id: "m-13",
            name: "Olivia Hart",
            avatarUrl: "https://randomuser.me/api/portraits/women/21.jpg",
          },
        ],
      },
      {
        id: "perf-l1",
        title: "Prefetch tuning rollout",
        description:
          "Shipped smarter route prefetching for top nav links in production workspaces.",
        column: "completed",
        tags: ["development"],
        comments: 9,
        attachments: 2,
        dueLabel: "Jun 9",
        launchDateTime: "May 10 - 03:15PM",
        assignees: [
          {
            id: "m-11",
            name: "Lisa Zhang",
            avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
          },
        ],
      },
    ],
  },
  "mobile-app-launch": {
    boardTitle: "Mobile Launch Board",
    extraTeamCount: 0,
    tasks: [
      {
        id: "mob-p1",
        title: "App Store screenshot set",
        description:
          "Finalize six frames per platform highlighting inbox, tasks, and offline mode.",
        column: "todo",
        tags: ["design"],
        priority: "high",
        comments: 6,
        attachments: 8,
        dueLabel: "Jun 6",
        assignees: [
          {
            id: "m-14",
            name: "Ryan Cooper",
            avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
          },
        ],
      },
      {
        id: "mob-p2",
        title: "Play Store feature graphic",
        description:
          "Hero banner and short promo video storyboard for the Android listing refresh.",
        column: "todo",
        tags: ["design"],
        priority: "medium",
        comments: 3,
        attachments: 4,
        dueLabel: "Jun 13",
        assignees: [
          {
            id: "m-15",
            name: "Annika Bergkvist",
            avatarUrl: "/avatars/annika.png?v=2",
          },
        ],
      },
      {
        id: "mob-ip1",
        title: "Phased rollout checklist",
        description:
          "Percent-based release plan with crash guardrails and rollback triggers for iOS and Android.",
        column: "in_progress",
        tags: ["research"],
        priority: "high",
        progress: 92,
        comments: 18,
        attachments: 5,
        dueLabel: "Jun 14",
        assignees: [
          {
            id: "m-15",
            name: "Annika Bergkvist",
            avatarUrl: "/avatars/annika.png?v=2",
          },
        ],
      },
      {
        id: "mob-ip2",
        title: "Push notification copy",
        description:
          "In-app and OS notification strings for mentions, assignments, and digest summaries.",
        column: "in_progress",
        tags: ["ux-writing"],
        progress: 65,
        comments: 7,
        attachments: 2,
        dueLabel: "Jun 4",
        assignees: [
          {
            id: "m-14",
            name: "Ryan Cooper",
            avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
          },
        ],
      },
      {
        id: "mob-ip3",
        title: "Crash-free sessions gate",
        description:
          "Monitor Firebase stability metrics before widening the staged rollout percentage.",
        column: "in_progress",
        tags: ["development"],
        progress: 88,
        comments: 11,
        attachments: 1,
        dueLabel: "Jun 7",
        assignees: [
          {
            id: "m-15",
            name: "Annika Bergkvist",
            avatarUrl: "/avatars/annika.png?v=2",
          },
        ],
      },
      {
        id: "mob-ir1",
        title: "App Store listing review",
        description:
          "Marketing and legal review of screenshots, description, and privacy labels.",
        column: "in_review",
        tags: ["design"],
        priority: "high",
        progress: 95,
        comments: 9,
        attachments: 6,
        dueLabel: "Jun 5",
        assignees: [
          {
            id: "m-14",
            name: "Ryan Cooper",
            avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
          },
        ],
      },
      {
        id: "mob-c1",
        title: "Beta build sign-off",
        description:
          "QA passed on TestFlight and Play internal tracks with no P0 blockers logged.",
        column: "completed",
        tags: ["development"],
        comments: 22,
        attachments: 3,
        dueLabel: "Jun 2",
        assignees: [
          {
            id: "m-14",
            name: "Ryan Cooper",
            avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
          },
        ],
      },
      {
        id: "mob-c2",
        title: "TestFlight feedback triage",
        description:
          "Sorted 140 beta notes into fix-now vs post-launch buckets for the release train.",
        column: "completed",
        tags: ["research"],
        comments: 16,
        attachments: 0,
        dueLabel: "Jun 9",
        assignees: [],
      },
      {
        id: "mob-l1",
        title: "iOS 1.0 store listing",
        description:
          "Live on the App Store with localized description and support links to help center.",
        column: "completed",
        tags: ["design"],
        comments: 31,
        attachments: 7,
        dueLabel: "Jun 11",
        launchDateTime: "May 5 - 06:00AM",
        assignees: [
          {
            id: "m-15",
            name: "Annika Bergkvist",
            avatarUrl: "/avatars/annika.png?v=2",
          },
        ],
      },
      {
        id: "mob-l2",
        title: "Android open beta",
        description:
          "Public beta track live with in-app upgrade prompt for legacy APK installs.",
        column: "completed",
        tags: ["development"],
        comments: 24,
        attachments: 6,
        dueLabel: "Jun 12",
        launchDateTime: "May 3 - 11:30AM",
        assignees: [
          {
            id: "m-14",
            name: "Ryan Cooper",
            avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
          },
        ],
      },
    ],
  },
  "frontend-integration": {
    boardTitle: "Frontend Integration Board",
    extraTeamCount: 1,
    tasks: [
      {
        id: "fe-p1",
        title: "Auth session provider",
        description: "Connect login state to the app shell, sidebar, and protected routes.",
        column: "completed",
        tags: ["development"],
        priority: "high",
        progress: 100,
        comments: 6,
        attachments: 2,
        dueLabel: "Oct 18",
        assignees: [
          {
            id: "m-2",
            name: "Alex Johnson",
            avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
          },
        ],
      },
      {
        id: "fe-ip1",
        title: "Dashboard API hooks",
        description: "Replace chart and KPI placeholders with typed fetch hooks and loading states.",
        column: "in_progress",
        tags: ["development"],
        priority: "high",
        progress: 92,
        comments: 8,
        attachments: 3,
        dueLabel: "Oct 22",
        assignees: [
          {
            id: "m-3",
            name: "Maria Lopez",
            avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg",
          },
          {
            id: "m-5",
            name: "Priya Singh",
            avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg",
          },
        ],
      },
      {
        id: "fe-ip2",
        title: "Projects timeline surface",
        description: "Ship the Project Overview timeline card and wire bars to project seed data.",
        column: "in_progress",
        tags: ["design", "development"],
        priority: "high",
        progress: 85,
        comments: 4,
        attachments: 1,
        dueLabel: "Oct 25",
        assignees: [
          {
            id: "m-5",
            name: "Priya Singh",
            avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg",
          },
        ],
      },
      {
        id: "fe-ir1",
        title: "Timeline card design review",
        description:
          "Design QA on Gantt spacing, bar colors, and responsive behavior before API wiring.",
        column: "in_review",
        tags: ["design"],
        priority: "high",
        progress: 94,
        comments: 3,
        attachments: 2,
        dueLabel: "Oct 24",
        assignees: [
          {
            id: "m-5",
            name: "Priya Singh",
            avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg",
          },
        ],
      },
      {
        id: "fe-p2",
        title: "Notification popover QA",
        description: "Cross-browser pass on glass menus, unread counts, and mark-all-read flows.",
        column: "todo",
        tags: ["development"],
        priority: "medium",
        comments: 1,
        attachments: 0,
        dueLabel: "Oct 28",
        assignees: [
          {
            id: "m-3",
            name: "Maria Lopez",
            avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg",
          },
        ],
      },
    ],
  },
}

export function getProjectBySlug(slug: string): ProjectSummary | undefined {
  return projectsSeed.find((p) => p.slug === slug)
}

export function getBoardForProject(project: ProjectSummary): ProjectBoard {
  const custom = boardsBySlug[project.slug]
  if (custom) return custom

  const fallbackByColumn: BoardColumnId[] = [
    "todo",
    "in_progress",
    "in_review",
    "completed",
  ]
  const tasks = fallbackByColumn.flatMap((column) => {
    const template = designTeamBoardTasks.find((t) => t.column === column)
    if (!template) return []
    return [
      {
        ...template,
        id: `${project.slug}-${column}`,
        assignees: project.team.slice(0, 1),
      },
    ]
  })

  return {
    boardTitle: `${project.title} Board`,
    extraTeamCount: Math.max(0, project.team.length - 4),
    tasks,
  }
}

const monthAbbrev: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
}

/** Parses seed due labels (e.g. "May 18", "Tomorrow") for dashboard KPIs. */
export function parseDueLabel(
  dueLabel: string,
  reference: Date = new Date()
): Date | null {
  const normalized = dueLabel.trim().toLowerCase()
  if (
    normalized === "completed" ||
    normalized === "—" ||
    normalized === "-" ||
    normalized === ""
  ) {
    return null
  }

  if (normalized === "today") {
    return startOfDay(reference)
  }

  if (normalized === "tomorrow") {
    const next = new Date(reference)
    next.setDate(next.getDate() + 1)
    return startOfDay(next)
  }

  const match = dueLabel.trim().match(/^([A-Za-z]+)\s+(\d{1,2})$/i)
  if (!match) return null

  const month = monthAbbrev[match[1].slice(0, 3).toLowerCase()]
  if (month === undefined) return null

  return new Date(reference.getFullYear(), month, parseInt(match[2], 10))
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function isDueOverdue(
  dueLabel: string,
  reference: Date = new Date()
): boolean {
  const due = parseDueLabel(dueLabel, reference)
  if (!due) return false
  return startOfDay(due).getTime() < startOfDay(reference).getTime()
}

export type DashboardMyTask = {
  status: MyTaskStatus
  dueLabel?: string
}

export type DashboardKpiCounts = {
  activeProjects: number
  inProgress: number
  assignedToMe: number
  needsAttention: number
}

export function getDashboardKpiCounts(
  myTasks: DashboardMyTask[] = []
): DashboardKpiCounts {
  const activeProjects = projectsSeed.filter((p) => p.lifecycle === "active").length

  let inProgress = 0
  let needsAttention = 0

  for (const project of projectsSeed) {
    const board = getBoardForProject(project)
    for (const task of board.tasks) {
      if (task.column === "in_progress") {
        inProgress += 1
      }
      if (task.column !== "completed" && isDueOverdue(task.dueLabel)) {
        needsAttention += 1
      }
    }
  }

  const openMyTasks = myTasks.filter((task) => task.status !== "completed")
  for (const task of openMyTasks) {
    if (task.dueLabel && isDueOverdue(task.dueLabel)) {
      needsAttention += 1
    }
  }

  return {
    activeProjects,
    inProgress,
    assignedToMe: openMyTasks.length,
    needsAttention,
  }
}
