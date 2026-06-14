"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import {
  ArrowDownWideNarrowIcon,
  ArrowUpNarrowWideIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from "lucide-react"

import {
  IssuePriorityBadge,
  IssueStatusBadge,
  issueStatusStripBackground,
} from "@/components/orbit/issues/issue-badges"
import { IssueDetailPanel } from "@/components/orbit/issues/issue-detail-panel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { isWorkItemStatus, type WorkItemStatus } from "@/lib/status"
import {
  CURRENT_USER,
  filterIssues,
  getAssignee,
  getProjectTitle,
  groupIssuesByStatus,
  isIssueOverdue,
  issueAssignees,
  issueProjects,
  issuesSeed,
  sortIssues,
  type Issue,
  type IssuePriority,
  type IssueSortKey,
  type IssueStatusFilter,
  type IssueTab,
  type SortDir,
} from "@/lib/issues-data"

const metaClass = "text-[13px] text-[#9aa3b2]"
const ANY = "__any__"

const tabs: { value: IssueTab; label: string }[] = [
  { value: "all", label: "All Issues" },
  { value: "active", label: "Active" },
  { value: "backlog", label: "Backlog" },
]

const statusOptions: { value: IssueStatusFilter; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "in_review", label: "In Review" },
  { value: "completed", label: "Completed" },
  { value: "overdue", label: "Overdue" },
]

const priorityOptions: { value: IssuePriority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

const sortOptions: { value: IssueSortKey; label: string }[] = [
  { value: "priority", label: "Priority" },
  { value: "due", label: "Due date" },
  { value: "created", label: "Created" },
  { value: "title", label: "Title" },
]

const statusLabel = (value: IssueStatusFilter) =>
  statusOptions.find((o) => o.value === value)?.label ?? value
const priorityLabel = (value: IssuePriority) =>
  priorityOptions.find((o) => o.value === value)?.label ?? value
const sortLabel = (value: IssueSortKey) =>
  sortOptions.find((o) => o.value === value)?.label ?? value

type Filters = {
  search: string
  status: IssueStatusFilter | null
  priority: IssuePriority | null
  assigneeId: string | null
  projectSlug: string | null
}

const emptyFilters: Filters = {
  search: "",
  status: null,
  priority: null,
  assigneeId: null,
  projectSlug: null,
}

function memberInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
}

function FilterMenu({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string | null
  options: { value: string; label: string }[]
  onChange: (value: string | null) => void
}) {
  const current = options.find((o) => o.value === value)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-9 gap-1.5 border-border/80 bg-card px-3 font-normal shadow-none",
              current && "border-primary/40 text-foreground"
            )}
          >
            <span className="text-muted-foreground">{label}:</span>
            <span>{current ? current.label : "Any"}</span>
            <ChevronDownIcon className="size-4 opacity-60" strokeWidth={2} />
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="min-w-[12rem]">
        <DropdownMenuRadioGroup
          value={value ?? ANY}
          onValueChange={(v) => onChange(v === ANY ? null : v)}
        >
          <DropdownMenuRadioItem value={ANY}>Any {label.toLowerCase()}</DropdownMenuRadioItem>
          {options.map((o) => (
            <DropdownMenuRadioItem key={o.value} value={o.value}>
              {o.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AssigneeMenu({
  value,
  onChange,
}: {
  value: string | null
  onChange: (value: string | null) => void
}) {
  const current = value ? getAssignee(value) : undefined
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-9 gap-1.5 border-border/80 bg-card px-3 font-normal shadow-none",
              current && "border-primary/40 text-foreground"
            )}
          >
            <span className="text-muted-foreground">Assignee:</span>
            {current ? (
              <span className="inline-flex items-center gap-1.5">
                <Avatar className="size-5 ring-0" title={current.name}>
                  <AvatarImage src={current.avatarUrl} alt="" />
                  <AvatarFallback className="text-[9px] font-semibold">
                    {memberInitials(current.name)}
                  </AvatarFallback>
                </Avatar>
                {current.id === CURRENT_USER.id ? "Me" : current.name}
              </span>
            ) : (
              <span>Anyone</span>
            )}
            <ChevronDownIcon className="size-4 opacity-60" strokeWidth={2} />
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="min-w-[13rem]">
        <DropdownMenuRadioGroup
          value={value ?? ANY}
          onValueChange={(v) => onChange(v === ANY ? null : v)}
        >
          <DropdownMenuRadioItem value={ANY}>Anyone</DropdownMenuRadioItem>
          {issueAssignees.map((member) => (
            <DropdownMenuRadioItem key={member.id} value={member.id}>
              <span className="inline-flex items-center gap-2">
                <Avatar className="size-5 ring-0" title={member.name}>
                  <AvatarImage src={member.avatarUrl} alt="" />
                  <AvatarFallback className="text-[9px] font-semibold">
                    {memberInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                {member.id === CURRENT_USER.id ? `${member.name} (Me)` : member.name}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-primary/20"
    >
      {label}
      <XIcon className="size-3.5 shrink-0 opacity-70" strokeWidth={2.25} />
    </button>
  )
}

function IssueRow({
  issue,
  selected,
  onSelect,
}: {
  issue: Issue
  selected: boolean
  onSelect: () => void
}) {
  const overdue = isIssueOverdue(issue)
  const assignee = getAssignee(issue.assigneeId)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      aria-pressed={selected}
      className={cn(
        "flex cursor-pointer overflow-hidden rounded-xl border bg-card transition-colors hover:bg-muted/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        selected ? "border-primary/50 ring-1 ring-primary/30" : "border-foreground/10"
      )}
    >
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
  selectedId,
  onSelectIssue,
}: {
  status: WorkItemStatus
  issues: Issue[]
  collapsed: boolean
  onToggle: () => void
  selectedId: string | null
  onSelectIssue: (id: string) => void
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
            <IssueRow
              key={issue.id}
              issue={issue}
              selected={issue.id === selectedId}
              onSelect={() => onSelectIssue(issue.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export function IssuesView() {
  const searchParams = useSearchParams()
  const [issues, setIssues] = React.useState<Issue[]>(issuesSeed)
  const [selectedIssueId, setSelectedIssueId] = React.useState<string | null>(null)
  const [tab, setTab] = React.useState<IssueTab>("all")
  const [filters, setFilters] = React.useState<Filters>(emptyFilters)
  const [sortKey, setSortKey] = React.useState<IssueSortKey>("priority")
  const [sortDir, setSortDir] = React.useState<SortDir>("asc")
  const [collapsed, setCollapsed] = React.useState<Set<WorkItemStatus>>(new Set())

  // Apply filters arriving from dashboard KPI cards / deep links.
  React.useEffect(() => {
    const next: Partial<Filters> = {}

    const status = searchParams.get("status")
    if (status && (isWorkItemStatus(status) || status === "overdue")) {
      next.status = status as IssueStatusFilter
    }

    const assignee = searchParams.get("assignee")
    if (assignee === "me") next.assigneeId = CURRENT_USER.id
    else if (assignee && getAssignee(assignee)) next.assigneeId = assignee

    const project = searchParams.get("project")
    if (project && issueProjects.some((p) => p.slug === project)) {
      next.projectSlug = project
    }

    const priority = searchParams.get("priority")
    if (priority === "high" || priority === "medium" || priority === "low") {
      next.priority = priority
    }

    if (Object.keys(next).length > 0) {
      setFilters((prev) => ({ ...prev, ...next }))
    }
  }, [searchParams])

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
    const filtered = filterIssues(issues, {
      tab,
      status: filters.status ?? undefined,
      priority: filters.priority ?? undefined,
      assigneeId: filters.assigneeId ?? undefined,
      projectSlug: filters.projectSlug ?? undefined,
      search: filters.search,
    })
    return groupIssuesByStatus(filtered)
      .map((group) => ({
        ...group,
        issues: sortIssues(group.issues, sortKey, sortDir),
      }))
      .filter((group) => group.issues.length > 0)
  }, [issues, tab, filters, sortKey, sortDir])

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.status !== null ||
    filters.priority !== null ||
    filters.assigneeId !== null ||
    filters.projectSlug !== null

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }))

  const toggleGroup = (status: WorkItemStatus) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(status)) next.delete(status)
      else next.add(status)
      return next
    })
  }

  const updateIssue = React.useCallback((id: string, patch: Partial<Issue>) => {
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  }, [])

  const addComment = React.useCallback((id: string, body: string) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              comments: [
                ...i.comments,
                {
                  id: `c-${id}-${Date.now()}`,
                  authorId: CURRENT_USER.id,
                  body,
                  timeLabel: "Just now",
                },
              ],
            }
          : i
      )
    )
  }, [])

  const activeAssignee = filters.assigneeId ? getAssignee(filters.assigneeId) : undefined

  // Keep the last opened issue around during the panel's close animation.
  const selectedIssue = issues.find((i) => i.id === selectedIssueId) ?? null
  const lastIssueRef = React.useRef<Issue | null>(null)
  if (selectedIssue) lastIssueRef.current = selectedIssue
  const panelIssue = selectedIssue ?? lastIssueRef.current

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

      {/* Filter bar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
              aria-hidden
            />
            <Input
              type="search"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              placeholder="Search issues..."
              className="h-9 border-border/80 bg-card pl-9 shadow-none"
              aria-label="Search issues"
            />
          </div>

          <FilterMenu
            label="Status"
            value={filters.status}
            options={statusOptions}
            onChange={(v) => setFilter("status", v as IssueStatusFilter | null)}
          />
          <FilterMenu
            label="Priority"
            value={filters.priority}
            options={priorityOptions}
            onChange={(v) => setFilter("priority", v as IssuePriority | null)}
          />
          <AssigneeMenu
            value={filters.assigneeId}
            onChange={(v) => setFilter("assigneeId", v)}
          />
          <FilterMenu
            label="Project"
            value={filters.projectSlug}
            options={issueProjects.map((p) => ({ value: p.slug, label: p.title }))}
            onChange={(v) => setFilter("projectSlug", v)}
          />

          <div className="ml-auto flex items-center gap-1">
            <FilterMenu
              label="Sort"
              value={sortKey}
              options={sortOptions}
              onChange={(v) => {
                if (v) setSortKey(v as IssueSortKey)
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Sort direction: ${sortDir === "asc" ? "ascending" : "descending"}`}
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              className="size-9 shrink-0 border-border/80 bg-card text-foreground shadow-none"
            >
              {sortDir === "asc" ? (
                <ArrowUpNarrowWideIcon className="size-4" strokeWidth={1.75} />
              ) : (
                <ArrowDownWideNarrowIcon className="size-4" strokeWidth={1.75} />
              )}
            </Button>
          </div>
        </div>

        {hasActiveFilters ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtered by</span>
            {filters.status ? (
              <FilterChip
                label={statusLabel(filters.status)}
                onClear={() => setFilter("status", null)}
              />
            ) : null}
            {filters.priority ? (
              <FilterChip
                label={priorityLabel(filters.priority)}
                onClear={() => setFilter("priority", null)}
              />
            ) : null}
            {activeAssignee ? (
              <FilterChip
                label={
                  activeAssignee.id === CURRENT_USER.id
                    ? "Assigned to me"
                    : activeAssignee.name
                }
                onClear={() => setFilter("assigneeId", null)}
              />
            ) : null}
            {filters.projectSlug ? (
              <FilterChip
                label={getProjectTitle(filters.projectSlug)}
                onClear={() => setFilter("projectSlug", null)}
              />
            ) : null}
            {filters.search.trim() ? (
              <FilterChip
                label={`"${filters.search.trim()}"`}
                onClear={() => setFilter("search", "")}
              />
            ) : null}
            <button
              type="button"
              onClick={() => setFilters(emptyFilters)}
              className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </div>

      {groups.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/80 bg-card px-6 py-12 text-center text-sm text-muted-foreground">
          {hasActiveFilters
            ? "No issues match these filters."
            : "No issues in this view yet."}
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
              selectedId={selectedIssueId}
              onSelectIssue={setSelectedIssueId}
            />
          ))}
        </div>
      )}

      <IssueDetailPanel
        issue={panelIssue}
        open={selectedIssueId !== null}
        onClose={() => setSelectedIssueId(null)}
        onUpdate={(patch) => {
          if (selectedIssueId) updateIssue(selectedIssueId, patch)
        }}
        onAddComment={(body) => {
          if (selectedIssueId) addComment(selectedIssueId, body)
        }}
      />
    </div>
  )
}
