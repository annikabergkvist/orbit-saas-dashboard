"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { ActivityOverviewChart } from "@/components/orbit/charts/activity-overview-chart"
import { IssuesByStatusDonut } from "@/components/orbit/charts/issues-by-status-donut"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

function ChartCardShell({
  title,
  href,
  hrefLabel,
  children,
  className,
}: {
  title: string
  href: string
  hrefLabel: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card glass className={cn("flex min-h-0 flex-col", className)}>
      <CardHeader className="px-7 pt-3">
        <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </CardTitle>
        <CardAction>
          <Link
            href={href}
            aria-label={hrefLabel}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "icon-lg",
                className:
                  "size-9 shrink-0 -translate-y-1 rounded-full border-border bg-muted/50 text-foreground shadow-none hover:bg-muted/35",
              })
            )}
          >
            <ArrowUpRightIcon className="size-[18px]" strokeWidth={1.75} />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 px-7 pb-5">{children}</CardContent>
    </Card>
  )
}

export function ActivityOverviewCard({ className }: { className?: string }) {
  return (
    <ChartCardShell
      title="Activity Overview"
      href="/issues"
      hrefLabel="Open issues"
      className={className}
    >
      <ActivityOverviewChart embedded />
    </ChartCardShell>
  )
}

export function IssuesByStatusCard({ className }: { className?: string }) {
  return (
    <ChartCardShell
      title="Issues by Status"
      href="/issues"
      hrefLabel="Open issues"
      className={className}
    >
      <IssuesByStatusDonut />
    </ChartCardShell>
  )
}
