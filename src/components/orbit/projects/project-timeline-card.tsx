"use client"

import Link from "next/link"
import { CalendarIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  getDashboardTimelineProjects,
  getProjectTypeAccentColor,
  type ProjectSummary,
} from "@/lib/projects-data"
import { cn } from "@/lib/utils"

const SPRINTS = ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4"] as const

const RANGE_LABEL = "15 Jan – 30 Jun"
const TOTAL_DAYS = 22
const PLOT_HEIGHT = 400
const BAR_HEIGHT = 44
const TODAY_POSITION = 50

const Y_AXIS_DATES = [
  "Oct 12",
  "Oct 13",
  "Oct 14",
  "Oct 15",
  "Oct 16",
  "Oct 17",
  "Oct 18",
  "Oct 19",
  "Oct 20",
  "Oct 21",
] as const

const PLOT_ROWS = Y_AXIS_DATES.length

const timelineProjects = getDashboardTimelineProjects()

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function TaskBar({
  project,
  color,
}: {
  project: ProjectSummary
  color: string
}) {
  const timeline = project.timeline!
  const rowHeight = PLOT_HEIGHT / PLOT_ROWS
  const top = timeline.lane * rowHeight + (rowHeight - BAR_HEIGHT) / 2
  const left = (timeline.startDay / TOTAL_DAYS) * 100
  const width = Math.max(
    ((timeline.endDay - timeline.startDay + 1) / TOTAL_DAYS) * 100,
    14
  )

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="absolute z-10 flex items-center gap-2 overflow-hidden rounded-xl border border-foreground/10 bg-white/60 px-3 shadow-sm backdrop-blur-sm transition-colors hover:border-foreground/20"
      style={{
        top,
        left: `${left}%`,
        width: `${width}%`,
        height: BAR_HEIGHT,
        boxShadow: `0 1px 3px rgb(15 23 42 / 0.06)`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-[12%] rounded-l-xl"
        style={{
          background: `linear-gradient(90deg, color-mix(in srgb, ${color} 42%, white) 0%, color-mix(in srgb, ${color} 16%, transparent) 50%, transparent 100%)`,
        }}
      />
      <div className="relative z-[1] min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-foreground">{project.title}</p>
        <p className="truncate text-[10px] text-muted-foreground">
          {timeline.startLabel} – {timeline.endLabel}
        </p>
      </div>
      <div className="relative z-[1] flex shrink-0 -space-x-2">
        {project.team.slice(0, 2).map((assignee) => (
          <Avatar
            key={assignee.id}
            size="sm"
            className="ring-2 ring-white/90 after:border-foreground/10"
          >
            <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
            <AvatarFallback className="bg-muted text-[9px] font-semibold">
              {initials(assignee.name)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
    </Link>
  )
}

export function ProjectTimelineCard({ className }: { className?: string }) {
  return (
    <Card glass="subtle" className={cn("h-full min-h-0 pb-2", className)}>
      <CardHeader className="px-7 pt-3">
        <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
          Timeline
        </CardTitle>
        <CardAction>
          <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border/80 bg-muted/40 px-3 text-xs font-medium text-muted-foreground">
            <CalendarIcon className="size-3.5 shrink-0" strokeWidth={1.75} />
            {RANGE_LABEL}
          </span>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col px-7 pb-4">
        <div className="flex min-h-0 flex-1 gap-3">
          <div
            className="flex w-11 shrink-0 flex-col justify-between py-0.5 text-[10px] font-medium leading-none text-muted-foreground"
            style={{ height: PLOT_HEIGHT }}
          >
            {Y_AXIS_DATES.map((date) => (
              <span key={date}>{date}</span>
            ))}
          </div>

          <div className="min-w-0 flex-1">
            <div className="relative" style={{ height: PLOT_HEIGHT }}>
              {/* Subtle horizontal + vertical grid */}
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                {Y_AXIS_DATES.map((date, index) => (
                  <div
                    key={date}
                    className="absolute inset-x-0 border-t border-foreground/[0.07]"
                    style={{
                      top:
                        index === 0
                          ? 0
                          : `${(index / (PLOT_ROWS - 1)) * 100}%`,
                    }}
                  />
                ))}
                <div className="absolute inset-x-0 bottom-0 border-b border-foreground/10" />
              </div>

              <div className="absolute inset-0 grid grid-cols-4">
                {SPRINTS.map((sprint, index) => (
                  <div
                    key={sprint}
                    className={cn(
                      "h-full",
                      index > 0 &&
                        "border-l border-dashed border-foreground/[0.12]"
                    )}
                  />
                ))}
              </div>

              <div
                className="absolute bottom-0 top-0 z-[1] w-px bg-foreground/20"
                style={{ left: `${TODAY_POSITION}%` }}
                aria-hidden
              />

              {timelineProjects.map((project) => (
                <TaskBar
                  key={project.slug}
                  project={project}
                  color={getProjectTypeAccentColor(project.type)}
                />
              ))}
            </div>

            <div className="mt-6 grid grid-cols-4 pt-1 text-center text-[11px] font-medium text-muted-foreground">
              {SPRINTS.map((sprint) => (
                <span key={sprint} className="truncate">
                  {sprint}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
