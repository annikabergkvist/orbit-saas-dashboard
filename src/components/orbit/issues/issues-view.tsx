"use client"

import * as React from "react"
import { CalendarIcon, ChevronRightIcon, PlusIcon } from "lucide-react"

import {
  IssuePriorityBadge,
  IssueStatusBadge,
  issueStatusStripBackground,
} from "@/components/orbit/issues/issue-badges"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { type WorkItemStatus } from "@/lib/status"
import {
  filterIssues,
  getAssignee,
  getProjectTitle,
  groupIssuesByStatus,
  isIssueOverdue,
  issuesSeed,
  type Issue,
  type IssueTab,
} from "@/lib/issues-data"

const metaClass = "text-[13px] text-[#9aa3b2]"

const tabs: { value: IssueTab; label: string }[] = [
  { value: "all", label: "All Issues" },
  { value: "active", label: "Active" },
  { value: "backlog", label: "Backlog" },
]

function memberInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
}

function IssueRow({ issue }: { issue: Issue }) {
  const overdue = isIssueOverdue(issue)
  const assignee = getAssignee(issue.assigneeId)

  return (
    <div className="flex overflow-hidden rounded-xl border border-foreground/10 bg-card transition-colors hover:bg-muted/30">
      <div
        className="w-1 shrink-0 self-stretch"
        style={{ backgroundColor: issueStatusStripBackground(issue.status) }}
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
          {issue.id}
        </span>
        <span className="min-w-[12rem] flex-1 truncate text-sm font-semibold text-foreground">
          {issue.title}
        </span>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <IssueStatusBadge status={issue.status} />
          {overdue ? <IssueStatusBadge status="overdue" /> : null}
          <IssuePriorityBadge priority={issue.priority} />
        </div>

        {assignee ? (
          <div className="flex shrink-0 items-center gap-2">
            <Avatar className="size-7 ring-0" title={assignee.name}>
              <AvatarImage src={assignee.avatarUrl} alt="" />
              <AvatarFallback className="text-[10px] font-semibold">
                {memberInitials(assignee.name)}
              </AvatarFallback>
            </Avatar>
            <span className={cn("hidden truncate sm:inline", metaClass)}>{assignee.name}</span>
          </div>
        ) : null}

        <span className={cn("hidden shrink-0 md:inline", metaClass)}>
          {getProjectTitle(issue.projectSlug)}
        </span>

        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5",
            overdue ? "font-medium text-[var(--status-overdue-foreground)]" : metaClass
          )}
        >
          <CalendarIcon className="size-3.5 shrink-0" strokeWidth={1.75} />
          {issue.dueLabel}
        </span>

        <span className={cn("hidden shrink-0 lg:inline", metaClass)}>
          Created {issue.createdLabel}
        </span>
      </div>
    </div>
  )
}

function StatusGroup({
  status,
  issues,
  collapsed,
  onToggle,
}: {
  status: WorkItemStatus
  issues: Issue[]
  collapsed: boolean
  onToggle: () => void
}) {
  return (
    <section className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={!collapsed}
        className="flex w-fit items-center gap-2 rounded-md py-1 pr-2 text-left transition-colors hover:opacity-80"
      >
        <ChevronRightIcon
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            !collapsed && "rotate-90"
          )}
          strokeWidth={2}
        />
        <IssueStatusBadge status={status} />
        <span className="text-sm font-medium tabular-nums text-muted-foreground">
          {issues.length}
        </span>
      </button>

      {collapsed ? null : (
        <div className="flex flex-col gap-2">
          {issues.map((issue) => (
            <IssueRow key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </section>
  )
}

export function IssuesView() {
  const [issues] = React.useState<Issue[]>(issuesSeed)
  const [tab, setTab] = React.useState<IssueTab>("all")
  const [collapsed, setCollapsed] = React.useState<Set<WorkItemStatus>>(new Set())

  const tabCounts = React.useMemo(
    () => ({
      all: issues.length,
      active: issues.filter(
        (i) => i.status === "in_progress" || i.status === "in_review"
      ).length,
      backlog: issues.filter((i) => i.status === "todo").length,
    }),
    [issues]
  )

  const groups = React.useMemo(() => {
    const filtered = filterIssues(issues, { tab })
    return groupIssuesByStatus(filtered).filter((group) => group.issues.length > 0)
  }, [issues, tab])

  const toggleGroup = (status: WorkItemStatus) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(status)) next.delete(status)
      else next.add(status)
      return next
    })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 px-6 py-8 md:px-10 lg:px-16">
      <Tabs
        value={tab}
        onValueChange={(v) => {
          if (v === "all" || v === "active" || v === "backlog") setTab(v)
        }}
        className="gap-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList className="inline-flex h-auto w-fit gap-0.5 rounded-lg border border-border/50 bg-muted/50 p-1 shadow-none">
            {tabs.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="rounded-md px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors data-active:border data-active:border-border/60 data-active:bg-card data-active:text-foreground data-active:shadow-sm"
              >
                {t.label} ({tabCounts[t.value]})
              </TabsTrigger>
            ))}
          </TabsList>

          <Button type="button" className="h-9 shrink-0 gap-1.5 px-4">
            <PlusIcon className="size-4" strokeWidth={2} />
            New Issue
          </Button>
        </div>
      </Tabs>

      {groups.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/80 bg-card px-6 py-12 text-center text-sm text-muted-foreground">
          No issues in this view yet.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <StatusGroup
              key={group.status}
              status={group.status}
              issues={group.issues}
              collapsed={collapsed.has(group.status)}
              onToggle={() => toggleGroup(group.status)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
