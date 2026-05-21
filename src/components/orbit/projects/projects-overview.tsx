"use client"

import * as React from "react"
import Link from "next/link"
import {
  CalendarIcon,
  CheckCheckIcon,
  ChevronDownIcon,
  MessageCircleIcon,
  PaperclipIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"
import {
  CategoryTokenBadge,
  IssuePriorityBadge,
  type IssueStatus,
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
import { cn } from "@/lib/utils"
import {
  projectsSeed,
  type ProjectLifecycle,
  type ProjectSummary,
  type ProjectType,
} from "@/lib/projects-data"

type ProjectSort = "name-asc" | "name-desc" | "progress-desc" | "progress-asc" | "priority-desc"

const filterTabs: { value: "all" | ProjectLifecycle; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "planning", label: "Planning" },
  { value: "completed", label: "Completed" },
]

const sortOptions: { value: ProjectSort; label: string }[] = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "progress-desc", label: "Progress (high to low)" },
  { value: "progress-asc", label: "Progress (low to high)" },
  { value: "priority-desc", label: "Priority (high first)" },
]

const priorityOrder = { high: 0, medium: 1, low: 2 } as const

function sortProjects(projects: ProjectSummary[], sort: ProjectSort): ProjectSummary[] {
  const list = [...projects]
  switch (sort) {
    case "name-asc":
      return list.sort((a, b) => a.title.localeCompare(b.title))
    case "name-desc":
      return list.sort((a, b) => b.title.localeCompare(a.title))
    case "progress-desc":
      return list.sort((a, b) => b.progress - a.progress)
    case "progress-asc":
      return list.sort((a, b) => a.progress - b.progress)
    case "priority-desc":
      return list.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      )
  }
}

const metaClass = "text-[13px] text-[#9aa3b2]"

const projectTypeStatus: Record<ProjectType, IssueStatus> = {
  development: "in_review",
  design: "in_progress",
  documentation: "done",
}

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

function memberInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
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
      <Card className="h-full gap-0 rounded-xl border border-border/50 bg-card py-0 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] group-hover:border-border/80 group-hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
        <CardHeader className="gap-2.5 px-4 pt-4 pb-0">
          <CardTitle className="text-lg font-semibold leading-snug tracking-tight text-foreground">
            {project.title}
          </CardTitle>
          <CardDescription className={cn("line-clamp-2 leading-relaxed", metaClass)}>
            {project.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3.5 px-4 pt-3 pb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <CategoryTokenBadge
                label={typeLabel(project.type)}
                status={projectTypeStatus[project.type]}
              />
              <IssuePriorityBadge priority={project.priority} showBackground />
            </div>
            <div className="flex shrink-0 -space-x-2">
              {project.team.map((member) => (
                <Avatar
                  key={member.id}
                  className="size-9 border-2 border-card ring-0"
                  title={member.name}
                >
                  <AvatarImage src={member.avatarUrl} alt="" />
                  <AvatarFallback className="text-[10px] font-semibold">
                    {memberInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <div className={cn("flex items-center justify-between text-xs font-medium", metaClass)}>
              <span>Progress</span>
              <span className="tabular-nums">{project.progress}%</span>
            </div>
            <Progress
              value={project.progress}
              gradient
              className="h-1.5 bg-[#e8ebf0]"
            />
          </div>
        </CardContent>

        <CardFooter
          className={cn(
            "gap-3 border-t border-[#e8ebf0] bg-card px-4 py-3",
            metaClass
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
            <span className="ml-auto inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCheckIcon className="size-3.5 shrink-0" strokeWidth={2.25} />
              <span className="line-through decoration-emerald-600/70 dark:decoration-emerald-400/70">
                {project.dueLabel}
              </span>
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

export function ProjectsOverview() {
  const [tab, setTab] = React.useState<"all" | ProjectLifecycle>("all")
  const [search, setSearch] = React.useState("")
  const [sort, setSort] = React.useState<ProjectSort>("name-asc")

  const tabCounts = React.useMemo(
    () => ({
      all: projectsSeed.length,
      active: projectsSeed.filter((p) => p.lifecycle === "active").length,
      planning: projectsSeed.filter((p) => p.lifecycle === "planning").length,
      completed: projectsSeed.filter((p) => p.lifecycle === "completed").length,
    }),
    []
  )

  const filteredProjects = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    let list =
      tab === "all" ? projectsSeed : projectsSeed.filter((p) => p.lifecycle === tab)

    if (query) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
    }

    return sortProjects(list, sort)
  }, [tab, search, sort])

  const sortLabel = sortOptions.find((o) => o.value === sort)?.label ?? "Sort"

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-8 bg-[#f6f7f9] px-6 py-8 md:px-10 lg:px-16 dark:bg-background">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem]">
          Projects
        </h1>
        <Button type="button" className="h-9 shrink-0 gap-1.5 self-start px-4 sm:self-auto">
          <PlusIcon className="size-4" strokeWidth={2} />
          New Project
        </Button>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => {
          if (v === "all" || v === "active" || v === "planning" || v === "completed") {
            setTab(v)
          }
        }}
        className="gap-8"
      >
        <TabsList className="inline-flex h-auto w-fit gap-0.5 rounded-lg border border-border/50 bg-muted/50 p-1 shadow-none">
          {filterTabs.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="rounded-md px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors data-active:border data-active:border-border/60 data-active:bg-card data-active:text-foreground data-active:shadow-sm"
            >
              {t.label} ({tabCounts[t.value]})
            </TabsTrigger>
          ))}
        </TabsList>

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

        <TabsContent value={tab} className="mt-0 outline-none">
          <ProjectGrid
            projects={filteredProjects}
            emptyMessage={
              search.trim()
                ? "No projects match your search."
                : "No projects in this view yet."
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
