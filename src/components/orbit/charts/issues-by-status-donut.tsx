"use client"

import * as React from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

type StatusKey = "todo" | "in_progress" | "in_review" | "done"

type Slice = {
  key: StatusKey
  label: string
  value: number
  color: string
}

// Fixed demo data to match the reference screenshot.
const slices: Slice[] = [
  { key: "todo", label: "To Do", value: 12, color: "var(--status-chart-todo)" },
  {
    key: "in_progress",
    label: "In Progress",
    value: 8,
    color: "var(--status-chart-in-progress)",
  },
  { key: "done", label: "Done", value: 15, color: "var(--status-chart-done)" },
]

export function IssuesByStatusDonut() {
  const [mounted, setMounted] = React.useState(false)

  const total = React.useMemo(() => slices.reduce((sum, s) => sum + s.value, 0), [])
  const done = React.useMemo(() => slices.find((s) => s.key === "done")?.value ?? 0, [])
  const donePct = total > 0 ? Math.round((done / total) * 100) : 0

  React.useEffect(() => {
    // Avoid ResponsiveContainer warnings during static prerender.
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const todo = slices.find((s) => s.key === "todo")?.value ?? 0
  const inProgress = slices.find((s) => s.key === "in_progress")?.value ?? 0

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
              >
                {slices.map((slice) => (
                  <Cell key={slice.key} fill={slice.color} />
                ))}
              </Pie>

              {/* Center label (percentage + status) */}
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                <tspan
                  x="50%"
                  dy="-2"
                  fill="var(--foreground)"
                  style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em" }}
                >
                  {donePct}%
                </tspan>
                <tspan
                  x="50%"
                  dy="22"
                  fill="var(--muted-foreground)"
                  style={{ fontSize: 14, fontWeight: 600 }}
                >
                  done
                </tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend (below chart) */}
      <div className="mt-5 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-2.5">
            <span
              className="size-3.5 rounded-full"
              style={{ backgroundColor: "var(--status-chart-in-progress)" }}
              aria-hidden="true"
            />
            <span>In Progress: {inProgress}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              className="size-3.5 rounded-full"
              style={{ backgroundColor: "var(--status-chart-done)" }}
              aria-hidden="true"
            />
            <span>Completed: {done}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-center gap-2.5">
          <span
            className="size-3.5 rounded-full"
            style={{ backgroundColor: "var(--status-chart-todo)" }}
            aria-hidden="true"
          />
          <span>To Do: {todo}</span>
        </div>
      </div>
    </div>
  )
}

