"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/** Primary-color gradient mapped to the full track; only the filled slice is visible. */
function progressFillStyle(pct: number): React.CSSProperties {
  if (pct <= 0) {
    return { backgroundColor: "var(--primary)" }
  }

  return {
    backgroundImage: `linear-gradient(90deg, color-mix(in oklch, var(--primary) 82%, black) 0%, var(--primary) 50%, color-mix(in oklch, var(--primary) 68%, white) 100%)`,
    backgroundSize: `${10000 / pct}% 100%`,
    backgroundRepeat: "no-repeat",
  }
}

function Progress({
  className,
  value,
  max = 100,
  gradient = false,
  ...props
}: React.ComponentProps<"div"> & {
  value: number
  max?: number
  /** Primary fill with a darker-to-lighter gradient along the bar. */
  gradient?: boolean
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const fillStyle = gradient ? progressFillStyle(pct) : undefined

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width,background] duration-300 ease-out",
          !gradient && "bg-primary"
        )}
        style={{
          width: `${pct}%`,
          ...fillStyle,
        }}
      />
    </div>
  )
}

export { Progress }
