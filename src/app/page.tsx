export default function Home() {
  // This is the entry route ("/"). We keep the default export tiny and
  // delegate the actual UI to a named component below for easier navigation.
  return <DashboardHome />
}

import Link from "next/link"
import {
  BellIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  ExternalLinkIcon,
  TrendingUpIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

// Orbit-specific building blocks.
import { OrbitAppSidebar } from "@/components/orbit/app-sidebar"
import { ActivityOverviewChart } from "@/components/orbit/charts/activity-overview-chart"
import { IssuesByStatusDonut } from "@/components/orbit/charts/issues-by-status-donut"
import { IssuePriorityBadge, IssueStatusBadge } from "@/components/orbit/issues/issue-badges"

// Shared UI primitives from shadcn/ui (Base UI flavor).
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type Issue = {
  id: string
  title: string
  assignee?: string
  priority: "low" | "medium" | "high"
  status: "todo" | "in_progress" | "in_review" | "done"
}

// Placeholder data until we connect a real backend (DB + API).
const openTickets: Issue[] = [
  {
    id: "ENG-123",
    title: "Implement user authentication flow",
    assignee: "Sarah Chen",
    priority: "high",
    status: "in_progress",
  },
  {
    id: "ENG-124",
    title: "Fix navigation bug on mobile",
    assignee: "Alex Johnson",
    priority: "medium",
    status: "todo",
  },
  {
    id: "ENG-125",
    title: "Update dashboard analytics",
    assignee: "Morgan Lee",
    priority: "low",
    status: "in_review",
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
    <Card className="ring-1 ring-foreground/10">
      <CardContent className="px-7 pt-3 pb-1">
        {/* Icon badge (top-left), matches the reference. */}
        <div className="mb-5">
          <div className="inline-flex size-10 items-center justify-center rounded-lg bg-muted text-primary">
            <Icon className="size-5" />
          </div>
        </div>

        {/* Title + value */}
        <div className="space-y-2">
          <CardDescription className="text-sm">{title}</CardDescription>
          <CardTitle className="text-4xl font-bold tracking-tight">{value}</CardTitle>
        </div>

        {/* Bottom area: trend vs last month. Colors come from semantic CSS tokens (no hardcoded hex). */}
        <div className="mt-4 text-sm text-muted-foreground">
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
          vs last month
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardHome() {
  return (
    // SidebarProvider manages open/collapsed state and makes SidebarTrigger work.
    <SidebarProvider defaultOpen>
      <OrbitAppSidebar />

      <SidebarInset>
        {/* Top bar: page title + notifications + user menu. */}
        <header className="flex h-16 items-center gap-3 border-b bg-card px-8">
          {/* Page title (kept prominent and left-aligned like the reference). */}
          <div className="text-lg font-semibold">Dashboard</div>
          <div className="ml-auto flex items-center gap-2">
            {/* Notifications button with a token-driven unread badge. */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="relative"
            >
              <span className="relative">
                <BellIcon className="size-5" />
                <span
                  className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary ring-2 ring-card"
                  aria-hidden="true"
                />
              </span>
            </Button>

            <DropdownMenu>
              {/* Base UI uses `render` instead of `asChild` to swap the underlying element. */}
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="gap-3 px-3 py-2">
                    {/* User identity block (avatar + name). */}
                    <Avatar size="md" className="bg-primary text-primary-foreground">
                      <AvatarFallback className="bg-transparent text-primary-foreground font-semibold">
                        SC
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium md:inline">Sarah Chen</span>
                    <ChevronDownIcon className="hidden size-4 md:inline" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page padding + section spacing. */}
        <div className="flex flex-1 flex-col gap-8 py-8 px-16">
          {/* KPI row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              icon={TrendingUpIcon}
              title="Total Revenue"
              value="$45,231"
              delta="+20.1%"
              deltaDirection="up"
            />
            <KpiCard
              icon={UsersIcon}
              title="Active Users"
              value="2,345"
              delta="+15.3%"
              deltaDirection="up"
            />
            <KpiCard
              icon={CheckCircleIcon}
              title="Completed Tasks"
              value="1,234"
              delta="+8.2%"
              deltaDirection="up"
            />
            <KpiCard
              icon={ClockIcon}
              title="Avg. Response Time"
              value="2.4h"
              delta="-12.5%"
              deltaDirection="down"
            />
          </div>

          {/* Dashboard grid (matches reference layout) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_280px] lg:items-start">
            {/* Row 2 / Col 1 */}
            <Card className="ring-1 ring-foreground/10 lg:col-start-1">
              <CardHeader className="px-7 pt-3">
                <CardTitle className="text-lg font-semibold">Tasks by Status</CardTitle>
              </CardHeader>
              <CardContent className="px-7 pb-7">
                <IssuesByStatusDonut />
              </CardContent>
            </Card>

            {/* Row 2 / Col 2 */}
            <Card className="ring-1 ring-foreground/10 lg:col-start-2">
              <CardHeader className="px-7 pt-3">
                <CardTitle className="text-lg font-semibold">Activity Overview</CardTitle>
                <CardDescription>Total tasks completed over time</CardDescription>
              </CardHeader>
              <CardContent className="px-7 pb-7">
                <ActivityOverviewChart />
              </CardContent>
            </Card>

            {/* Right rail: row 2-3 / col 3 */}
            <div className="flex flex-col gap-6 lg:col-start-3 lg:row-span-2">
              <Card className="ring-1 ring-foreground/10">
                <CardHeader className="px-7 pt-3">
                  <CardTitle className="text-lg font-semibold">My Meetings</CardTitle>
                </CardHeader>
                <CardContent className="px-7 pb-7">
                  <div className="space-y-4">
                    {myMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">{meeting.title}</div>
                          <div className="mt-1 text-xs text-muted-foreground">{meeting.time}</div>
                        </div>
                        <div className="shrink-0 text-xs font-medium text-muted-foreground">
                          {meeting.provider}
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
                        className: "mt-3 h-auto px-0 py-1 font-semibold text-muted-foreground",
                      })
                    )}
                  >
                    See all meetings <ExternalLinkIcon className="size-4" />
                  </Link>
                </CardContent>
              </Card>

              <Card className="ring-1 ring-foreground/10">
                <CardHeader className="px-7 pt-3">
                  <CardTitle className="text-lg font-semibold">Open Tickets</CardTitle>
                </CardHeader>
                <CardContent className="px-7 pb-7">
                  <div className="space-y-4">
                    {openTickets.map((ticket) => (
                      <div key={ticket.id} className="rounded-xl border bg-card p-3">
                        <div className="flex items-start gap-3">
                          <Avatar size="sm" className="bg-muted text-foreground">
                            <AvatarFallback className="bg-transparent text-xs font-semibold">
                              {(ticket.assignee ?? "NA")
                                .split(" ")
                                .slice(0, 2)
                                .map((p) => p[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold">{ticket.assignee ?? "Unassigned"}</div>
                            <div className="mt-1 text-xs text-muted-foreground">{ticket.title}</div>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <IssueStatusBadge status={ticket.status} />
                              <IssuePriorityBadge priority={ticket.priority} showBackground />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Row 3 / Col 1-2 */}
            <Card className="ring-1 ring-foreground/10 lg:col-span-2">
              <CardHeader className="relative flex-row items-start justify-between space-y-0 px-7 pt-3">
                <div>
                  <CardTitle className="text-lg font-semibold">My Tasks</CardTitle>
                  <CardDescription>{myTasks.length} tasks</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" className="h-8">
                    Filter
                  </Button>
                  <Button size="sm" className="h-8">
                    + New Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-7 pb-7">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {myTasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted/30"
                    >
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">{task.id}</span>
                      </div>
                      <div className="mt-1 text-sm font-semibold">{task.title}</div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <IssueStatusBadge status={task.status} />
                        <IssuePriorityBadge priority={task.priority} showBackground />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
