import Image from "next/image"
import Link from "next/link"
import {
  ArrowUpRightIcon,
  CalendarClockIcon,
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  FolderKanbanIcon,
  UserCheckIcon,
  type LucideIcon,
} from "lucide-react"

// Orbit-specific building blocks.
import { ClaritySliderLineIcon } from "@/components/icons/clarity-slider-line-icon"
import { ProjectTimelineCard } from "@/components/orbit/projects/project-timeline-card"
import { ProjectsProgressCard } from "@/components/orbit/projects/projects-progress-card"
import {
  IssuePriorityBadge,
  IssueStatusBadge,
  issueStatusStripBackground,
} from "@/components/orbit/issues/issue-badges"
import {
  countOpenIssuesForAssignee,
  CURRENT_USER,
  getAssignee,
  getIssuesForAssignee,
  issuesSeed,
} from "@/lib/issues-data"
import {
  countProjectsNeedingAttention,
  getDashboardKpiCounts,
} from "@/lib/projects-data"

// Shared UI primitives from shadcn/ui (Base UI flavor).
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Annika's tasks — same data as /issues and the Assigned to Me KPI.
const myIssues = getIssuesForAssignee(CURRENT_USER.id)

type OpenIssue = {
  id: string
  assignee: string
  /** Shown under the name (grey line), like the reference copy. */
  description: string
  /** Portrait for the avatar; falls back to initials if the image fails to load. */
  avatarUrl: string
}

// Open issues from teammates — derived from the shared issues seed.
const openIssues: OpenIssue[] = issuesSeed
  .filter((issue) => issue.status !== "completed" && issue.assigneeId !== CURRENT_USER.id)
  .slice(0, 3)
  .map((issue) => {
    const assignee = getAssignee(issue.assigneeId)!
    return {
      id: issue.id,
      assignee: assignee.name,
      description: issue.title,
      avatarUrl: assignee.avatarUrl,
    }
  })

// Live counts so the headline KPIs stay in sync with project/task data.
const kpiCounts = {
  ...getDashboardKpiCounts(
    myIssues.map((issue) => ({
      status: issue.status,
      dueLabel: issue.dueLabel,
    }))
  ),
  assignedToMe: countOpenIssuesForAssignee(CURRENT_USER.id),
}

type Meeting = {
  id: string
  title: string
  time: string
  provider: "Meet" | "Zoom"
}

const myMeetings: Meeting[] = [
  { id: "meet-1", title: "App Project", time: "9:00 AM", provider: "Meet" },
  { id: "meet-2", title: "User Research", time: "2:30 PM", provider: "Zoom" },
]

const needsAttentionCount = countProjectsNeedingAttention()

const dashboardKpis = [
  {
    icon: FolderKanbanIcon,
    title: "Active Projects",
    value: String(kpiCounts.activeProjects),
    context: "Currently in flight",
    href: "/projects?tab=active",
  },
  {
    icon: ClipboardListIcon,
    title: "In Progress",
    value: String(kpiCounts.inProgress),
    context: "Tasks across all boards",
    href: "/issues?status=in_progress",
  },
  {
    icon: UserCheckIcon,
    title: "Assigned to Me",
    value: String(kpiCounts.assignedToMe),
    context: "Open tasks on your plate",
    href: "/issues?assignee=me",
  },
  {
    icon: CalendarClockIcon,
    title: "Needs Attention",
    value: String(needsAttentionCount),
    context: "Overdue or at-risk projects",
    href: "/projects?filter=attention&sort=progress-asc",
  },
] as const

function MeetingProviderMark({
  provider,
  className,
}: {
  provider: Meeting["provider"]
  className?: string
}) {
  const src = provider === "Meet" ? "/icons/google-meet.svg" : "/icons/zoom.svg"
  return (
    <Image
      src={src}
      alt=""
      width={16}
      height={16}
      draggable={false}
      className={cn("size-4 shrink-0 object-contain", className)}
    />
  )
}

function KpiCard({
  icon: Icon,
  title,
  value,
  context,
  href,
}: {
  icon: LucideIcon
  title: string
  value: string
  context: string
  href: string
}) {
  return (
    <Card glass className="gap-0 py-0">
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/25 text-foreground backdrop-blur-sm">
              <Icon className="size-4" strokeWidth={1.75} />
            </div>
            <span className="text-sm font-medium text-foreground">{title}</span>
          </div>
          <Link
            href={href}
            aria-label={`Open ${title.toLowerCase()}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "icon-lg",
                className:
                  "size-9 shrink-0 rounded-full border-border bg-muted/50 text-foreground shadow-none hover:bg-muted",
              })
            )}
          >
            <ArrowUpRightIcon className="size-[18px]" strokeWidth={1.75} />
          </Link>
        </div>

        <CardTitle className="text-3xl font-bold tracking-tight">{value}</CardTitle>

        <p className="mt-2 text-xs text-muted-foreground">{context}</p>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 py-8 px-16">
      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardKpis.map((kpi) => (
          <KpiCard
            key={kpi.title}
            icon={kpi.icon}
            title={kpi.title}
            value={kpi.value}
            context={kpi.context}
            href={kpi.href}
          />
        ))}
      </div>

      {/* Dashboard grid (matches reference layout) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_320px] lg:items-stretch">
        {/* Row 1 / Col 1-2: equal-height chart cards */}
        <div className="grid min-h-0 grid-cols-1 gap-4 lg:col-span-2 lg:grid-cols-2 lg:items-stretch">
          <ProjectTimelineCard className="h-full min-h-0" />

          <ProjectsProgressCard className="h-full min-h-0" />
        </div>

        {/* Right rail: row 2-3 / col 3 */}
        <div className="flex min-h-0 flex-col gap-4 lg:col-start-3 lg:row-span-2 lg:row-start-1">
          <Card glass="subtle">
            <CardHeader className="px-7 pt-3">
              <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
                My Meetings
              </CardTitle>
              <CardAction>
                <Link
                  href="/calendar"
                  aria-label="Open calendar"
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "icon-lg",
                      className:
                        "size-9 shrink-0 -translate-y-1 rounded-full border-border bg-muted/50 text-foreground shadow-none hover:bg-muted",
                    })
                  )}
                >
                  <CalendarIcon className="size-[18px]" strokeWidth={1.75} />
                </Link>
              </CardAction>
            </CardHeader>
            <CardContent className="px-7 pb-1">
              <div className="space-y-3">
                {myMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="rounded-xl border border-foreground/10 bg-card px-4 py-3.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 truncate text-base font-bold text-foreground">
                        {meeting.title}
                      </p>
                      <button
                        type="button"
                        className="shrink-0 rounded-md p-0.5 text-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
                        aria-label={`Open ${meeting.title}`}
                      >
                        <ArrowUpRightIcon className="size-4" strokeWidth={1.75} />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-xs font-normal text-foreground">{meeting.time}</span>
                      <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                        <MeetingProviderMark provider={meeting.provider} />
                        {meeting.provider}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/calendar"
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className:
                      "mt-2 h-auto gap-1 px-0 py-1 font-semibold text-muted-foreground hover:text-foreground",
                  })
                )}
              >
                See all meetings
                <ChevronRightIcon className="size-4" />
              </Link>
            </CardContent>
          </Card>

          <Card glass="subtle">
            <CardHeader className="px-7 pt-3">
              <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
                Open Issues
              </CardTitle>
              <CardAction>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  aria-label="Filter issues"
                  className="size-9 shrink-0 -translate-y-1 rounded-full border-border bg-muted/50 text-foreground shadow-none hover:bg-muted"
                >
                  <ClaritySliderLineIcon className="size-[18px] text-foreground" />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="px-7 pb-1">
              <div className="space-y-3">
                {openIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="rounded-xl border border-foreground/10 bg-card px-4 py-3.5"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar size="lg" className="shrink-0 bg-muted text-foreground after:border-foreground/10">
                        <AvatarImage src={issue.avatarUrl} alt="" />
                        <AvatarFallback className="bg-muted text-xs font-semibold">
                          {issue.assignee
                            .split(" ")
                            .slice(0, 2)
                            .map((p) => p[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-foreground">{issue.assignee}</div>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {issue.description}
                        </p>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="mt-3 h-8 gap-0.5 rounded-full border border-border/80 bg-muted/60 px-3.5 text-xs font-medium text-foreground shadow-none hover:bg-muted"
                        >
                          Check
                          <ChevronRightIcon className="size-3.5 opacity-70" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/issues"
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className:
                      "mt-2 h-auto gap-1 px-0 py-1 font-semibold text-muted-foreground hover:text-foreground",
                  })
                )}
              >
                See all issues
                <ChevronRightIcon className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Row 3 / Col 1-2 */}
        <Card glass="subtle" className="lg:col-span-2 lg:col-start-1 lg:row-start-2">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-3 px-7 pt-3 pb-1">
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
                My Tasks
              </CardTitle>
              <CardDescription className="text-sm leading-snug text-muted-foreground">
                {myIssues.filter((t) => t.status !== "completed").length} open ·{" "}
                {myIssues.filter((t) => t.status === "completed").length} completed
              </CardDescription>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-md border-border/80 bg-muted/70 px-3 text-xs font-medium text-muted-foreground shadow-none hover:bg-muted"
              >
                Filter
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-8 rounded-md border-0 bg-primary/15 px-3 text-sm font-medium text-primary shadow-none hover:bg-primary/25"
              >
                + New Task
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                aria-label="Task list settings"
                className="size-9 shrink-0 rounded-full border-border bg-muted/50 text-foreground shadow-none hover:bg-muted"
              >
                <ClaritySliderLineIcon className="size-[18px] text-foreground" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-7 pb-7">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {myIssues.map((task) => {
                const isDone = task.status === "completed"
                return (
                  <div
                    key={task.id}
                    className="flex overflow-hidden rounded-xl border border-foreground/10 bg-card transition-colors hover:bg-muted/30"
                  >
                    <div
                      className="w-1 shrink-0 self-stretch"
                      style={{ backgroundColor: issueStatusStripBackground(task.status) }}
                      aria-hidden
                    />
                    <div className="relative min-w-0 flex-1 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className={cn("min-w-0 flex-1", isDone && "opacity-80")}>
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">{task.id}</span>
                          </div>
                          <div
                            className={cn(
                              "mt-1 text-sm font-semibold",
                              isDone &&
                                "text-[#9aa3b2] line-through decoration-[#949ca6] decoration-1"
                            )}
                          >
                            {task.title}
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <IssueStatusBadge status={task.status} />
                            <IssuePriorityBadge priority={task.priority} />
                          </div>
                        </div>
                        <span
                          className={cn(
                            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                            isDone ? "border-transparent" : "border-border bg-background"
                          )}
                          style={
                            isDone
                              ? { backgroundColor: "var(--status-chart-completed)" }
                              : undefined
                          }
                          role="img"
                          aria-label={isDone ? "Completed" : "Not completed"}
                        >
                          {isDone ? (
                            <CheckIcon className="size-3 text-white" strokeWidth={3} />
                          ) : null}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
