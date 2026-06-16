"use client"

import * as React from "react"
import Link from "next/link"
import { Dialog } from "@base-ui/react/dialog"
import { MailIcon, MessageCircleIcon, XIcon } from "lucide-react"

import { IssuePriorityBars, IssueStatusIcon } from "@/components/orbit/issues/issue-badges"
import { PresenceDot } from "@/components/orbit/team/presence-dot"
import { WorkloadBar } from "@/components/orbit/team/workload-bar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  getProjectTitle,
  presenceLabel,
  type EnrichedTeamMember,
} from "@/lib/team-data"

function memberInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </span>
  )
}

function PanelBody({ member }: { member: EnrichedTeamMember }) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <Avatar className="size-14 ring-0">
            <AvatarImage src={member.avatarUrl} alt="" />
            <AvatarFallback className="text-sm font-semibold">
              {memberInitials(member.name)}
            </AvatarFallback>
          </Avatar>
          <PresenceDot presence={member.presence} ringClassName="ring-popover" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-foreground">{member.name}</h2>
          <p className="text-sm text-muted-foreground">{member.role}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{member.email}</p>
          <p className="mt-1 text-xs text-muted-foreground">{presenceLabel(member.presence)}</p>
        </div>
      </div>

      <div className="mt-6">
        <WorkloadBar activeCount={member.activeTaskCount} level={member.workload} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <FieldLabel>Active tasks</FieldLabel>
          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {member.activeTaskCount}
          </p>
        </div>
        <div className="space-y-1">
          <FieldLabel>Completed</FieldLabel>
          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {member.completedTaskCount}
          </p>
        </div>
      </div>

      {member.projectSlugs.length > 0 ? (
        <div className="mt-6 space-y-2">
          <FieldLabel>Projects</FieldLabel>
          <div className="flex flex-wrap gap-1.5">
            {member.projectSlugs.map((slug) => (
              <Link
                key={slug}
                href={`/projects/${slug}`}
                className="inline-flex items-center rounded-md border border-foreground/10 bg-foreground/[0.03] px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
              >
                {getProjectTitle(slug)}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <FieldLabel>Active tasks</FieldLabel>
          {member.activeTaskCount > 0 ? (
            <Link
              href={`/issues?assignee=${member.id}`}
              className="text-xs font-medium text-primary hover:underline"
            >
              View in Issues
            </Link>
          ) : null}
        </div>
        {member.activeIssues.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active tasks right now.</p>
        ) : (
          <ul className="divide-y divide-foreground/[0.06] overflow-hidden rounded-lg border border-border/60">
            {member.activeIssues.map((issue) => (
              <li key={issue.id} className="flex items-center gap-2.5 px-3 py-2.5">
                <IssueStatusIcon status={issue.status} className="size-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{issue.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {issue.id} · {getProjectTitle(issue.projectSlug)}
                  </p>
                </div>
                <IssuePriorityBars priority={issue.priority} className="shrink-0" />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-t border-border/60 pt-5">
        <Button
          type="button"
          variant="outline"
          nativeButton={false}
          className="gap-1.5"
          render={<Link href={`/messages?member=${member.id}`} />}
        >
          <MessageCircleIcon className="size-4" strokeWidth={1.75} />
          Message
        </Button>
        <Button
          type="button"
          variant="outline"
          nativeButton={false}
          className="gap-1.5"
          render={<a href={`mailto:${member.email}`} />}
        >
          <MailIcon className="size-4" strokeWidth={1.75} />
          Email
        </Button>
      </div>
    </div>
  )
}

export function TeamDetailPanel({
  member,
  open,
  onClose,
}: {
  member: EnrichedTeamMember | null
  open: boolean
  onClose: () => void
}) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
      modal={false}
      disablePointerDismissal
    >
      <Dialog.Portal>
        <Dialog.Popup
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col overflow-hidden",
            "border-l border-border/60 bg-popover text-popover-foreground",
            "shadow-[0_8px_40px_rgba(15,23,42,0.18)] outline-none",
            "transition-transform duration-300 ease-out",
            "data-starting-style:translate-x-full data-ending-style:translate-x-full",
            "sm:w-[40vw] sm:min-w-[24rem] sm:max-w-[36rem]"
          )}
        >
          {member ? (
            <>
              <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border/60 px-5 py-3">
                <Dialog.Title className="text-sm font-medium text-foreground">
                  Team member
                </Dialog.Title>
                <Dialog.Close
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Close panel"
                      className="size-8 shrink-0"
                    />
                  }
                >
                  <XIcon className="size-4" strokeWidth={2} />
                </Dialog.Close>
              </header>
              <PanelBody key={member.id} member={member} />
            </>
          ) : null}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
