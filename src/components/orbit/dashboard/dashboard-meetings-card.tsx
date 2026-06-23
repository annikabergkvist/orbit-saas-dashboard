"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowUpRightIcon,
  CalendarIcon,
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
import { subscribeStore } from "@/lib/client-store"
import { getDashboardMeetings } from "@/lib/meetings-data"
import { INTEGRATIONS_SETTINGS_HREF } from "@/lib/settings-data"
import { cn } from "@/lib/utils"

function MeetingProviderMark({
  provider,
  className,
}: {
  provider: "Meet" | "Zoom"
  className?: string
}) {
  const src = provider === "Meet" ? "/icons/google-meet.svg" : "/icons/zoom.svg"
  return (
    <Image
      src={src}
      alt=""
      width={16}
      height={16}
      draggable={false}
      className={cn("size-4 shrink-0 object-contain", className)}
    />
  )
}

export function DashboardMeetingsCard() {
  const [meetings, setMeetings] = React.useState(getDashboardMeetings)

  React.useEffect(() => {
    return subscribeStore(() => setMeetings(getDashboardMeetings()))
  }, [])

  return (
    <Card glass="subtle">
      <CardHeader className="px-7 pt-3">
        <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
          My Meetings
        </CardTitle>
        <CardAction>
          <Link
            href={INTEGRATIONS_SETTINGS_HREF}
            aria-label="Calendar integration settings"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "icon-lg",
                className:
                  "size-9 shrink-0 -translate-y-1 rounded-full border-border bg-muted/50 text-foreground shadow-none hover:bg-muted/35",
              })
            )}
          >
            <CalendarIcon className="size-[18px]" strokeWidth={1.75} />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="px-7 pb-1">
        {meetings.length > 0 ? (
          <>
            <div className="space-y-3">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="rounded-xl border border-foreground/10 bg-card px-4 py-3.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 truncate text-base font-bold text-foreground">
                      {meeting.title}
                    </p>
                    <Link
                      href={meeting.joinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-md p-0.5 text-foreground/60 transition-colors hover:text-foreground"
                      aria-label={`Join ${meeting.title}`}
                    >
                      <ArrowUpRightIcon className="size-4" strokeWidth={1.75} />
                    </Link>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs font-normal text-foreground">{meeting.time}</span>
                    <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                      <MeetingProviderMark provider={meeting.provider} />
                      {meeting.provider}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href={INTEGRATIONS_SETTINGS_HREF}
              className="mt-2 inline-flex h-auto items-center gap-1 bg-transparent px-0 py-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Manage calendar sync
              <ChevronRightIcon className="size-4" />
            </Link>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-foreground/15 bg-card/40 px-4 py-8 text-center">
            <CalendarIcon
              className="mx-auto mb-3 size-8 text-muted-foreground/50"
              strokeWidth={1.5}
              aria-hidden
            />
            <p className="text-sm text-muted-foreground">
              Connect Google Calendar to see today&apos;s meetings.
            </p>
            <Link
              href={INTEGRATIONS_SETTINGS_HREF}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-4 h-9 border-border/80 bg-card px-4 shadow-none"
              )}
            >
              Connect Google Calendar
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
