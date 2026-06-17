import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function SettingsSection({
  title,
  description,
  children,
  className,
  titleClassName,
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
  titleClassName?: string
}) {
  return (
    <section
      className={cn(
        "glass-subtle panel-glass-subtle flex flex-col gap-6 rounded-xl p-6 md:p-8",
        className
      )}
    >
      <div className="space-y-1">
        <h2 className={cn("text-lg font-semibold text-foreground", titleClassName)}>
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

export function SettingsToggleRow({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-border/60 py-4 first:border-t-0 first:pt-0 last:pb-0">
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0 pt-0.5">{children}</div>
    </div>
  )
}
