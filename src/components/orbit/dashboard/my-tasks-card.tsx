"use client"

import * as React from "react"
import Link from "next/link"
import { CheckIcon } from "lucide-react"

import {
  IssuePriorityBadge,
  IssueStatusBadge,
  issueStatusStripBackground,
} from "@/components/orbit/issues/issue-badges"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CURRENT_USER,
  getIssuesForAssignee,
  issuesSeed,
  type Issue,
} from "@/lib/issues-data"
import {
  loadPersistedIssues,
  savePersistedIssues,
  subscribeStore,
} from "@/lib/client-store"
import { cn } from "@/lib/utils"

function readMyTasks(): Issue[] {
  return getIssuesForAssignee(CURRENT_USER.id, loadPersistedIssues(issuesSeed))
}

export function MyTasksCard() {
  const [tasks, setTasks] = React.useState<Issue[]>(readMyTasks)

  React.useEffect(() => subscribeStore(() => setTasks(readMyTasks())), [])

  const openCount = tasks.filter((task) => task.status !== "completed").length
  const completedCount = tasks.filter((task) => task.status === "completed").length

  function toggleComplete(taskId: string) {
    const all = loadPersistedIssues(issuesSeed)
    const updated: Issue[] = all.map((task) =>
      task.id === taskId
        ? {
            ...task,
            status:
              task.status === "completed"
                ? ("in_progress" as const)
                : ("completed" as const),
          }
        : task
    )
    savePersistedIssues(updated)
    setTasks(getIssuesForAssignee(CURRENT_USER.id, updated))
  }

  return (
    <Card glass="subtle" className="lg:col-span-2 lg:col-start-1 lg:row-start-2">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-3 px-7 pt-3 pb-1">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
            My Tasks
          </CardTitle>
          <CardDescription className="text-sm leading-snug text-muted-foreground">
            {openCount} open · {completedCount} completed
          </CardDescription>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            className="h-8 rounded-md border-border/80 bg-muted/70 px-3 text-xs font-medium text-muted-foreground shadow-none hover:bg-muted/40"
            render={<Link href="/issues?assignee=me" />}
          >
            Filter
          </Button>
          <Button
            size="sm"
            nativeButton={false}
            className="h-8 rounded-md border-0 bg-primary/15 px-3 text-sm font-medium text-primary shadow-none hover:bg-primary/25"
            render={<Link href="/issues?new=1" />}
          >
            + New Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-7 pb-7">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {tasks.map((task) => {
            const isDone = task.status === "completed"
            return (
              <div
                key={task.id}
                className="flex overflow-hidden rounded-xl border border-foreground/10 bg-card transition-colors hover:bg-muted/30"
              >
                <div
                  className="w-1 shrink-0 self-stretch"
                  style={{ backgroundColor: issueStatusStripBackground(task.status) }}
                  aria-hidden
                />
                <div className="relative min-w-0 flex-1 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className={cn("min-w-0 flex-1", isDone && "opacity-80")}>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">{task.id}</span>
                      </div>
                      <div
                        className={cn(
                          "mt-1 text-sm font-semibold",
                          isDone &&
                            "text-[#9aa3b2] line-through decoration-[#949ca6] decoration-1"
                        )}
                      >
                        {task.title}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <IssueStatusBadge status={task.status} />
                        <IssuePriorityBadge priority={task.priority} />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleComplete(task.id)}
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                        "hover:ring-2 hover:ring-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                        isDone ? "border-transparent" : "border-border bg-background hover:border-primary/40"
                      )}
                      style={
                        isDone
                          ? { backgroundColor: "var(--status-chart-completed)" }
                          : undefined
                      }
                      aria-label={
                        isDone ? `Mark ${task.id} as in progress` : `Mark ${task.id} as completed`
                      }
                    >
                      {isDone ? (
                        <CheckIcon className="size-3 text-white" strokeWidth={3} />
                      ) : null}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
