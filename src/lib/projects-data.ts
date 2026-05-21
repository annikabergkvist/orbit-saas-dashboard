export type ProjectLifecycle = "active" | "planning" | "completed"

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
  team: ProjectMember[]
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
    dueLabel: "May 15",
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
    dueLabel: "May 22",
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
    id: "p-6",
    slug: "mobile-app-launch",
    title: "Mobile App Launch",
    description:
      "App store assets, rollout checklist, and phased release for iOS and Android builds.",
    type: "design",
    priority: "high",
    lifecycle: "active",
    progress: 92,
    comments: 31,
    attachments: 7,
    dueLabel: "May 18",
    team: [
      {
        id: "m-14",
        name: "Ryan Cooper",
        avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        id: "m-15",
        name: "Anna Bergkvist",
        avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      },
    ],
  },
]

export type BoardColumnId = "pending" | "in_progress" | "completed" | "launched"

export type TaskTag = "research" | "development" | "ux-writing" | "design" | "documentation"

export type BoardTask = {
  id: string
  title: string
  description?: string
  column: BoardColumnId
  tags?: TaskTag[]
  priority?: ProjectPriority
  progress?: number
  done?: boolean
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
    id: "pending",
    label: "Pending",
    headerClass: "bg-muted/80 text-muted-foreground",
    dotClass: "border-2 border-muted-foreground/40 bg-transparent",
  },
  {
    id: "in_progress",
    label: "In Progress",
    headerClass: "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-100",
    dotClass: "bg-amber-400",
  },
  {
    id: "completed",
    label: "Completed",
    headerClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-100",
    dotClass: "bg-emerald-500",
  },
  {
    id: "launched",
    label: "Launched",
    headerClass: "bg-primary/15 text-primary",
    dotClass: "bg-primary",
  },
]

const designTeamBoardTasks: BoardTask[] = [
  {
    id: "cp-p1",
    title: "Billing empty states",
    description:
      "Map every billing error and zero-data scenario for invoices, payments, and plan changes.",
    column: "pending",
    tags: ["research"],
    comments: 2,
    attachments: 1,
    dueLabel: "May 20",
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
    column: "pending",
    tags: ["design"],
    priority: "medium",
    comments: 0,
    attachments: 3,
    dueLabel: "May 22",
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
    column: "in_progress",
    tags: ["ux-writing"],
    progress: 72,
    comments: 4,
    attachments: 5,
    dueLabel: "May 17",
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
    done: true,
    comments: 6,
    attachments: 0,
    dueLabel: "May 10",
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
    done: true,
    comments: 11,
    attachments: 4,
    dueLabel: "May 8",
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
    column: "launched",
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
        column: "pending",
        tags: ["development"],
        priority: "high",
        comments: 5,
        attachments: 2,
        dueLabel: "May 24",
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
        column: "pending",
        tags: ["research"],
        comments: 1,
        attachments: 0,
        dueLabel: "May 25",
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
        dueLabel: "May 20",
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
        id: "si-c1",
        title: "Staging smoke tests",
        description: "End-to-end checks for connect, disconnect, and sample alert delivery.",
        column: "completed",
        tags: ["development"],
        done: true,
        comments: 6,
        attachments: 2,
        dueLabel: "May 12",
        assignees: [],
      },
      {
        id: "si-c2",
        title: "Security review",
        description: "Completed threat model and token storage review with infra.",
        column: "completed",
        tags: ["research"],
        done: true,
        comments: 3,
        attachments: 5,
        dueLabel: "May 9",
        assignees: [],
      },
      {
        id: "si-l1",
        title: "Internal dogfood rollout",
        description: "Live for Orbit staff workspaces with feedback channel in #product-alerts.",
        column: "launched",
        tags: ["development"],
        comments: 18,
        attachments: 4,
        dueLabel: "May 1",
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
        column: "pending",
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
        column: "in_progress",
        tags: ["development"],
        progress: 12,
        comments: 2,
        attachments: 1,
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
        id: "ad-c1",
        title: "Data source inventory",
        description:
          "Catalogued warehouse tables and event streams needed for v1 reporting scopes.",
        column: "completed",
        tags: ["research"],
        done: true,
        comments: 8,
        attachments: 6,
        dueLabel: "May 28",
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
        column: "launched",
        tags: ["development"],
        comments: 12,
        attachments: 1,
        dueLabel: "May 20",
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
        column: "pending",
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
        column: "pending",
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
        dueLabel: "May 30",
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
        id: "doc-c1",
        title: "REST reference v2",
        description:
          "Published endpoint reference with auth flows, rate limits, and changelog cross-links.",
        column: "completed",
        tags: ["documentation"],
        done: true,
        comments: 24,
        attachments: 12,
        dueLabel: "May 15",
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
        done: true,
        comments: 9,
        attachments: 2,
        dueLabel: "May 20",
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
        column: "launched",
        tags: ["documentation"],
        comments: 31,
        attachments: 5,
        dueLabel: "May 1",
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
        column: "pending",
        tags: ["development"],
        priority: "medium",
        comments: 4,
        attachments: 1,
        dueLabel: "May 26",
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
        column: "pending",
        tags: ["research"],
        comments: 1,
        attachments: 0,
        dueLabel: "May 28",
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
        dueLabel: "May 22",
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
        dueLabel: "May 24",
        assignees: [
          {
            id: "m-12",
            name: "James O'Neil",
            avatarUrl: "https://randomuser.me/api/portraits/men/11.jpg",
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
        done: true,
        comments: 7,
        attachments: 4,
        dueLabel: "May 14",
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
        done: true,
        comments: 4,
        attachments: 1,
        dueLabel: "May 11",
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
        column: "launched",
        tags: ["development"],
        comments: 9,
        attachments: 2,
        dueLabel: "May 10",
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
        column: "pending",
        tags: ["design"],
        priority: "high",
        comments: 6,
        attachments: 8,
        dueLabel: "May 20",
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
        column: "pending",
        tags: ["design"],
        priority: "medium",
        comments: 3,
        attachments: 4,
        dueLabel: "May 21",
        assignees: [
          {
            id: "m-15",
            name: "Anna Bergkvist",
            avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
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
        dueLabel: "May 18",
        assignees: [
          {
            id: "m-15",
            name: "Anna Bergkvist",
            avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
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
        dueLabel: "May 17",
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
        dueLabel: "May 16",
        assignees: [
          {
            id: "m-15",
            name: "Anna Bergkvist",
            avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
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
        done: true,
        comments: 22,
        attachments: 3,
        dueLabel: "May 12",
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
        done: true,
        comments: 16,
        attachments: 0,
        dueLabel: "May 10",
        assignees: [],
      },
      {
        id: "mob-l1",
        title: "iOS 1.0 store listing",
        description:
          "Live on the App Store with localized description and support links to help center.",
        column: "launched",
        tags: ["design"],
        comments: 31,
        attachments: 7,
        dueLabel: "May 5",
        launchDateTime: "May 5 - 06:00AM",
        assignees: [
          {
            id: "m-15",
            name: "Anna Bergkvist",
            avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
          },
        ],
      },
      {
        id: "mob-l2",
        title: "Android open beta",
        description:
          "Public beta track live with in-app upgrade prompt for legacy APK installs.",
        column: "launched",
        tags: ["development"],
        comments: 24,
        attachments: 6,
        dueLabel: "May 3",
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
}

export function getProjectBySlug(slug: string): ProjectSummary | undefined {
  return projectsSeed.find((p) => p.slug === slug)
}

export function getBoardForProject(project: ProjectSummary): ProjectBoard {
  const custom = boardsBySlug[project.slug]
  if (custom) return custom

  const fallbackByColumn: BoardColumnId[] = [
    "pending",
    "in_progress",
    "completed",
    "launched",
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
