import { getProjectTitle } from "@/lib/issues-data"
import { getTeamMember } from "@/lib/team-data"

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

function teamActor(memberId: string): NotificationActor {
  const member = getTeamMember(memberId)!
  return { id: member.id, name: member.name, avatarUrl: member.avatarUrl }
}

function projectRef(slug: string): NotificationProject {
  return { id: slug, name: getProjectTitle(slug), href: `/projects/${slug}` }
}

export const seedNotifications: Notification[] = [
  {
    id: "notif-1",
    createdAt: minutesAgo(2),
    readAt: null,
    category: "mention",
    action: "mentioned_you",
    actor: teamActor("u-sara"),
    entity: {
      type: "issue",
      id: "ORB-205",
      name: "Dark mode polish for billing screens",
      href: "/issues?assignee=u-maria",
    },
    project: projectRef("customer-portal-v2"),
    ctas: [{ kind: "button", label: "Reply", actionId: "reply" }],
  },
  {
    id: "notif-2",
    createdAt: minutesAgo(18),
    readAt: null,
    category: "assignment",
    action: "assigned_you",
    actor: teamActor("u-alex"),
    entity: {
      type: "issue",
      id: "ORB-217",
      name: "Chart tooltip focus trap",
      href: "/issues?assignee=me",
    },
    project: projectRef("analytics-dashboard"),
    ctas: [{ kind: "link", label: "View", href: "/issues?assignee=me" }],
  },
  {
    id: "notif-3",
    createdAt: minutesAgo(75),
    readAt: minutesAgo(30),
    category: "status",
    action: "status_changed",
    actor: teamActor("u-chris"),
    entity: {
      type: "issue",
      id: "ORB-208",
      name: "Configurable Slack routing filters",
      href: "/issues?assignee=u-chris",
    },
    project: projectRef("slack-integration"),
  },
  {
    id: "notif-4",
    createdAt: minutesAgo(240),
    readAt: minutesAgo(120),
    category: "comment",
    action: "commented",
    actor: teamActor("u-priya"),
    entity: {
      type: "issue",
      id: "ORB-206",
      name: "Document webhooks in the API reference",
      href: "/issues?assignee=u-priya",
    },
    project: projectRef("api-documentation"),
    commentPreview: {
      title: "Document webhooks in the API reference",
      summary:
        "Can we add a short section for error codes and a small example request/response for the auth endpoints?",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=160&h=120&q=60",
      href: "/issues?assignee=u-priya",
      threadHref: "/issues?assignee=u-priya",
      moreCount: 2,
    },
  },
]
