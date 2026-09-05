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
import {
  CalendarIcon,
  CheckCheckIcon,
  ChevronDownIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  PaperclipIcon,
  PlusIcon,
} from "lucide-react"

import {
  IssuePriorityBadge,
  IssueStatusBadge,
  TaskTagBadge,
  issueStatusStripBackground,
} from "@/components/orbit/issues/issue-badges"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { useIsMobile } from "@/hooks/use-mobile"
import { completedTitleClass, getInitials, metaTextClass } from "@/lib/format"
import {
  boardColumns,
  type BoardColumnId,
  type BoardTask,
} from "@/lib/projects-data"
import { isBoardColumnId } from "@/lib/status"
import { cn } from "@/lib/utils"

function groupTasksByColumn(tasks: BoardTask[]): Record<BoardColumnId, BoardTask[]> {
  const map: Record<BoardColumnId, BoardTask[]> = {
    todo: [],
    in_progress: [],
    in_review: [],
    completed: [],
  }
  for (const task of tasks) {
    map[task.column].push(task)
  }
  return map
}

function flattenTasks(map: Record<BoardColumnId, BoardTask[]>): BoardTask[] {
  return boardColumns.flatMap((col) => map[col.id])
}

function applyTaskToColumn(task: BoardTask, column: BoardColumnId): BoardTask {
  const next: BoardTask = { ...task, column }
  if (column === "in_progress" && next.progress === undefined) {
    return { ...next, progress: 0 }
  }
  return next
}

function isCompletedColumn(column: BoardColumnId): boolean {
  return column === "completed"
}

function BoardTaskCard({
  task,
  className,
  onMove,
}: {
  task: BoardTask
  className?: string
  onMove?: (column: BoardColumnId) => void
}) {
  const isCompleted = isCompletedColumn(task.column)

  return (
    <Card glass="subtle" className={cn("gap-0 py-0", isCompleted && "flex", className)}>
      {isCompleted ? (
        <div
          className="w-1 shrink-0 self-stretch"
          style={{ backgroundColor: issueStatusStripBackground("completed") }}
          aria-hidden
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="space-y-3 p-4">
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={cn(
                  "min-w-0 flex-1 text-lg font-semibold leading-snug tracking-tight",
                  isCompleted ? completedTitleClass : "text-foreground"
                )}
              >
                {task.title}
              </h3>
              {onMove ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 shrink-0 gap-1 border-border/80 bg-card px-2.5 text-xs font-medium shadow-none"
                        aria-label={`Move ${task.title}`}
                      >
                        Move
                        <ChevronDownIcon className="size-3.5 opacity-60" strokeWidth={2} />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="min-w-[10rem]">
                    <DropdownMenuRadioGroup
                      value={task.column}
                      onValueChange={(value) => {
                        if (isBoardColumnId(value) && value !== task.column) onMove(value)
                      }}
                    >
                      {boardColumns.map((col) => (
                        <DropdownMenuRadioItem key={col.id} value={col.id}>
                          {col.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
            {task.description ? (
              <p className={cn("leading-relaxed", metaTextClass)}>{task.description}</p>
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

          {(task.tags?.length ?? 0) > 0 ||
          task.priority ||
          task.assignees.length > 0 ||
          isCompleted ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                {isCompleted ? <IssueStatusBadge status="completed" /> : null}
                {task.tags?.map((tag) => (
                  <TaskTagBadge key={tag} tag={tag} />
                ))}
                {task.priority ? <IssuePriorityBadge priority={task.priority} /> : null}
              </div>
              {task.assignees.length > 0 ? (
                <div className="flex shrink-0 -space-x-2">
                  {task.assignees.map((member) => (
                    <Avatar
                      key={member.id}
                      className="size-9 border-2 border-background ring-0"
                      title={member.name}
                    >
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                      <AvatarFallback className="text-[10px] font-semibold">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {task.column === "in_progress" || task.progress !== undefined ? (
            <div className="space-y-1.5">
              <div className={cn("flex items-center justify-between text-xs font-medium", metaTextClass)}>
                <span>Progress</span>
                <span className="tabular-nums">{task.progress ?? 0}%</span>
              </div>
              <Progress value={task.progress ?? 0} gradient className="h-1.5 bg-muted" />
            </div>
          ) : null}
        </div>

        <div className={cn("flex items-center gap-3 border-t border-border px-4 py-3", metaTextClass)}>
          <span className="inline-flex items-center gap-1.5">
            <MessageCircleIcon className="size-3.5" strokeWidth={1.75} />
            <span className="tabular-nums">{task.comments}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <PaperclipIcon className="size-3.5" strokeWidth={1.75} />
            <span className="tabular-nums">{task.attachments}</span>
          </span>
          {isCompleted ? (
            <span className="ml-auto inline-flex items-center gap-1.5 font-medium text-[var(--status-completed-foreground)]">
              <CheckCheckIcon className="size-3.5 shrink-0" strokeWidth={2.25} />
              <span>Completed</span>
            </span>
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
        className={cn("cursor-grab active:cursor-grabbing", isDragging && "ring-2 ring-primary/25")}
      />
    </div>
  )
}

function KanbanColumnHeader({
  col,
  count,
}: {
  col: (typeof boardColumns)[number]
  count: number
}) {
  return (
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
      <span className="text-xs font-semibold tabular-nums text-muted-foreground">{count}</span>
      <div className="ml-auto hidden items-center gap-0.5 md:flex">
        <button
          type="button"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={`${col.label} column menu`}
        >
          <MoreHorizontalIcon className="size-4" />
        </button>
        <button
          type="button"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={`Add task to ${col.label}`}
        >
          <PlusIcon className="size-4" />
        </button>
      </div>
    </header>
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
          "flex flex-col gap-3 rounded-lg bg-muted/80 px-2.5 pt-2 pb-2.5 transition-shadow dark:bg-muted/40",
          isOver && "ring-2 ring-primary/20"
        )}
      >
        <KanbanColumnHeader col={col} count={tasks.length} />
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div ref={setNodeRef} className="flex min-h-[120px] flex-col gap-3">
            {tasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </div>
    </section>
  )
}

function MobileKanbanColumn({
  col,
  tasks,
  onMove,
}: {
  col: (typeof boardColumns)[number]
  tasks: BoardTask[]
  onMove: (taskId: string, column: BoardColumnId) => void
}) {
  return (
    <section className="flex w-full flex-col">
      <div className="flex flex-col gap-3 rounded-lg bg-muted/80 px-2.5 pt-2 pb-2.5 dark:bg-muted/40">
        <KanbanColumnHeader col={col} count={tasks.length} />
        <div className="flex min-h-[72px] flex-col gap-3">
          {tasks.length === 0 ? (
            <p className="px-1 py-4 text-center text-xs text-muted-foreground">No tasks</p>
          ) : (
            tasks.map((task) => (
              <BoardTaskCard
                key={task.id}
                task={task}
                onMove={(column) => onMove(task.id, column)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export function KanbanBoard({
  tasks,
  setTasks,
}: {
  tasks: BoardTask[]
  setTasks: React.Dispatch<React.SetStateAction<BoardTask[]>>
}) {
  const isMobile = useIsMobile()
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const tasksByColumn = React.useMemo(() => groupTasksByColumn(tasks), [tasks])
  const activeTask = activeId ? tasks.find((task) => task.id === activeId) : null

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function moveTask(taskId: string, column: BoardColumnId) {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? applyTaskToColumn(task, column) : task))
    )
  }

  const findContainer = React.useCallback(
    (id: string) => {
      if (isBoardColumnId(id)) return id
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

      if (isBoardColumnId(String(over.id))) {
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

  if (isMobile) {
    return (
      <div className="flex flex-col gap-5 pb-2">
        {boardColumns.map((col) => (
          <MobileKanbanColumn
            key={col.id}
            col={col}
            tasks={tasksByColumn[col.id]}
            onMove={moveTask}
          />
        ))}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex min-h-0 flex-1 items-start gap-5 overflow-x-auto pb-2">
        {boardColumns.map((col) => (
          <KanbanColumn key={col.id} col={col} tasks={tasksByColumn[col.id]} />
        ))}
      </div>
      <DragOverlay dropAnimation={{ duration: 180, easing: "ease-out" }}>
        {activeTask ? (
          <div className="w-[min(100%,280px)] cursor-grabbing">
            <BoardTaskCard task={activeTask} className="ring-2 ring-primary/20" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
