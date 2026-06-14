"use client"

import * as React from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import type { IssueStatus } from "@/lib/status"

type Slice = {
  key: IssueStatus
  label: string
  value: number
  color: string
}

/** Status → chart segment CSS tokens (no default Recharts palette). */
const statusColors: Record<IssueStatus, string> = {
  todo: "var(--status-chart-todo)",
  in_progress: "var(--status-chart-in-progress)",
  in_review: "var(--status-chart-in-review)",
  completed: "var(--status-chart-completed)",
  overdue: "var(--status-chart-overdue)",
}

// Fixed demo data to match the reference screenshot.
const slices: Slice[] = [
  { key: "todo", label: "To Do", value: 12, color: statusColors.todo },
  {
    key: "in_progress",
    label: "In Progress",
    value: 8,
    color: statusColors.in_progress,
  },
  {
    key: "in_review",
    label: "In Review",
    value: 5,
    color: statusColors.in_review,
  },
  {
    key: "completed",
    label: "Completed",
    value: 15,
    color: statusColors.completed,
  },
  { key: "overdue", label: "Overdue", value: 3, color: statusColors.overdue },
]

function LegendDot({ color }: { color: string }) {
  return (
    <span
      className="size-3.5 shrink-0 rounded-full"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  )
}

export function IssuesByStatusDonut() {
  const [mounted, setMounted] = React.useState(false)

  const total = React.useMemo(() => slices.reduce((sum, s) => sum + s.value, 0), [])
  const completed = React.useMemo(
    () => slices.find((s) => s.key === "completed")?.value ?? 0,
    []
  )
  const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0

  React.useEffect(() => {
    // Avoid ResponsiveContainer warnings during static prerender.
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const legendRows = [
    slices.filter((s) => s.key === "in_progress" || s.key === "completed"),
    slices.filter((s) => s.key === "in_review" || s.key === "todo"),
    slices.filter((s) => s.key === "overdue"),
  ]

  return (
    <div className="w-full">
      <div className="h-[220px] w-full">
        {!mounted ? (
          <div className="h-full w-full rounded-lg bg-muted/40" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                cursor={false}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  color: "var(--popover-foreground)",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value) => [value, "Issues"]}
              />
              <Pie
                data={slices}
                dataKey="value"
                nameKey="label"
                innerRadius={66}
                outerRadius={92}
                paddingAngle={2}
                stroke="var(--card)"
                strokeWidth={3}
                fill="none"
                isAnimationActive={false}
              >
                {slices.map((slice) => (
                  <Cell key={slice.key} fill={slice.color} stroke={slice.color} />
                ))}
              </Pie>

              {/* Center label (percentage + status) */}
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                <tspan
                  x="50%"
                  dy="-2"
                  fill="var(--foreground)"
                  style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em" }}
                >
                  {completedPct}%
                </tspan>
                <tspan
                  x="50%"
                  dy="22"
                  fill="var(--muted-foreground)"
                  style={{ fontSize: 14, fontWeight: 600 }}
                >
                  completed
                </tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend (below chart) — dots use the same segment colors as the chart */}
      <div className="mt-5 space-y-2 text-sm text-muted-foreground">
        {legendRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {row.map((slice) => (
              <div key={slice.key} className="flex items-center gap-2.5">
                <LegendDot color={slice.color} />
                <span>
                  {slice.label}: {slice.value}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
