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
  { key: "in_review", label: "In Review", value: 5, color: "var(--status-chart-in-review)" },
  { key: "done", label: "Done", value: 15, color: "var(--status-chart-done)" },
]

export function IssuesByStatusDonut() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // Avoid ResponsiveContainer warnings during static prerender.
    setMounted(true)
  }, [])

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
                innerRadius={62}
                outerRadius={86}
                paddingAngle={2}
                stroke="var(--card)"
                strokeWidth={3}
              >
                {slices.map((slice) => (
                  <Cell key={slice.key} fill={slice.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend (below chart) */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
        {slices.map((slice) => (
          <div key={slice.key} className="flex items-center gap-2.5">
            <span
              className="size-3.5 rounded-full"
              style={{ backgroundColor: slice.color }}
              aria-hidden="true"
            />
            <span>
              {slice.label} ({slice.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

