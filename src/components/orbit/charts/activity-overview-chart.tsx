"use client"

import * as React from "react"
import {
  CalendarIcon,
  FolderIcon,
  PieChartIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"

type Point = { day: string; created: number; completed: number }

const HIGHLIGHT_DAY = "Fri"

const data: Point[] = [
  { day: "Mon", created: 168, completed: 42 },
  { day: "Tue", created: 214, completed: 51 },
  { day: "Wed", created: 192, completed: 47 },
  { day: "Thu", created: 258, completed: 58 },
  { day: "Fri", created: 344, completed: 89 },
  { day: "Sat", created: 206, completed: 61 },
  { day: "Sun", created: 172, completed: 44 },
]

const bottomNav = [
  { icon: PieChartIcon, label: "Overview", active: true },
  { icon: CalendarIcon, label: "Calendar", active: false },
  { icon: FolderIcon, label: "Projects", active: false },
  { icon: UserIcon, label: "Team", active: false },
  { icon: SettingsIcon, label: "Settings", active: false },
] as const

function LegendRing({ color }: { color: string }) {
  return (
    <span
      className="inline-block size-2.5 shrink-0 rounded-full border-[1.5px] bg-transparent"
      style={{ borderColor: color }}
      aria-hidden="true"
    />
  )
}

function HighlightLabel({
  x,
  y,
  value,
  payload,
  dataKey,
}: {
  x?: number
  y?: number
  value?: string | number
  payload?: Point
  dataKey?: string
}) {
  if (payload?.day !== HIGHLIGHT_DAY || x == null || y == null || value == null) {
    return null
  }

  const isCreated = dataKey === "created"
  const color = isCreated ? "var(--activity-created)" : "var(--activity-completed)"

  return (
    <text
      x={x}
      y={y + (isCreated ? -12 : 20)}
      textAnchor="middle"
      fill={color}
      style={{ fontSize: 13, fontWeight: 700 }}
    >
      {value}
    </text>
  )
}

function HighlightDot({
  cx,
  cy,
  payload,
  stroke,
}: {
  cx?: number
  cy?: number
  payload?: Point
  stroke: string
}) {
  if (payload?.day !== HIGHLIGHT_DAY || cx == null || cy == null) {
    return null
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="rgb(255 255 255 / 0.95)"
      stroke={stroke}
      strokeWidth={2}
    />
  )
}

export function ActivityOverviewChart() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="flex w-full flex-col">
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <LegendRing color="var(--activity-created)" />
          <span>Tasks Created</span>
        </div>
        <div className="flex items-center gap-2">
          <LegendRing color="var(--activity-completed)" />
          <span>Tasks Completed</span>
        </div>
      </div>

      <div className="relative h-[210px] w-full">
        {!mounted ? (
          <div className="h-full w-full rounded-lg bg-muted/30" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 0, right: 4, top: 18, bottom: 0 }}>
              <CartesianGrid
                stroke="var(--chart-grid)"
                strokeDasharray="0"
                vertical={false}
              />
              <ReferenceArea
                x1="Thu"
                x2="Sat"
                fill="var(--activity-highlight)"
                fillOpacity={1}
                strokeOpacity={0}
                ifOverflow="extendDomain"
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                tick={{ fill: "var(--muted-foreground)" }}
                dy={6}
              />
              <YAxis hide domain={[0, 400]} />
              <Line
                type="natural"
                dataKey="created"
                name="Tasks Created"
                stroke="var(--activity-created)"
                strokeWidth={2.75}
                dot={(props) => (
                  <HighlightDot
                    key={props.key}
                    cx={props.cx}
                    cy={props.cy}
                    payload={props.payload as Point}
                    stroke="var(--activity-created)"
                  />
                )}
                activeDot={false}
                isAnimationActive={false}
              >
                <LabelList dataKey="created" content={<HighlightLabel dataKey="created" />} />
              </Line>
              <Line
                type="natural"
                dataKey="completed"
                name="Tasks Completed"
                stroke="var(--activity-completed)"
                strokeWidth={1.75}
                dot={(props) => (
                  <HighlightDot
                    key={props.key}
                    cx={props.cx}
                    cy={props.cy}
                    payload={props.payload as Point}
                    stroke="var(--activity-completed)"
                  />
                )}
                activeDot={false}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="completed"
                  content={<HighlightLabel dataKey="completed" />}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-foreground/8 pt-3">
        {bottomNav.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-lg transition-colors",
              active
                ? "text-[var(--activity-created)]"
                : "text-muted-foreground/70 hover:bg-muted/40 hover:text-muted-foreground"
            )}
          >
            <Icon className="size-[18px]" strokeWidth={active ? 2.25 : 1.75} />
          </button>
        ))}
      </div>
    </div>
  )
}
