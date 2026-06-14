"use client"

import * as React from "react"
import Link from "next/link"
import { Dialog } from "@base-ui/react/dialog"
import { CalendarIcon, ChevronDownIcon, SendHorizontalIcon, XIcon } from "lucide-react"

import {
  IssuePriorityBadge,
  IssueStatusBadge,
} from "@/components/orbit/issues/issue-badges"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { BOARD_COLUMN_LABELS, type WorkItemStatus } from "@/lib/status"
import {
  CURRENT_USER,
  getAssignee,
  getProjectTitle,
  isIssueOverdue,
  issueAssignees,
  type Issue,
  type IssuePriority,
} from "@/lib/issues-data"

const statusValues: WorkItemStatus[] = ["todo", "in_progress", "in_review", "completed"]
const priorityValues: { value: IssuePriority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

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

function menuTrigger(children: React.ReactNode) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-9 w-full justify-between gap-1.5 border-border/80 bg-card px-3 font-normal shadow-none"
    >
      <span className="inline-flex min-w-0 items-center gap-2">{children}</span>
      <ChevronDownIcon className="size-4 shrink-0 opacity-60" strokeWidth={2} />
    </Button>
  )
}

function PanelBody({
  issue,
  onUpdate,
  onAddComment,
}: {
  issue: Issue
  onUpdate: (patch: Partial<Issue>) => void
  onAddComment: (body: string) => void
}) {
  const [draft, setDraft] = React.useState("")
  const assignee = getAssignee(issue.assigneeId)
  const overdue = isIssueOverdue(issue)

  const submitComment = () => {
    const body = draft.trim()
    if (!body) return
    onAddComment(body)
    setDraft("")
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
        {/* Title */}
        <input
          value={issue.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          aria-label="Issue title"
          className="w-full rounded-md bg-transparent px-1 py-1 text-xl font-semibold tracking-tight text-foreground outline-none transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/40"
        />

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <FieldLabel>Status</FieldLabel>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={menuTrigger(
                  <>
                    <IssueStatusBadge status={issue.status} />
                    {overdue ? <IssueStatusBadge status="overdue" /> : null}
                  </>
                )}
              />
              <DropdownMenuContent align="start" className="min-w-[12rem]">
                <DropdownMenuRadioGroup
                  value={issue.status}
                  onValueChange={(v) => onUpdate({ status: v as WorkItemStatus })}
                >
                  {statusValues.map((s) => (
                    <DropdownMenuRadioItem key={s} value={s}>
                      {BOARD_COLUMN_LABELS[s]}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-1.5">
            <FieldLabel>Priority</FieldLabel>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={menuTrigger(<IssuePriorityBadge priority={issue.priority} />)}
              />
              <DropdownMenuContent align="start" className="min-w-[12rem]">
                <DropdownMenuRadioGroup
                  value={issue.priority}
                  onValueChange={(v) => onUpdate({ priority: v as IssuePriority })}
                >
                  {priorityValues.map((p) => (
                    <DropdownMenuRadioItem key={p.value} value={p.value}>
                      {p.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-1.5">
            <FieldLabel>Assignee</FieldLabel>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={menuTrigger(
                  assignee ? (
                    <>
                      <Avatar className="size-5 ring-0" title={assignee.name}>
                        <AvatarImage src={assignee.avatarUrl} alt="" />
                        <AvatarFallback className="text-[9px] font-semibold">
                          {memberInitials(assignee.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{assignee.name}</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )
                )}
              />
              <DropdownMenuContent align="start" className="min-w-[13rem]">
                <DropdownMenuRadioGroup
                  value={issue.assigneeId}
                  onValueChange={(v) => onUpdate({ assigneeId: v })}
                >
                  {issueAssignees.map((member) => (
                    <DropdownMenuRadioItem key={member.id} value={member.id}>
                      <span className="inline-flex items-center gap-2">
                        <Avatar className="size-5 ring-0" title={member.name}>
                          <AvatarImage src={member.avatarUrl} alt="" />
                          <AvatarFallback className="text-[9px] font-semibold">
                            {memberInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        {member.id === CURRENT_USER.id ? `${member.name} (Me)` : member.name}
                      </span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-1.5">
            <FieldLabel>Project</FieldLabel>
            <Link
              href={`/projects/${issue.projectSlug}`}
              className="inline-flex h-9 w-full items-center rounded-md border border-border/80 bg-card px-3 text-sm text-foreground transition-colors hover:bg-muted/40"
            >
              <span className="truncate">{getProjectTitle(issue.projectSlug)}</span>
            </Link>
          </div>

          <div className="space-y-1">
            <FieldLabel>Due date</FieldLabel>
            <div
              className={cn(
                "flex items-center gap-1.5 text-sm",
                overdue ? "font-medium text-[var(--status-overdue-foreground)]" : "text-foreground"
              )}
            >
              <CalendarIcon className="size-4 shrink-0" strokeWidth={1.75} />
              {issue.dueLabel}
            </div>
          </div>

          <div className="space-y-1">
            <FieldLabel>Created</FieldLabel>
            <div className="flex items-center text-sm text-muted-foreground">
              {issue.createdLabel}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <FieldLabel>Description</FieldLabel>
          <textarea
            value={issue.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={4}
            placeholder="Add description..."
            className="w-full resize-y whitespace-pre-wrap rounded-md border border-border/80 bg-card px-3 py-2 text-sm leading-relaxed text-foreground shadow-none outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>

        {/* Comments */}
        <div className="space-y-3">
          <FieldLabel>Comments ({issue.comments.length})</FieldLabel>
          <div className="space-y-3">
            {issue.comments.map((comment) => {
              const author = getAssignee(comment.authorId)
              return (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="size-8 shrink-0 ring-0" title={author?.name}>
                    <AvatarImage src={author?.avatarUrl} alt="" />
                    <AvatarFallback className="text-[10px] font-semibold">
                      {author ? memberInitials(author.name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 rounded-xl border border-foreground/10 bg-card px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {author?.name ?? "Unknown"}
                      </span>
                      <span className="text-xs text-muted-foreground">{comment.timeLabel}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                      {comment.body}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Add comment */}
      <div className="shrink-0 border-t border-border/60 p-4">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault()
                submitComment()
              }
            }}
            rows={1}
            placeholder="Write a comment..."
            aria-label="Write a comment"
            className="min-h-9 w-full resize-none rounded-md border border-border/80 bg-card px-3 py-2 text-sm text-foreground shadow-none outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <Button
            type="button"
            size="icon"
            onClick={submitComment}
            disabled={!draft.trim()}
            aria-label="Add comment"
            className="size-9 shrink-0"
          >
            <SendHorizontalIcon className="size-4" strokeWidth={2} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function IssueDetailPanel({
  issue,
  open,
  onClose,
  onUpdate,
  onAddComment,
}: {
  issue: Issue | null
  open: boolean
  onClose: () => void
  onUpdate: (patch: Partial<Issue>) => void
  onAddComment: (body: string) => void
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
          {issue ? (
            <>
              <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border/60 px-5 py-3">
                <Dialog.Title className="text-xs font-medium tabular-nums text-muted-foreground">
                  {issue.id}
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
              <PanelBody
                key={issue.id}
                issue={issue}
                onUpdate={onUpdate}
                onAddComment={onAddComment}
              />
            </>
          ) : null}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
