"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  CalendarIcon,
  CheckCheckIcon,
  ChevronDownIcon,
  MessageCircleIcon,
  PaperclipIcon,
  PlusIcon,
  SearchIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"
import {
  CategoryTokenBadge,
  IssuePriorityBadge,
} from "@/components/orbit/issues/issue-badges"
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NewProjectDialog } from "@/components/orbit/projects/new-project-dialog"
import {
  getCurrentUser,
  loadPersistedProjects,
  savePersistedProjects,
  subscribeStore,
} from "@/lib/client-store"
import { getInitials, metaTextClass } from "@/lib/format"
import { cn } from "@/lib/utils"
import { isProjectLifecycle, PROJECT_LIFECYCLE_LABELS } from "@/lib/status"
import {
  buildProjectFromValues,
  listProjects,
  projectSortOptions,
  projectsSeed,
  type NewProjectValues,
  type ProjectLifecycle,
  type ProjectSort,
  type ProjectSummary,
  type ProjectType,
} from "@/lib/projects-data"


const filterTabs: { value: "all" | ProjectLifecycle; label: string }[] = [
  { value: "all", label: "All" },
  ...(Object.entries(PROJECT_LIFECYCLE_LABELS) as [ProjectLifecycle, string][]).map(
    ([value, label]) => ({ value, label })
  ),
]

const sortOptions = projectSortOptions

function typeLabel(type: ProjectType): string {
  switch (type) {
    case "development":
      return "Development"
    case "design":
      return "Design"
    case "documentation":
      return "Documentation"
  }
}

function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group block rounded-xl outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
    >
      <Card glass="subtle" className="h-full gap-0 py-0">
        <CardHeader className="gap-2.5 px-4 pt-4 pb-0">
          <CardTitle className="text-lg font-semibold leading-snug tracking-tight text-foreground">
            {project.title}
          </CardTitle>
          <CardDescription className={cn("line-clamp-2 leading-relaxed", metaTextClass)}>
            {project.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3.5 px-4 pt-3 pb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <CategoryTokenBadge label={typeLabel(project.type)} />
              <IssuePriorityBadge priority={project.priority} />
            </div>
            <div className="flex shrink-0 -space-x-2">
              {project.team.map((member) => (
                <Avatar
                  key={member.id}
                  className="size-9 border-2 border-background ring-0"
                  title={member.name}
                >
                  <AvatarImage src={member.avatarUrl} alt="" />
                  <AvatarFallback className="text-[10px] font-semibold">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <div className={cn("flex items-center justify-between text-xs font-medium", metaTextClass)}>
              <span>Progress</span>
              <span className="tabular-nums">{project.progress}%</span>
            </div>
            <Progress
              value={project.progress}
              gradient
              className="h-1.5 bg-muted"
            />
          </div>
        </CardContent>

        <CardFooter
          className={cn(
            "gap-3 border-t border-foreground/10 bg-transparent px-4 py-3",
            metaTextClass
          )}
        >
          <span className="inline-flex items-center gap-1.5">
            <MessageCircleIcon className="size-3.5 shrink-0" strokeWidth={1.75} />
            <span className="tabular-nums">{project.comments}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <PaperclipIcon className="size-3.5 shrink-0" strokeWidth={1.75} />
            <span className="tabular-nums">{project.attachments}</span>
          </span>
          {project.lifecycle === "completed" ? (
            <span className="ml-auto inline-flex items-center gap-1.5 font-medium text-[var(--status-completed-foreground)]">
              <CheckCheckIcon className="size-3.5 shrink-0" strokeWidth={2.25} />
              <span className="line-through decoration-[var(--status-completed-foreground)]/70">
                {project.dueLabel}
              </span>
            </span>
          ) : project.lifecycle === "launched" ? (
            <span className="ml-auto font-medium text-[var(--status-launched-foreground)]">
              {project.dueLabel}
            </span>
          ) : (
            <span className="ml-auto inline-flex items-center gap-1.5">
              <CalendarIcon className="size-3.5 shrink-0" strokeWidth={1.75} />
              {project.dueLabel}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}

function ProjectGrid({
  projects,
  emptyMessage = "No projects in this view yet.",
}: {
  projects: ProjectSummary[]
  emptyMessage?: string
}) {
  if (projects.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border/80 bg-card px-6 py-12 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

const projectSortValues = new Set<ProjectSort>(projectSortOptions.map((o) => o.value))

export function ProjectsOverview() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [projects, setProjects] = React.useState(() => loadPersistedProjects(projectsSeed))
  const [tab, setTab] = React.useState<"all" | ProjectLifecycle>("all")
  const [search, setSearch] = React.useState("")
  const [sort, setSort] = React.useState<ProjectSort>("name-asc")
  const [attentionOnly, setAttentionOnly] = React.useState(false)
  const [newProjectOpen, setNewProjectOpen] = React.useState(false)

  React.useEffect(() => subscribeStore(() => setProjects(loadPersistedProjects(projectsSeed))), [])

  const persistProjects = React.useCallback((next: ProjectSummary[]) => {
    setProjects(next)
    savePersistedProjects(next)
  }, [])

  const createProject = React.useCallback(
    (values: NewProjectValues) => {
      const owner = getCurrentUser()
      const project = buildProjectFromValues(
        values,
        projects,
        {
          id: owner.id,
          name: owner.name,
          avatarUrl: owner.avatarUrl,
        }
      )
      const next = [project, ...projects]
      persistProjects(next)
      setNewProjectOpen(false)
      setTab("planning")
      setAttentionOnly(false)
      setSearch("")
      router.push(`/projects/${project.slug}`)
    },
    [persistProjects, projects, router]
  )

  const openNewProject = React.useCallback(() => {
    setNewProjectOpen(true)
  }, [])

  // Apply state arriving from the URL (deep links / KPI cards). Adjusting
  // state during render (guarded by a "did the params change" check) is the
  // React-sanctioned way to sync from an external source without an effect.
  const paramsKey = searchParams.toString()
  const [appliedParamsKey, setAppliedParamsKey] = React.useState<string | null>(null)
  if (paramsKey !== appliedParamsKey) {
    setAppliedParamsKey(paramsKey)

    if (searchParams.get("new") !== null) openNewProject()

    const tabParam = searchParams.get("tab")
    if (tabParam === "all") {
      setTab("all")
    } else if (tabParam && isProjectLifecycle(tabParam)) {
      setTab(tabParam)
    }

    const sortParam = searchParams.get("sort")
    if (sortParam && projectSortValues.has(sortParam as ProjectSort)) {
      setSort(sortParam as ProjectSort)
    }

    if (searchParams.get("filter") === "attention") {
      setAttentionOnly(true)
      setTab("all")
    }
  }

  React.useEffect(() => {
    if (searchParams.get("new") === null) return
    const params = new URLSearchParams(searchParams.toString())
    params.delete("new")
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [searchParams, router, pathname])

  const tabCounts = React.useMemo(() => {
    const counts: Record<"all" | ProjectLifecycle, number> = {
      all: projects.length,
      planning: 0,
      active: 0,
      in_review: 0,
      completed: 0,
      launched: 0,
    }
    for (const project of projects) {
      counts[project.lifecycle] += 1
    }
    return counts
  }, [projects])

  const filteredProjects = React.useMemo(
    () =>
      listProjects({
        lifecycle: tab,
        sort,
        search,
        needsAttention: attentionOnly,
        source: projects,
      }),
    [tab, search, sort, attentionOnly, projects]
  )

  const sortLabel = sortOptions.find((o) => o.value === sort)?.label ?? "Sort"

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 px-4 py-5 sm:gap-8 sm:px-6 sm:py-8 md:px-10 lg:px-16">
      <Tabs
        value={tab}
        onValueChange={(v) => {
          if (v === "all" || isProjectLifecycle(v)) {
            setTab(v)
            setAttentionOnly(false)
          }
        }}
        className="gap-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <TabsList className="flex h-auto w-full flex-wrap gap-0.5 overflow-visible rounded-lg border border-border/50 bg-muted/50 p-1 shadow-none group-data-horizontal/tabs:h-auto sm:w-fit sm:flex-nowrap">
            {filterTabs.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="h-auto min-h-8 min-w-0 flex-1 basis-[calc(33.333%-0.125rem)] rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors data-active:border data-active:border-border/60 data-active:bg-card data-active:text-foreground data-active:shadow-sm sm:flex-none sm:basis-auto sm:px-4 sm:text-sm"
              >
                <span className="truncate">
                  {t.label}
                  <span className="text-muted-foreground/80"> ({tabCounts[t.value]})</span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <Button
            type="button"
            onClick={openNewProject}
            className="h-10 w-full shrink-0 gap-1.5 px-4 sm:h-9 sm:w-auto"
          >
            <PlusIcon className="size-4" strokeWidth={2} />
            New Project
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1 sm:max-w-md">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
              aria-hidden
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects…"
              className="h-9 border-border/80 bg-card pl-9 shadow-none"
              aria-label="Search projects"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 shrink-0 gap-1.5 border-border/80 bg-card px-3 font-normal shadow-none"
                >
                  {sortLabel}
                  <ChevronDownIcon className="size-4 opacity-60" strokeWidth={2} />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="min-w-[12rem]">
              <DropdownMenuRadioGroup
                value={sort}
                onValueChange={(v) => {
                  if (
                    v === "name-asc" ||
                    v === "name-desc" ||
                    v === "progress-desc" ||
                    v === "progress-asc" ||
                    v === "priority-desc"
                  ) {
                    setSort(v)
                  }
                }}
              >
                {sortOptions.map((option) => (
                  <DropdownMenuRadioItem key={option.value} value={option.value}>
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <TabsContent value={tab} className="mt-0 flex flex-col gap-4 outline-none">
          {attentionOnly ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Filtered by</span>
              <button
                type="button"
                onClick={() => setAttentionOnly(false)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--status-overdue)]/40 bg-[var(--status-overdue)]/10 px-3 py-1 text-xs font-medium text-[var(--status-overdue-foreground)] transition-colors hover:bg-[var(--status-overdue)]/20"
              >
                <TriangleAlertIcon className="size-3.5 shrink-0" strokeWidth={2} />
                Needs attention
                <XIcon className="size-3.5 shrink-0 opacity-70" strokeWidth={2.25} />
              </button>
            </div>
          ) : null}
          <ProjectGrid
            projects={filteredProjects}
            emptyMessage={
              attentionOnly
                ? "Nothing needs attention right now."
                : search.trim()
                  ? "No projects match your search."
                  : "No projects in this view yet."
            }
          />
        </TabsContent>
      </Tabs>

      <NewProjectDialog
        open={newProjectOpen}
        onOpenChange={setNewProjectOpen}
        onCreate={createProject}
      />
    </div>
  )
}
