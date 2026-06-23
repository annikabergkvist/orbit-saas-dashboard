"use client"

import * as React from "react"
import Link from "next/link"
import {
  DownloadIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
} from "lucide-react"

import {
  IssuePriorityBars,
  IssueStatusIcon,
} from "@/components/orbit/issues/issue-badges"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { filterIssues, issuesSeed } from "@/lib/issues-data"
import { loadPersistedIssues } from "@/lib/client-store"
import { boardColumns, type BoardTask } from "@/lib/projects-data"
import type { WorkItemStatus } from "@/lib/status"

function columnLabel(column: BoardTask["column"]) {
  return boardColumns.find((c) => c.id === column)?.label ?? column
}

export function ProjectListView({
  projectSlug,
  tasks,
}: {
  projectSlug: string
  tasks: BoardTask[]
}) {
  const issues = React.useMemo(() => {
    const all = loadPersistedIssues(issuesSeed)
    return filterIssues(all, { projectSlug })
  }, [projectSlug])

  const rows = [
    ...tasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.column as WorkItemStatus,
      dueLabel: task.dueLabel,
      kind: "board" as const,
    })),
    ...issues.map((issue) => ({
      id: issue.id,
      title: issue.title,
      status: issue.status,
      dueLabel: issue.dueLabel,
      kind: "issue" as const,
      priority: issue.priority,
    })),
  ]

  if (rows.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border/80 bg-card px-6 py-16">
        <p className="text-sm text-muted-foreground">No tasks or issues for this project yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 font-medium">Task</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">Status</th>
            <th className="px-4 py-3 font-medium">Due</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Type</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {rows.map((row) => (
            <tr key={`${row.kind}-${row.id}`} className="hover:bg-muted/20">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <IssueStatusIcon status={row.status} className="size-4 shrink-0" />
                  {row.kind === "issue" ? (
                    <Link
                      href={`/issues?issue=${row.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {row.title}
                    </Link>
                  ) : (
                    <span className="font-medium text-foreground">{row.title}</span>
                  )}
                  {"priority" in row && row.priority ? (
                    <IssuePriorityBars priority={row.priority} className="ml-auto shrink-0" />
                  ) : null}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
                  {columnLabel(row.status as BoardTask["column"])}
                </p>
              </td>
              <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                {columnLabel(row.status as BoardTask["column"])}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{row.dueLabel}</td>
              <td className="hidden px-4 py-3 capitalize text-muted-foreground md:table-cell">
                {row.kind}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const CALENDAR_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

function parseDueDay(label: string): string | null {
  const match = label.match(/\b(Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})\b/i)
  if (!match) return null
  return `${match[1]} ${match[2]}`
}

export function ProjectCalendarView({
  projectSlug,
  tasks,
}: {
  projectSlug: string
  tasks: BoardTask[]
}) {
  const items = React.useMemo(() => {
    const issues = filterIssues(loadPersistedIssues(issuesSeed), { projectSlug })
    return [
      ...tasks.map((t) => ({ id: t.id, title: t.title, due: parseDueDay(t.dueLabel) })),
      ...issues.map((i) => ({ id: i.id, title: i.title, due: parseDueDay(i.dueLabel) })),
    ].filter((item) => item.due)
  }, [projectSlug, tasks])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {CALENDAR_DAYS.map((day) => (
          <div
            key={day}
            className="rounded-lg border border-border/60 bg-card p-2 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
        {Array.from({ length: 28 }, (_, index) => {
          const dayNum = index + 1
          const label = `Jun ${dayNum}`
          const dayItems = items.filter((item) => item.due === label)
          return (
            <div
              key={label}
              className={cn(
                "min-h-24 rounded-lg border border-border/50 bg-card p-2",
                dayItems.length > 0 && "border-primary/30 bg-primary/[0.03]"
              )}
            >
              <p className="text-xs font-semibold text-muted-foreground">{dayNum}</p>
              <ul className="mt-1 space-y-1">
                {dayItems.slice(0, 2).map((item) => (
                  <li
                    key={item.id}
                    className="truncate rounded-md bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-foreground"
                  >
                    {item.title}
                  </li>
                ))}
                {dayItems.length > 2 ? (
                  <li className="text-[10px] text-muted-foreground">+{dayItems.length - 2} more</li>
                ) : null}
              </ul>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        June 2026 — tasks and issues with due dates for this project.
      </p>
    </div>
  )
}

type ProjectFile = {
  id: string
  name: string
  size: string
  kind: "pdf" | "image" | "doc"
  taskTitle: string
}

function buildProjectFiles(tasks: BoardTask[]): ProjectFile[] {
  const files: ProjectFile[] = []
  for (const task of tasks) {
    if (task.attachments <= 0) continue
    for (let i = 0; i < task.attachments; i += 1) {
      const kind = i % 3 === 0 ? "pdf" : i % 3 === 1 ? "image" : "doc"
      files.push({
        id: `${task.id}-file-${i}`,
        name:
          kind === "pdf"
            ? `${task.title.toLowerCase().replace(/\s+/g, "-")}-spec.pdf`
            : kind === "image"
              ? `${task.title.toLowerCase().replace(/\s+/g, "-")}-mockup.png`
              : `${task.title.toLowerCase().replace(/\s+/g, "-")}-notes.md`,
        size: kind === "pdf" ? "1.2 MB" : kind === "image" ? "840 KB" : "24 KB",
        kind,
        taskTitle: task.title,
      })
    }
  }
  return files
}

function FileKindIcon({ kind }: { kind: ProjectFile["kind"] }) {
  if (kind === "image") return <ImageIcon className="size-4" strokeWidth={1.75} />
  if (kind === "doc") return <FileTextIcon className="size-4" strokeWidth={1.75} />
  return <FileIcon className="size-4" strokeWidth={1.75} />
}

export function ProjectFilesView({ tasks }: { tasks: BoardTask[] }) {
  const files = React.useMemo(() => buildProjectFiles(tasks), [tasks])

  if (files.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card px-6 py-16 text-center">
        <FileIcon className="mb-3 size-8 text-muted-foreground/50" strokeWidth={1.5} />
        <p className="text-sm text-muted-foreground">No files uploaded to board tasks yet.</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60 bg-card">
      {files.map((file) => (
        <li key={file.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
              <FileKindIcon kind={file.kind} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{file.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {file.taskTitle} · {file.size}
              </p>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5 shadow-none">
            <DownloadIcon className="size-3.5" strokeWidth={1.75} />
            Download
          </Button>
        </li>
      ))}
    </ul>
  )
}
