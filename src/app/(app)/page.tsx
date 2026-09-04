import Link from "next/link"
import {
  ArrowUpRightIcon,
  CalendarClockIcon,
  ClipboardListIcon,
  FolderKanbanIcon,
  UserCheckIcon,
  type LucideIcon,
} from "lucide-react"

import { DashboardMeetingsCard } from "@/components/orbit/dashboard/dashboard-meetings-card"
import { MyTasksCard } from "@/components/orbit/dashboard/my-tasks-card"
import { OpenIssuesCard } from "@/components/orbit/dashboard/open-issues-card"
import { ProjectTimelineCard } from "@/components/orbit/projects/project-timeline-card"
import { ProjectsProgressCard } from "@/components/orbit/projects/projects-progress-card"
import {
  countOpenIssuesForAssignee,
  getIssuesForAssignee,
} from "@/lib/issues-data"
import { CURRENT_USER_ID } from "@/lib/team-data"
import {
  countProjectsNeedingAttention,
  getDashboardKpiCounts,
} from "@/lib/projects-data"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Annika's tasks — same data as /issues and the Assigned to Me KPI.
const myIssues = getIssuesForAssignee(CURRENT_USER_ID)

// Live counts so the headline KPIs stay in sync with project/task data.
const kpiCounts = {
  ...getDashboardKpiCounts(
    myIssues.map((issue) => ({
      status: issue.status,
      dueLabel: issue.dueLabel,
    }))
  ),
  assignedToMe: countOpenIssuesForAssignee(CURRENT_USER_ID),
}

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
      <CardContent className="p-3 sm:p-4">
        <Link href={href} className="block outline-none" aria-label={`Open ${title.toLowerCase()}`}>
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
              <div className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/25 text-foreground backdrop-blur-sm sm:size-8 dark:border-violet-500/25 dark:bg-violet-950/50 dark:text-violet-200 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)]">
                <Icon className="size-3.5 sm:size-4" strokeWidth={1.75} />
              </div>
              <span className="text-xs font-medium text-foreground sm:text-sm">{title}</span>
            </div>
            <span
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "icon-lg",
                  className:
                    "hidden size-9 shrink-0 rounded-full border-border bg-muted/50 text-foreground shadow-none hover:bg-muted/35 md:inline-flex dark:border-violet-500/20 dark:bg-violet-950/40 dark:text-violet-200 dark:hover:border-violet-500/35 dark:hover:bg-violet-900/45 dark:hover:shadow-[0_0_14px_rgb(88_28_135_/_0.35)]",
                })
              )}
              aria-hidden
            >
              <ArrowUpRightIcon className="size-[18px]" strokeWidth={1.75} />
            </span>
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl dark:bg-gradient-to-br dark:from-violet-100 dark:to-violet-400 dark:bg-clip-text dark:text-transparent">
            {value}
          </CardTitle>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{context}</p>
        </Link>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 px-4 py-5 sm:px-8 sm:py-8 md:px-10 lg:px-16">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
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
          <DashboardMeetingsCard />

          <OpenIssuesCard />
        </div>

        <MyTasksCard />
      </div>
    </div>
  )
}
