"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  dashboardProjectSortOptions,
  DASHBOARD_PROJECTS_VISIBLE,
  getDashboardProjects,
  getProjectAccentColor,
  type DashboardProjectSort,
} from "@/lib/projects-data"
import { cn } from "@/lib/utils"

const RING_RADII = [88, 72, 56, 42]

function ProgressRing({
  cx,
  cy,
  radius,
  progress,
  color,
  strokeWidth = 8,
}: {
  cx: number
  cy: number
  radius: number
  progress: number
  color: string
  strokeWidth?: number
}) {
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress / 100)

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="var(--border)"
        strokeWidth={strokeWidth}
        opacity={0.85}
      />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </g>
  )
}

export function ProjectsProgressCard({ className }: { className?: string }) {
  const [sort, setSort] = React.useState<DashboardProjectSort>("priority")
  const [page, setPage] = React.useState(0)

  const allProjects = React.useMemo(() => getDashboardProjects(sort), [sort])
  const totalPages = Math.max(1, Math.ceil(allProjects.length / DASHBOARD_PROJECTS_VISIBLE))

  React.useEffect(() => {
    setPage((current) => Math.min(current, totalPages - 1))
  }, [totalPages, sort])

  const visibleProjects = allProjects.slice(
    page * DASHBOARD_PROJECTS_VISIBLE,
    page * DASHBOARD_PROJECTS_VISIBLE + DASHBOARD_PROJECTS_VISIBLE
  )

  const projectRings = visibleProjects.map((project, index) => ({
    slug: project.slug,
    name: project.title,
    days: project.activeDays,
    progress: project.progress,
    color: getProjectAccentColor(project),
    radius: RING_RADII[index] ?? 42,
  }))

  const overallCompleted =
    projectRings.length > 0
      ? Math.round(
          projectRings.reduce((sum, ring) => sum + ring.progress, 0) /
            projectRings.length
        )
      : 0

  const sortLabel =
    dashboardProjectSortOptions.find((option) => option.value === sort)?.label ??
    "Sort"

  const rangeStart = allProjects.length === 0 ? 0 : page * DASHBOARD_PROJECTS_VISIBLE + 1
  const rangeEnd = Math.min(
    (page + 1) * DASHBOARD_PROJECTS_VISIBLE,
    allProjects.length
  )

  const cx = 100
  const cy = 100

  return (
    <Card glass="subtle" className={cn("h-full min-h-0 pb-2", className)}>
      <CardHeader className="px-7 pt-3">
        <CardTitle className="flex items-baseline gap-2 text-lg font-semibold tracking-tight">
          <span>Progress</span>
          <span className="text-sm font-medium text-muted-foreground">
            {allProjects.length} active
          </span>
        </CardTitle>
        <CardAction>
          <div className="flex items-center gap-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 border-border/80 bg-muted/40 px-2.5 text-xs font-medium shadow-none"
                  >
                    {sortLabel}
                    <ChevronDownIcon className="size-3.5 opacity-70" strokeWidth={2} />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="min-w-[12rem]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => {
                    if (
                      value === "priority" ||
                      value === "at-risk" ||
                      value === "progress"
                    ) {
                      setSort(value)
                      setPage(0)
                    }
                  }}
                >
                  {dashboardProjectSortOptions.map((option) => (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/projects"
              aria-label="Open projects"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "icon-lg",
                  className:
                    "size-9 shrink-0 -translate-y-1 rounded-full border-border bg-muted/50 text-foreground shadow-none hover:bg-muted",
                })
              )}
            >
              <ArrowUpRightIcon className="size-[18px]" strokeWidth={1.75} />
            </Link>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col px-7 pb-3">
        <div className="relative mx-auto flex w-full max-w-[250px] flex-1 flex-col items-center justify-center py-1">
          <div
            className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_58%,rgb(124_58_237/0.08),transparent_68%)]"
            aria-hidden
          />

          <div className="relative aspect-square w-full">
            <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
              {[...projectRings].reverse().map((ring) => (
                <ProgressRing
                  key={ring.slug}
                  cx={cx}
                  cy={cy}
                  radius={ring.radius}
                  progress={ring.progress}
                  color={ring.color}
                />
              ))}
            </svg>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-[11px] font-medium text-muted-foreground">
                Avg. progress
              </p>
              <p className="mt-0.5 text-4xl font-bold tracking-tight text-foreground">
                {overallCompleted}%
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2 space-y-2 border-t border-border/80 pt-4">
          {projectRings.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No projects yet.
            </p>
          ) : (
            projectRings.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="grid grid-cols-[minmax(0,1fr)_2.5rem_2.5rem] items-center gap-x-3 rounded-lg px-1 py-1 text-sm transition-colors hover:bg-muted/40"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="h-1.5 w-4 shrink-0 rounded-full"
                    style={{ backgroundColor: project.color }}
                    aria-hidden
                  />
                  <span className="truncate font-medium text-foreground">
                    {project.name}
                  </span>
                </div>
                <span className="text-center text-xs font-medium text-muted-foreground">
                  {project.days != null ? `${project.days}d` : "—"}
                </span>
                <span className="text-right text-sm font-semibold text-foreground">
                  {project.progress}%
                </span>
              </Link>
            ))
          )}
        </div>

        {allProjects.length > DASHBOARD_PROJECTS_VISIBLE ? (
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Showing {rangeStart}–{rangeEnd} of {allProjects.length}
            </p>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-7 border-border/80 bg-muted/30 shadow-none"
                disabled={page === 0}
                aria-label="Previous projects"
                onClick={() => setPage((current) => Math.max(0, current - 1))}
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-7 border-border/80 bg-muted/30 shadow-none"
                disabled={page >= totalPages - 1}
                aria-label="Next projects"
                onClick={() =>
                  setPage((current) => Math.min(totalPages - 1, current + 1))
                }
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
