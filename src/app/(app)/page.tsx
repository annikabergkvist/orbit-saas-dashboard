import Image from "next/image"
import Link from "next/link"
import {
  ArrowUpRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  FolderKanbanIcon,
  UserCheckIcon,
  type LucideIcon,
} from "lucide-react"

// Orbit-specific building blocks.
import { ClaritySliderLineIcon } from "@/components/icons/clarity-slider-line-icon"
import { ActivityOverviewChart } from "@/components/orbit/charts/activity-overview-chart"
import { IssuesByStatusDonut } from "@/components/orbit/charts/issues-by-status-donut"
import {
  IssuePriorityBadge,
  IssueStatusBadge,
  issueStatusStripBackground,
} from "@/components/orbit/issues/issue-badges"

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
import { getBoardForProject, projectsSeed } from "@/lib/projects-data"
import { cn } from "@/lib/utils"

type Issue = {
  id: string
  title: string
  assignee?: string
  priority: "low" | "medium" | "high"
  status: "todo" | "in_progress" | "in_review" | "done"
}

type OpenTicket = {
  id: string
  assignee: string
  /** Shown under the name (grey line), like the reference copy. */
  description: string
  /** Portrait for the avatar; falls back to initials if the image fails to load. */
  avatarUrl: string
}

// Placeholder data until we connect a real backend (DB + API).
const openTickets: OpenTicket[] = [
  {
    id: "ENG-123",
    assignee: "Jacob Martinez",
    description: "Checkout fails when users apply two discount codes in the same cart.",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "ENG-124",
    assignee: "Luke Bell",
    description: "Export to CSV times out for workspaces with more than 10k rows.",
    avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
  },
  {
    id: "ENG-125",
    assignee: "Connor Mitchell",
    description: "Push notifications stopped arriving on Android after the last release.",
    avatarUrl: "https://randomuser.me/api/portraits/men/52.jpg",
  },
]

const myTasks: Issue[] = [
  {
    id: "ENG-123",
    title: "Implement user authentication flow",
    priority: "high",
    status: "in_progress",
  },
  { id: "ENG-129", title: "Update API documentation", priority: "medium", status: "todo" },
  { id: "ENG-131", title: "Fix responsive layout issues", priority: "high", status: "in_progress" },
  { id: "ENG-135", title: "Add dark mode support", priority: "low", status: "in_review" },
  {
    id: "ENG-140",
    title: "Polish onboarding empty states",
    priority: "medium",
    status: "done",
  },
  {
    id: "ENG-141",
    title: "Audit role permissions for billing",
    priority: "low",
    status: "done",
  },
]

type Meeting = {
  id: string
  title: string
  time: string
  provider: "Meet" | "Zoom"
}

const myMeetings: Meeting[] = [
  { id: "meet-1", title: "App Project", time: "6:45 PM", provider: "Meet" },
  { id: "meet-2", title: "User Research", time: "6:45 PM", provider: "Zoom" },
]

/** Sprint-over-sprint trends (placeholder until API). */
const sprintTrends = {
  activeProjects: { delta: "+16.7%", direction: "up" as const },
  totalTasks: { delta: "+11.4%", direction: "up" as const },
  assignedToMe: { delta: "-8.3%", direction: "down" as const },
  completedTasks: { delta: "+22.1%", direction: "up" as const },
}

function getDashboardKpiCounts() {
  const activeProjects = projectsSeed.filter((p) => p.lifecycle === "active").length
  let totalTasks = 0
  let completedTasks = 0

  for (const project of projectsSeed) {
    const board = getBoardForProject(project)
    totalTasks += board.tasks.length
    completedTasks += board.tasks.filter((t) => t.column === "completed" || t.done).length
  }

  return {
    activeProjects,
    totalTasks,
    completedTasks,
    assignedToMe: myTasks.length,
  }
}

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
  delta,
  deltaDirection,
}: {
  icon: LucideIcon
  title: string
  value: string
  delta: string
  deltaDirection: "up" | "down"
}) {
  return (
    <Card glass className="gap-0 py-0">
      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2.5">
          <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/25 text-foreground backdrop-blur-sm">
            <Icon className="size-4" strokeWidth={1.75} />
          </div>
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </div>

        <CardTitle className="text-3xl font-bold tracking-tight">{value}</CardTitle>

        <div className="mt-2 text-sm text-muted-foreground">
          <span
            className="inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor:
                deltaDirection === "up"
                  ? "var(--kpi-delta-up)"
                  : "var(--kpi-delta-down)",
              color:
                deltaDirection === "up"
                  ? "var(--kpi-delta-up-foreground)"
                  : "var(--kpi-delta-down-foreground)",
            }}
          >
            {delta}
          </span>{" "}
          vs last sprint
        </div>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const kpi = getDashboardKpiCounts()

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 py-8 px-16">
      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={FolderKanbanIcon}
          title="Active Projects"
          value={String(kpi.activeProjects)}
          delta={sprintTrends.activeProjects.delta}
          deltaDirection={sprintTrends.activeProjects.direction}
        />
        <KpiCard
          icon={ClipboardListIcon}
          title="Total Tasks"
          value={String(kpi.totalTasks)}
          delta={sprintTrends.totalTasks.delta}
          deltaDirection={sprintTrends.totalTasks.direction}
        />
        <KpiCard
          icon={UserCheckIcon}
          title="Assigned to Me"
          value={String(kpi.assignedToMe)}
          delta={sprintTrends.assignedToMe.delta}
          deltaDirection={sprintTrends.assignedToMe.direction}
        />
        <KpiCard
          icon={CheckCircleIcon}
          title="Completed Tasks"
          value={String(kpi.completedTasks)}
          delta={sprintTrends.completedTasks.delta}
          deltaDirection={sprintTrends.completedTasks.direction}
        />
      </div>

      {/* Dashboard grid (matches reference layout) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_320px] lg:items-stretch">
        {/* Row 1 / Col 1-2: equal-height chart cards */}
        <div className="grid min-h-0 grid-cols-1 gap-4 lg:col-span-2 lg:grid-cols-2 lg:items-stretch">
          <Card className="h-full min-h-0">
            <CardHeader className="px-7 pt-3">
              <CardTitle className="text-lg font-semibold">Tasks by Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col px-7 pb-7">
              <IssuesByStatusDonut />
            </CardContent>
          </Card>

          <Card className="h-full min-h-0">
            <CardHeader className="px-7 pt-3">
              <CardTitle className="text-lg font-semibold">Activity Overview</CardTitle>
              <CardDescription>Total tasks completed over time</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col px-7 pb-7">
              <ActivityOverviewChart />
            </CardContent>
          </Card>
        </div>

        {/* Right rail: row 2-3 / col 3 */}
        <div className="flex min-h-0 flex-col gap-4 lg:col-start-3 lg:row-span-2 lg:row-start-1">
          <Card>
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
            <CardContent className="px-7 pb-7">
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
                      <span className="text-xs font-bold text-foreground">{meeting.time}</span>
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

          <Card>
            <CardHeader className="px-7 pt-3">
              <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
                Open Tickets
              </CardTitle>
              <CardAction>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  aria-label="Filter tickets"
                  className="size-9 shrink-0 -translate-y-1 rounded-full border-border bg-muted/50 text-foreground shadow-none hover:bg-muted"
                >
                  <ClaritySliderLineIcon className="size-[18px] text-foreground" />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="px-7 pb-7">
              <div className="space-y-3">
                {openTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-xl border border-foreground/10 bg-card px-4 py-3.5"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar size="lg" className="shrink-0 bg-muted text-foreground after:border-foreground/10">
                        <AvatarImage src={ticket.avatarUrl} alt="" />
                        <AvatarFallback className="bg-muted text-xs font-semibold">
                          {ticket.assignee
                            .split(" ")
                            .slice(0, 2)
                            .map((p) => p[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-foreground">{ticket.assignee}</div>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {ticket.description}
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
                See all tickets
                <ChevronRightIcon className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Row 3 / Col 1-2 */}
        <Card className="lg:col-span-2 lg:col-start-1 lg:row-start-2">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-3 px-7 pt-3 pb-1">
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
                My Tasks
              </CardTitle>
              <CardDescription className="text-sm leading-snug text-muted-foreground">
                {myTasks.filter((t) => t.status !== "done").length} open ·{" "}
                {myTasks.filter((t) => t.status === "done").length} completed
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
              {myTasks.map((task) => {
                const isDone = task.status === "done"
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
                            <IssuePriorityBadge priority={task.priority} showBackground />
                          </div>
                        </div>
                        <span
                          className={cn(
                            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                            isDone ? "border-transparent" : "border-border bg-background"
                          )}
                          style={
                            isDone ? { backgroundColor: "var(--status-chart-done)" } : undefined
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
