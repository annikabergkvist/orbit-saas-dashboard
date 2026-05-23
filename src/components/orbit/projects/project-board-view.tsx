"use client"

import * as React from "react"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Image from "next/image"
import Link from "next/link"
import {
  CalendarDaysIcon,
  CalendarIcon,
  CheckCheckIcon,
  ChevronDownIcon,
  ClockIcon,
  Columns3Icon,
  FilesIcon,
  ListIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  PaperclipIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react"

import { ClaritySliderLineIcon } from "@/components/icons/clarity-slider-line-icon"
import {
  IssuePriorityBadge,
  IssueStatusBadge,
  TaskTagBadge,
  issueStatusStripBackground,
} from "@/components/orbit/issues/issue-badges"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  boardColumns,
  getBoardForProject,
  type BoardColumnId,
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

const metaClass = "text-[13px] text-[#9aa3b2]"

function memberInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
}

function FilterChip({ label, value }: { label: string; value: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-9 gap-2 rounded-lg border-border/80 bg-card px-3 font-normal text-foreground shadow-none"
    >
      <span className="text-muted-foreground">{label}:</span>
      <span>{value}</span>
      <ChevronDownIcon className="size-3.5 opacity-60" strokeWidth={2} />
    </Button>
  )
}

function groupTasksByColumn(tasks: BoardTask[]): Record<BoardColumnId, BoardTask[]> {
  const map: Record<BoardColumnId, BoardTask[]> = {
    pending: [],
    in_progress: [],
    completed: [],
    launched: [],
  }
  for (const task of tasks) {
    map[task.column].push(task)
  }
  return map
}

function flattenTasks(map: Record<BoardColumnId, BoardTask[]>): BoardTask[] {
  return boardColumns.flatMap((col) => map[col.id])
}

function isColumnId(id: string): id is BoardColumnId {
  return boardColumns.some((col) => col.id === id)
}

function applyTaskToColumn(task: BoardTask, column: BoardColumnId): BoardTask {
  const next: BoardTask = { ...task, column }
  if (column === "completed") {
    return { ...next, done: true }
  }
  const cleared: BoardTask = { ...next, done: false }
  if (column === "in_progress" && cleared.progress === undefined) {
    return { ...cleared, progress: 0 }
  }
  return cleared
}

function BoardTaskCard({
  task,
  className,
}: {
  task: BoardTask
  className?: string
}) {
  const launchWhen = task.launchDateTime ?? task.dueLabel
  const showLaunchMeta = task.column === "launched" && Boolean(launchWhen)

  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden rounded-xl border border-border/50 bg-card py-0 shadow-[0_2px_8px_rgba(15,23,42,0.08)]",
        task.done && "flex",
        className
      )}
    >
      {task.done ? (
        <div
          className="w-1 shrink-0 self-stretch"
          style={{ backgroundColor: issueStatusStripBackground("done") }}
          aria-hidden
        />
      ) : null}
      <div className="min-w-0 flex-1">
      <div className="space-y-3 p-4">
        <div className="space-y-1.5">
          <h3
            className={cn(
              "text-lg font-semibold leading-snug tracking-tight",
              task.done
                ? "text-[#9aa3b2] line-through decoration-[#949ca6] decoration-1"
                : "text-foreground"
            )}
          >
            {task.title}
          </h3>
          {task.description ? (
            <p className={cn("text-[13px] leading-relaxed", metaClass)}>{task.description}</p>
          ) : null}
        </div>

        {task.images && task.images.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {task.images.map((src) => (
              <div
                key={src}
                className="relative aspect-[5/3] overflow-hidden rounded-lg border border-border/40 bg-muted"
              >
                <Image src={src} alt="" fill sizes="120px" className="object-cover" unoptimized />
              </div>
            ))}
          </div>
        ) : null}

        {showLaunchMeta ? (
          <div className={cn("inline-flex items-center gap-2", metaClass)}>
            <CalendarIcon className="size-4 shrink-0" strokeWidth={1.75} />
            <span>{launchWhen}</span>
          </div>
        ) : null}

        {(task.tags?.length ?? 0) > 0 || task.priority || task.assignees.length > 0 || task.done ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {task.done ? <IssueStatusBadge status="done" /> : null}
              {task.tags?.map((tag) => (
                <TaskTagBadge key={tag} tag={tag} />
              ))}
              {task.priority ? (
                <IssuePriorityBadge priority={task.priority} showBackground />
              ) : null}
            </div>
            {task.assignees.length > 0 ? (
              <div className="flex shrink-0 -space-x-2">
                {task.assignees.map((member) => (
                  <Avatar
                    key={member.id}
                    className="size-9 border-2 border-card"
                    title={member.name}
                  >
                    <AvatarImage src={member.avatarUrl} alt="" />
                    <AvatarFallback className="text-[10px] font-semibold">
                      {memberInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {task.column === "in_progress" || task.progress !== undefined ? (
          <div className="space-y-1.5">
            <div className={cn("flex items-center justify-between text-xs font-medium", metaClass)}>
              <span>Progress</span>
              <span className="tabular-nums">{task.progress ?? 0}%</span>
            </div>
            <Progress value={task.progress ?? 0} gradient className="h-1.5 bg-[#e8ebf0]" />
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "flex items-center gap-3 border-t border-[#e8ebf0] px-4 py-3",
          metaClass
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          <MessageCircleIcon className="size-3.5" strokeWidth={1.75} />
          <span className="tabular-nums">{task.comments}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <PaperclipIcon className="size-3.5" strokeWidth={1.75} />
          <span className="tabular-nums">{task.attachments}</span>
        </span>
        {task.done ? (
          <span className="ml-auto inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCheckIcon className="size-3.5 shrink-0" strokeWidth={2.25} />
            <span>Completed</span>
          </span>
        ) : task.column === "launched" ? (
          <span className="ml-auto font-medium text-muted-foreground">Launched</span>
        ) : (
          <span className="ml-auto inline-flex items-center gap-1.5">
            <CalendarIcon className="size-3.5" strokeWidth={1.75} />
            {task.dueLabel}
          </span>
        )}
      </div>
      </div>
    </Card>
  )
}

function SortableTaskCard({ task }: { task: BoardTask }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn("touch-none", isDragging && "opacity-40")}
      {...attributes}
      {...listeners}
    >
      <BoardTaskCard
        task={task}
        className={cn(
          "cursor-grab active:cursor-grabbing",
          isDragging && "ring-2 ring-primary/25"
        )}
      />
    </div>
  )
}

function KanbanColumn({
  col,
  tasks,
}: {
  col: (typeof boardColumns)[number]
  tasks: BoardTask[]
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id })
  const taskIds = tasks.map((task) => task.id)

  return (
    <section className="flex w-[min(100%,280px)] shrink-0 flex-col">
      <div
        className={cn(
          "flex flex-col gap-3 rounded-lg bg-[#f1f2f5] px-2.5 pt-2 pb-2.5 transition-shadow dark:bg-muted/40",
          isOver && "ring-2 ring-primary/20"
        )}
      >
        <header className="flex items-center gap-2">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
              col.headerClass
            )}
          >
            <span className={cn("size-2 shrink-0 rounded-full", col.dotClass)} aria-hidden />
            {col.label}
          </div>
          <div className="ml-auto flex items-center gap-0.5">
            <button
              type="button"
              className="rounded-md p-1 text-[#9aa3b2] transition-colors hover:bg-muted hover:text-foreground"
              aria-label={`${col.label} column menu`}
            >
              <MoreHorizontalIcon className="size-4" />
            </button>
            <button
              type="button"
              className="rounded-md p-1 text-[#9aa3b2] transition-colors hover:bg-muted hover:text-foreground"
              aria-label={`Add task to ${col.label}`}
            >
              <PlusIcon className="size-4" />
            </button>
          </div>
        </header>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div ref={setNodeRef} className="flex min-h-[120px] flex-col gap-5">
            {tasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </div>
    </section>
  )
}

function KanbanBoard({ board }: { board: ProjectBoard }) {
  const [tasks, setTasks] = React.useState(board.tasks)
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const tasksByColumn = React.useMemo(() => groupTasksByColumn(tasks), [tasks])
  const activeTask = activeId ? tasks.find((task) => task.id === activeId) : null

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const findContainer = React.useCallback(
    (id: string) => {
      if (isColumnId(id)) return id
      const task = tasks.find((t) => t.id === id)
      return task?.column
    },
    [tasks]
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const activeContainer = findContainer(String(active.id))
    const overContainer = findContainer(String(over.id))
    if (!activeContainer || !overContainer) return

    if (activeContainer === overContainer) {
      const columnTasks = tasksByColumn[activeContainer]
      const oldIndex = columnTasks.findIndex((t) => t.id === active.id)
      const newIndex = columnTasks.findIndex((t) => t.id === over.id)
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

      setTasks((prev) => {
        const grouped = groupTasksByColumn(prev)
        grouped[activeContainer] = arrayMove(grouped[activeContainer], oldIndex, newIndex)
        return flattenTasks(grouped)
      })
      return
    }

    setTasks((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === active.id)
      if (activeIndex === -1) return prev

      const movedTask = applyTaskToColumn(prev[activeIndex], overContainer)
      const remaining = prev.filter((t) => t.id !== active.id)
      const grouped = groupTasksByColumn(remaining)
      const targetList = grouped[overContainer]

      if (isColumnId(String(over.id))) {
        grouped[overContainer] = [...targetList, movedTask]
      } else {
        const overIndex = targetList.findIndex((t) => t.id === over.id)
        if (overIndex === -1) {
          grouped[overContainer] = [...targetList, movedTask]
        } else {
          grouped[overContainer] = [
            ...targetList.slice(0, overIndex),
            movedTask,
            ...targetList.slice(overIndex),
          ]
        }
      }

      return flattenTasks(grouped)
    })
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex min-h-0 flex-1 items-start gap-8 overflow-x-auto pb-2">
        {boardColumns.map((col) => (
          <KanbanColumn key={col.id} col={col} tasks={tasksByColumn[col.id]} />
        ))}
      </div>
      <DragOverlay dropAnimation={{ duration: 180, easing: "ease-out" }}>
        {activeTask ? (
          <div className="w-[min(100%,280px)] cursor-grabbing">
            <BoardTaskCard
              task={activeTask}
              className="shadow-[0_8px_24px_rgba(15,23,42,0.14)] ring-2 ring-primary/20"
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function PlaceholderPanel({ title }: { title: string }) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border/80 bg-card px-6 py-16">
      <p className="text-center text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{title}</span> view is coming soon.
      </p>
    </div>
  )
}

function ProjectOverviewPanel({ project }: { project: ProjectSummary }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
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
          <Progress value={project.progress} gradient className="h-2 bg-[#e8ebf0]" />
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
}: {
  board: ProjectBoard
  visibleTeam: ProjectSummary["team"]
  view: ProjectView
  onViewChange: (view: ProjectView) => void
}) {
  const avatarRing = "border-2 border-[var(--dashboard-mesh-base)] dark:border-background"

  return (
    <header className="px-6 pb-8 md:px-10 lg:px-16">
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
                      <AvatarImage src={member.avatarUrl} alt="" />
                      <AvatarFallback className="text-sm font-semibold">
                        {memberInitials(member.name)}
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

          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9 gap-2 rounded-lg border-border bg-card px-4 text-foreground shadow-none hover:bg-muted/40"
            >
              <UsersIcon className="size-4" strokeWidth={1.75} />
              Share
            </Button>
            <Button type="button" className="h-9 gap-1.5 rounded-lg px-4">
              New Task
              <PlusIcon className="size-4" strokeWidth={2} />
            </Button>
          </div>
        </div>

        <div className="border-b border-[#e8ebf0] dark:border-border/60">
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
            <TabsList
              variant="line"
              className="h-9 w-fit justify-start gap-0 rounded-none border-0 bg-transparent p-0"
            >
            {viewTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "h-9 flex-none gap-2 rounded-none px-3.5 py-0 text-sm font-medium text-muted-foreground transition-colors",
                    "hover:text-foreground",
                    "group-data-horizontal/tabs:after:bottom-[-1px]",
                    "data-active:text-primary data-active:after:bg-primary data-active:after:h-0.5",
                    "[&_svg]:size-4 [&_svg]:shrink-0"
                  )}
                >
                  <Icon strokeWidth={1.75} />
                  {tab.label}
                </TabsTrigger>
              )
            })}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </header>
  )
}

export function ProjectBoardView({ project }: { project: ProjectSummary }) {
  const board = React.useMemo(() => getBoardForProject(project), [project])
  const [view, setView] = React.useState<ProjectView>("board")

  const visibleTeam = project.team.slice(0, 4)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-6 pt-6 pb-8 md:px-10 lg:px-16">
        <Link
          href="/projects"
          className="w-fit text-sm font-medium text-[#9aa3b2] transition-colors hover:text-foreground"
        >
          ← Projects
        </Link>
      </div>

      <ProjectDetailHeader
        board={board}
        visibleTeam={visibleTeam}
        view={view}
        onViewChange={setView}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-4 px-6 pb-6 md:px-10 lg:px-16">
        {view === "board" ? (
          <div className="flex flex-wrap items-center gap-2">
            <FilterChip label="Due Date" value="March 17 - 20" />
            <FilterChip label="Assignee" value="All" />
            <FilterChip label="Priority" value="All" />
            <Button
              type="button"
              variant="outline"
              className="h-9 gap-2 rounded-lg border-border/80 bg-card px-3 font-normal shadow-none"
            >
              <ClaritySliderLineIcon className="size-4" />
              Advance Filters
            </Button>
          </div>
        ) : null}

        {view === "board" ? <KanbanBoard key={project.slug} board={board} /> : null}
        {view === "overview" ? <ProjectOverviewPanel project={project} /> : null}
        {view === "list" ? <PlaceholderPanel title="List" /> : null}
        {view === "calendar" ? <PlaceholderPanel title="Calendar" /> : null}
        {view === "files" ? <PlaceholderPanel title="Files" /> : null}
      </div>
    </div>
  )
}
