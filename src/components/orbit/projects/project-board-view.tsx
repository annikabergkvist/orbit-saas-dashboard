"use client"

import * as React from "react"
import Link from "next/link"
import {
  CalendarDaysIcon,
  ChevronDownIcon,
  ClockIcon,
  Columns3Icon,
  FilesIcon,
  ListIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react"

import { ClaritySliderLineIcon } from "@/components/icons/clarity-slider-line-icon"
import {
  ProjectCalendarView,
  ProjectFilesView,
  ProjectListView,
} from "@/components/orbit/projects/project-extra-views"
import { KanbanBoard } from "@/components/orbit/projects/project-kanban"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getInitials } from "@/lib/format"
import { cn } from "@/lib/utils"
import { loadBoardTasks, saveBoardTasks } from "@/lib/client-store"
import {
  getBoardForProject,
  type BoardTask,
  type ProjectBoard,
  type ProjectSummary,
} from "@/lib/projects-data"

type ProjectView = "overview" | "list" | "board" | "calendar" | "files"

const viewTabs: { value: ProjectView; label: string; icon: React.ElementType }[] = [
  { value: "overview", label: "Overview", icon: ClockIcon },
  { value: "list", label: "List", icon: ListIcon },
  { value: "board", label: "Board", icon: Columns3Icon },
  { value: "calendar", label: "Calendar", icon: CalendarDaysIcon },
  { value: "files", label: "Files", icon: FilesIcon },
]

function FilterChip({ label, value }: { label: string; value: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-9 w-full min-w-0 gap-2 rounded-lg border-border/80 bg-card px-3 font-normal text-foreground shadow-none sm:w-auto"
    >
      <span className="text-muted-foreground">{label}:</span>
      <span className="truncate">{value}</span>
      <ChevronDownIcon className="size-3.5 opacity-60" strokeWidth={2} />
    </Button>
  )
}

function ProjectOverviewPanel({ project }: { project: ProjectSummary }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Card className="gap-4 border-border/50 bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">About</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Due</span>
          <span className="text-sm font-medium">{project.dueLabel}</span>
        </div>
      </Card>
      <Card className="gap-4 border-border/50 bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Progress</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Overall</span>
            <span className="tabular-nums text-foreground">{project.progress}%</span>
          </div>
          <Progress value={project.progress} gradient className="h-2 bg-muted" />
        </div>
        <p className="text-xs text-muted-foreground">
          {project.comments} comments · {project.attachments} attachments
        </p>
      </Card>
    </div>
  )
}

function ProjectDetailHeader({
  board,
  visibleTeam,
  view,
  onViewChange,
  onShare,
  onNewTask,
}: {
  board: ProjectBoard
  visibleTeam: ProjectSummary["team"]
  view: ProjectView
  onViewChange: (view: ProjectView) => void
  onShare: () => void
  onNewTask: () => void
}) {
  const avatarRing = "border-2 border-[var(--dashboard-mesh-base)] dark:border-background"

  return (
    <header className="px-4 pb-5 sm:px-6 sm:pb-8 md:px-10 lg:px-16">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem]">
              {board.boardTitle}
            </h1>
            <div className="flex items-center pl-0.5">
              {visibleTeam.map((member, index) => {
                const isLast = index === visibleTeam.length - 1
                const showCountOverlay = isLast && board.extraTeamCount > 0

                return (
                  <div
                    key={member.id}
                    className={cn(
                      "relative shrink-0",
                      index > 0 && "-ml-2"
                    )}
                    style={{ zIndex: index + 1 }}
                  >
                    <Avatar
                      className={cn("size-14 ring-0 sm:size-16", avatarRing)}
                      title={member.name}
                    >
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                      <AvatarFallback className="text-sm font-semibold">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    {showCountOverlay ? (
                      <span
                        className={cn(
                          "absolute inset-0 z-10 flex items-center justify-center rounded-full",
                          "bg-muted/95 text-sm font-semibold text-muted-foreground",
                          avatarRing
                        )}
                        aria-label={`${board.extraTeamCount} more team members`}
                      >
                        +{board.extraTeamCount}
                      </span>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="h-10 flex-1 gap-2 rounded-lg border-border bg-card px-4 text-foreground shadow-none hover:bg-muted/40 sm:h-9 sm:flex-none"
              onClick={onShare}
            >
              <UsersIcon className="size-4" strokeWidth={1.75} />
              Share
            </Button>
            <Button type="button" className="h-10 flex-1 gap-1.5 rounded-lg px-4 sm:h-9 sm:flex-none" onClick={onNewTask}>
              New Task
              <PlusIcon className="size-4" strokeWidth={2} />
            </Button>
          </div>
        </div>

        <div className="border-b border-border">
          <Tabs
            value={view}
            onValueChange={(v) => {
              if (
                v === "overview" ||
                v === "list" ||
                v === "board" ||
                v === "calendar" ||
                v === "files"
              ) {
                onViewChange(v)
              }
            }}
          >
            <div className="max-w-full">
              <TabsList
                variant="line"
                className="flex h-auto w-full flex-wrap justify-start gap-0 overflow-visible rounded-none border-0 bg-transparent p-0 group-data-horizontal/tabs:h-auto sm:h-9 sm:w-fit sm:flex-nowrap sm:group-data-horizontal/tabs:h-9"
              >
              {viewTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={cn(
                      "h-9 min-h-9 min-w-0 flex-1 basis-[calc(33.333%-0.25rem)] gap-1.5 rounded-none px-2 py-0 text-xs font-medium text-muted-foreground transition-colors sm:flex-none sm:basis-auto sm:gap-2 sm:px-3.5 sm:text-sm",
                      "hover:text-foreground",
                      "group-data-horizontal/tabs:after:bottom-[-1px]",
                      "data-active:text-primary data-active:after:bg-primary data-active:after:h-0.5",
                      "[&_svg]:size-4 [&_svg]:shrink-0"
                    )}
                  >
                    <Icon className="hidden sm:block" strokeWidth={1.75} />
                    <span className="truncate">{tab.label}</span>
                  </TabsTrigger>
                )
              })}
              </TabsList>
            </div>
          </Tabs>
        </div>
      </div>
    </header>
  )
}

export function ProjectBoardView({ project }: { project: ProjectSummary }) {
  const board = React.useMemo(() => getBoardForProject(project), [project])
  const [view, setView] = React.useState<ProjectView>("board")
  const [tasks, setTasks] = React.useState<BoardTask[]>(() =>
    loadBoardTasks(project.slug, board.tasks)
  )
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false)
  const [shareNotice, setShareNotice] = React.useState<string | null>(null)

  // Reload persisted tasks when navigating to a different project (guarded,
  // adjust-state-during-render instead of an effect, per React's rules).
  const [loadedProjectSlug, setLoadedProjectSlug] = React.useState(project.slug)
  if (loadedProjectSlug !== project.slug) {
    setLoadedProjectSlug(project.slug)
    setTasks(loadBoardTasks(project.slug, board.tasks))
  }

  React.useEffect(() => {
    saveBoardTasks(project.slug, tasks)
  }, [project.slug, tasks])

  React.useEffect(() => {
    if (!shareNotice) return
    const timer = window.setTimeout(() => setShareNotice(null), 2500)
    return () => window.clearTimeout(timer)
  }, [shareNotice])

  const visibleTeam = project.team.slice(0, 4)

  function handleShare() {
    const url = `${window.location.origin}/projects/${project.slug}`
    void navigator.clipboard.writeText(url).then(() => {
      setShareNotice("Project link copied to clipboard.")
    })
  }

  function handleNewTask() {
    window.location.href = `/issues?new=1&project=${project.slug}`
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-8 md:px-10 lg:px-16">
        <Link
          href="/projects"
          className="w-fit text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Projects
        </Link>
        {shareNotice ? (
          <p className="mt-2 text-sm text-[var(--kpi-delta-up-foreground)]">{shareNotice}</p>
        ) : null}
      </div>

      <ProjectDetailHeader
        board={board}
        visibleTeam={visibleTeam}
        view={view}
        onViewChange={setView}
        onShare={handleShare}
        onNewTask={handleNewTask}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 pb-6 sm:px-6 md:px-10 lg:px-16">
        {view === "board" ? (
          <div className="hidden flex-wrap items-center gap-2 md:flex">
            <FilterChip label="Due Date" value="March 17 - 20" />
            <FilterChip label="Assignee" value="All" />
            <FilterChip label="Priority" value="All" />
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-9 gap-2 rounded-lg border-border/80 bg-card px-3 font-normal shadow-none",
                showAdvancedFilters && "border-primary/40 bg-primary/5"
              )}
              onClick={() => setShowAdvancedFilters((current) => !current)}
            >
              <ClaritySliderLineIcon className="size-4" />
              Advanced Filters
            </Button>
            {showAdvancedFilters ? (
              <p className="w-full text-xs text-muted-foreground">
                Filter by tag, sprint, and custom fields — demo UI; board data is unchanged.
              </p>
            ) : null}
          </div>
        ) : null}

        {view === "board" ? <KanbanBoard tasks={tasks} setTasks={setTasks} /> : null}
        {view === "overview" ? <ProjectOverviewPanel project={project} /> : null}
        {view === "list" ? (
          <ProjectListView projectSlug={project.slug} tasks={tasks} />
        ) : null}
        {view === "calendar" ? (
          <ProjectCalendarView projectSlug={project.slug} tasks={tasks} />
        ) : null}
        {view === "files" ? <ProjectFilesView tasks={tasks} /> : null}
      </div>
    </div>
  )
}
