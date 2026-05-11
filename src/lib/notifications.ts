export type NotificationCategory =
  | "task"
  | "comment"
  | "mention"
  | "assignment"
  | "status"
  | "due_date"
  | "system"

export type NotificationEntityType = "task" | "project" | "issue" | "workspace"

export type NotificationAction =
  | "mentioned_you"
  | "commented"
  | "assigned_you"
  | "status_changed"
  | "due_date_changed"
  | "created"
  | "completed"

export type NotificationCTA =
  | { kind: "link"; label: string; href: string }
  | {
      kind: "button"
      label: string
      actionId: "reply" | "mark_read" | "open" | "approve" | "deny"
    }

export type NotificationActor = {
  id: string
  name: string
  avatarUrl?: string
}

export type NotificationEntity = {
  type: NotificationEntityType
  id: string
  name: string
  href: string
}

export type NotificationProject = {
  id: string
  name: string
  href: string
}

export type NotificationCommentPreview = {
  /** Small preview card title (usually the task/project name). */
  title: string
  /** One-paragraph snippet. */
  summary: string
  /** Optional thumbnail shown on the left. */
  thumbnailUrl?: string
  /** Link for the "Open" action in the preview card. */
  href: string
  /** Link for "View more comments". */
  threadHref: string
  /** Number of additional comments in the thread (excluding the latest). */
  moreCount: number
}

export type Notification = {
  id: string
  readAt: string | null
  createdAt: string
  category: NotificationCategory
  action: NotificationAction
  actor: NotificationActor
  entity: NotificationEntity
  project?: NotificationProject
  previewText?: string
  commentPreview?: NotificationCommentPreview
  ctas?: NotificationCTA[]
}

export const isUnread = (n: Notification) => n.readAt == null

export function formatNotificationText(n: Notification): {
  actor: string
  verb: string
  entityName: string
} {
  const verbMap: Record<NotificationAction, string> = {
    mentioned_you: "mentioned you on",
    commented: "commented on",
    assigned_you: "assigned you to",
    status_changed: "changed status on",
    due_date_changed: "changed the due date on",
    created: "created",
    completed: "completed",
  }

  return { actor: n.actor.name, verb: verbMap[n.action], entityName: n.entity.name }
}

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

export const seedNotifications: Notification[] = [
  {
    id: "notif-1",
    createdAt: minutesAgo(2),
    readAt: null,
    category: "mention",
    action: "mentioned_you",
    actor: {
      id: "u-lucy",
      name: "Lucy Livingstone",
      avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    entity: {
      type: "task",
      id: "ENG-140",
      name: "Polish onboarding empty states",
      href: "/tasks/ENG-140",
    },
    project: { id: "proj-onboarding", name: "Onboarding Revamp", href: "/projects/onboarding" },
    ctas: [{ kind: "button", label: "Reply", actionId: "reply" }],
  },
  {
    id: "notif-2",
    createdAt: minutesAgo(18),
    readAt: null,
    category: "assignment",
    action: "assigned_you",
    actor: {
      id: "u-luke",
      name: "Luke Bell",
      avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    entity: {
      type: "task",
      id: "ENG-131",
      name: "Fix responsive layout issues",
      href: "/tasks/ENG-131",
    },
    project: { id: "proj-frontend", name: "Frontend Polish", href: "/projects/frontend" },
    ctas: [
      { kind: "link", label: "View", href: "/tasks/ENG-131" },
    ],
  },
  {
    id: "notif-3",
    createdAt: minutesAgo(75),
    readAt: minutesAgo(30),
    category: "status",
    action: "status_changed",
    actor: {
      id: "u-jacob",
      name: "Jacob Martinez",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    entity: {
      type: "task",
      id: "ENG-123",
      name: "Implement user authentication flow",
      href: "/tasks/ENG-123",
    },
    project: { id: "proj-auth", name: "Auth Platform", href: "/projects/auth" },
  },
  {
    id: "notif-4",
    createdAt: minutesAgo(240),
    readAt: minutesAgo(120),
    category: "comment",
    action: "commented",
    actor: {
      id: "u-adnan",
      name: "Adnan Niki",
      avatarUrl: "https://randomuser.me/api/portraits/men/52.jpg",
    },
    entity: {
      type: "task",
      id: "ENG-129",
      name: "Update API documentation",
      href: "/tasks/ENG-129",
    },
    project: { id: "proj-api", name: "API Platform", href: "/projects/api" },
    commentPreview: {
      title: "Update API documentation",
      summary:
        "Can we add a short section for error codes and a small example request/response for the auth endpoints?",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=160&h=120&q=60",
      href: "/tasks/ENG-129",
      threadHref: "/tasks/ENG-129#comments",
      moreCount: 7,
    },
  },
]

