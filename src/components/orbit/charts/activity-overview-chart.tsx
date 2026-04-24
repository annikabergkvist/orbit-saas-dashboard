"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type Point = { month: string; created: number; completed: number }

// Demo data that matches the shape of the Figma reference. We'll replace this
// with real analytics later (API → server component → pass into the chart).
const data: Point[] = [
  { month: "Jan", created: 72, completed: 28 },
  { month: "Feb", created: 88, completed: 24 },
  { month: "Mar", created: 88, completed: 23 },
  { month: "Apr", created: 110, completed: 38 },
  { month: "May", created: 108, completed: 42 },
  { month: "Jun", created: 90, completed: 42 },
  { month: "Jul", created: 91, completed: 41 },
  { month: "Aug", created: 90, completed: 25 },
  { month: "Sep", created: 55, completed: 19 },
  { month: "Oct", created: 48, completed: 19 },
  { month: "Nov", created: 92, completed: 36 },
]

function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined).format(value)
}

export function ActivityOverviewChart() {
  const gradientId = React.useId()
  const createdGradientId = `${gradientId}-created`
  const completedGradientId = `${gradientId}-completed`
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // Recharts' ResponsiveContainer relies on layout measurement APIs that don't
    // exist during static prerender. Rendering after mount avoids noisy warnings.
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="relative h-[240px] w-full">
      {!mounted ? (
        <div className="h-full w-full rounded-lg bg-muted/40" />
      ) : (
        <>
          {/* Legend (top-right) */}
          <div className="pointer-events-none absolute right-2 top-2 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: "var(--activity-created)" }}
                aria-hidden="true"
              />
              <span>Tasks Created</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: "var(--activity-completed)" }}
                aria-hidden="true"
              />
              <span>Tasks Completed</span>
            </div>
          </div>

          {/* ResponsiveContainer makes Recharts scale with the parent card. */}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id={createdGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--activity-created)" stopOpacity={0.14} />
                  <stop offset="95%" stopColor="var(--activity-created)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id={completedGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--activity-completed)" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="var(--activity-completed)" stopOpacity={0} />
                </linearGradient>
              </defs>
              {/* Light, solid horizontal grid lines (no vertical lines). */}
              <CartesianGrid
                stroke="var(--chart-grid)"
                strokeDasharray="0"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "var(--muted-foreground)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "var(--muted-foreground)" }}
                tickFormatter={formatNumber}
                width={34}
                domain={[0, 150]}
              />
              <Tooltip
                cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  color: "var(--popover-foreground)",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "var(--muted-foreground)" }}
                formatter={(value, name) => [formatNumber(Number(value)), String(name)]}
              />
              <Area
                type="monotone"
                dataKey="created"
                name="Tasks Created"
                stroke="var(--activity-created)"
                strokeWidth={2}
                fill={`url(#${createdGradientId})`}
                dot={false}
                activeDot={{ r: 4, stroke: "var(--activity-created)", fill: "var(--background)" }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                name="Tasks Completed"
                stroke="var(--activity-completed)"
                strokeWidth={2}
                fill={`url(#${completedGradientId})`}
                dot={false}
                activeDot={{
                  r: 4,
                  stroke: "var(--activity-completed)",
                  fill: "var(--background)",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  )
}

