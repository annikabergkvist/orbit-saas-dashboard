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

type Point = { month: string; value: number }

// Demo data that matches the shape of the Figma reference. We'll replace this
// with real analytics later (API → server component → pass into the chart).
const data: Point[] = [
  { month: "Jan", value: 2600 },
  { month: "Feb", value: 1800 },
  { month: "Mar", value: 9800 },
  { month: "Apr", value: 4200 },
  { month: "May", value: 4800 },
  { month: "Jun", value: 3900 },
  { month: "Jul", value: 4300 },
]

function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined).format(value)
}

export function ActivityOverviewChart() {
  const gradientId = React.useId()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // Recharts' ResponsiveContainer relies on layout measurement APIs that don't
    // exist during static prerender. Rendering after mount avoids noisy warnings.
    setMounted(true)
  }, [])

  return (
    <div className="h-[240px] w-full">
      {!mounted ? (
        <div className="h-full w-full rounded-lg bg-muted/40" />
      ) : (
        <>
          {/* ResponsiveContainer makes Recharts scale with the parent card. */}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
              <defs>
                {/* Fill is driven by CSS tokens, not hardcoded colors. */}
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
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
                width={42}
              />
              <Tooltip
                cursor={{ stroke: "var(--border)" }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  color: "var(--popover-foreground)",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "var(--muted-foreground)" }}
                formatter={(value) => [formatNumber(Number(value)), "value"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, stroke: "var(--chart-1)", fill: "var(--background)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  )
}

