"use client"

import * as React from "react"
import { ChevronDownIcon, Trash2Icon, XIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BOARD_COLUMN_LABELS, type WorkItemStatus } from "@/lib/status"
import { getInitials, withMeLabel } from "@/lib/format"
import {
  getIssueAssignees,
  type IssuePriority,
} from "@/lib/issues-data"

const statusValues: WorkItemStatus[] = ["todo", "in_progress", "in_review", "completed"]
const priorityValues: { value: IssuePriority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

function MenuButton({ label }: { label: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="h-9 w-full gap-1.5 px-2.5 font-normal text-foreground hover:bg-muted/40 sm:h-8 sm:w-auto"
    >
      {label}
      <ChevronDownIcon className="size-3.5 opacity-60" strokeWidth={2} />
    </Button>
  )
}

export function BulkActionBar({
  count,
  onClear,
  onSetStatus,
  onSetPriority,
  onSetAssignee,
  onDelete,
}: {
  count: number
  onClear: () => void
  onSetStatus: (status: WorkItemStatus) => void
  onSetPriority: (priority: IssuePriority) => void
  onSetAssignee: (assigneeId: string) => void
  onDelete: () => void
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--mobile-tab-bar)+0.5rem)] z-50 flex justify-center px-3 md:bottom-6 md:px-4">
      <div className="pointer-events-auto flex w-full max-w-lg flex-col gap-2 rounded-2xl border border-border/60 bg-popover p-2 text-sm text-popover-foreground shadow-[0_8px_30px_rgba(15,23,42,0.18)] sm:w-auto sm:max-w-full sm:flex-row sm:flex-wrap sm:items-center sm:rounded-full sm:py-1.5 sm:pr-1.5 sm:pl-3">
        <div className="flex items-center justify-between gap-2 px-1 sm:contents">
          <span className="font-medium tabular-nums sm:mr-1">
            {count} selected
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Clear selection"
            className="size-8 sm:order-last"
            onClick={onClear}
          >
            <XIcon className="size-4" strokeWidth={2} />
          </Button>
        </div>

        <span className="mx-1 hidden h-5 w-px bg-border/70 sm:block" aria-hidden />

        <div className="grid grid-cols-3 gap-1 sm:flex sm:items-center">
          <DropdownMenu>
            <DropdownMenuTrigger render={<MenuButton label="Status" />} />
            <DropdownMenuContent align="center" className="min-w-[12rem]">
              {statusValues.map((s) => (
                <DropdownMenuItem key={s} onClick={() => onSetStatus(s)}>
                  {BOARD_COLUMN_LABELS[s]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger render={<MenuButton label="Priority" />} />
            <DropdownMenuContent align="center" className="min-w-[12rem]">
              {priorityValues.map((p) => (
                <DropdownMenuItem key={p.value} onClick={() => onSetPriority(p.value)}>
                  {p.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger render={<MenuButton label="Assignee" />} />
            <DropdownMenuContent align="center" className="min-w-[13rem]">
              {getIssueAssignees().map((member) => (
                <DropdownMenuItem
                  key={member.id}
                  onClick={() => onSetAssignee(member.id)}
                >
                  <span className="inline-flex items-center gap-2">
                    <Avatar className="size-5 ring-0" title={member.name}>
                      <AvatarImage src={member.avatarUrl} alt="" />
                      <AvatarFallback className="text-[9px] font-semibold">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    {withMeLabel(member.id, member.name)}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <span className="mx-1 hidden h-5 w-px bg-border/70 sm:block" aria-hidden />

        <Button
          type="button"
          variant="ghost"
          className="h-9 w-full gap-1.5 px-2.5 font-normal text-destructive hover:bg-destructive/10 hover:text-destructive sm:h-8 sm:w-auto"
          onClick={onDelete}
        >
          <Trash2Icon className="size-4" strokeWidth={1.75} />
          Delete
        </Button>
      </div>
    </div>
  )
}
