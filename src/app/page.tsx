export default function Home() {
  // This is the entry route ("/"). We keep the default export tiny and
  // delegate the actual UI to a named component below for easier navigation.
  return <DashboardHome />
}

import Link from "next/link"
import { BellIcon, ChevronDownIcon, ExternalLinkIcon } from "lucide-react"

// Orbit-specific building blocks.
import { OrbitAppSidebar } from "@/components/orbit/app-sidebar"
import { ActivityOverviewChart } from "@/components/orbit/charts/activity-overview-chart"
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
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

type Issue = {
  id: string
  title: string
  priority: "low" | "medium" | "high"
  status: "todo" | "in_progress" | "in_review" | "done"
}

// Placeholder data until we connect a real backend (DB + API).
const recentIssues: Issue[] = [
  {
    id: "ENG-123",
    title: "Implement user authentication flow",
    priority: "high",
    status: "in_progress",
  },
  {
    id: "ENG-124",
    title: "Fix navigation bug on mobile",
    priority: "medium",
    status: "todo",
  },
  {
    id: "ENG-125",
    title: "Update dashboard analytics",
    priority: "low",
    status: "in_review",
  },
  {
    id: "ENG-126",
    title: "Optimize database queries",
    priority: "high",
    status: "done",
  },
]

const myIssues: Issue[] = [
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

function KpiCard({
  title,
  value,
  delta,
  deltaDirection,
}: {
  title: string
  value: string
  delta: string
  deltaDirection: "up" | "down"
}) {
  return (
    <Card className="ring-1 ring-foreground/10">
      {/* Top area: label + headline number. */}
      <CardHeader className="gap-0">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="mt-1 text-2xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Bottom area: trend vs last month. Colors come from semantic CSS tokens (no hardcoded hex). */}
        <div className="text-xs text-muted-foreground">
          <span
            className={
              deltaDirection === "up"
                ? "text-[color:var(--status-done-foreground)]"
                : "text-[color:var(--priority-high-foreground)]"
            }
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
        <header className="flex h-14 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="text-sm font-semibold">Dashboard</div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon-sm" aria-label="Notifications">
              <BellIcon />
            </Button>

            <DropdownMenu>
              {/* Base UI uses `render` instead of `asChild` to swap the underlying element. */}
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="gap-2">
                    <Avatar size="sm">
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium md:inline">Sarah Chen</span>
                    <ChevronDownIcon className="hidden md:inline" />
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

        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* KPI row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Total Revenue"
              value="$45,231"
              delta="+20.1%"
              deltaDirection="up"
            />
            <KpiCard
              title="Active Users"
              value="2,345"
              delta="+15.3%"
              deltaDirection="up"
            />
            <KpiCard
              title="Completed Tasks"
              value="1,234"
              delta="+8.2%"
              deltaDirection="up"
            />
            <KpiCard
              title="Avg. Response Time"
              value="2.4h"
              delta="-12.5%"
              deltaDirection="down"
            />
          </div>

          {/* Main row: activity chart + recent issues list */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2 ring-1 ring-foreground/10">
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
                <CardDescription>Total tasks completed over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityOverviewChart />
              </CardContent>
            </Card>

            <Card className="ring-1 ring-foreground/10">
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                  <CardTitle>Recent Issues</CardTitle>
                </div>
                {/* For links we use a real <a> and reuse button styles via `buttonVariants`. */}
                <Link
                  href="/issues"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "gap-1 text-muted-foreground",
                  })}
                >
                  View all <ExternalLinkIcon className="size-4" />
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentIssues.map((issue) => (
                  <div key={issue.id} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">{issue.id}</span>
                      <IssuePriorityBadge priority={issue.priority} />
                    </div>
                    <div className="text-sm font-medium">{issue.title}</div>
                    <IssueStatusBadge status={issue.status} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Bottom row: status donut + "My Issues" list */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="ring-1 ring-foreground/10">
              <CardHeader>
                <CardTitle>Issues by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
                  Donut chart (next screenshot)
                </div>
              </CardContent>
            </Card>

            <Card className="ring-1 ring-foreground/10">
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <CardTitle>My Issues</CardTitle>
                <Link
                  href="/issues"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "gap-1 text-muted-foreground",
                  })}
                >
                  View all <ExternalLinkIcon className="size-4" />
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {myIssues.map((issue) => (
                  <div key={issue.id} className="rounded-lg border p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">{issue.id}</span>
                    </div>
                    <div className="mt-1 text-sm font-medium">{issue.title}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <IssueStatusBadge status={issue.status} />
                      <IssuePriorityBadge priority={issue.priority} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
