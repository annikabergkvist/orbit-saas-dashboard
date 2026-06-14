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
import {
  CURRENT_USER,
  issueAssignees,
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

function MenuButton({ label }: { label: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="h-8 gap-1.5 px-2.5 font-normal text-foreground hover:bg-muted"
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
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-border/60 bg-popover py-1.5 pr-1.5 pl-3 text-sm text-popover-foreground shadow-[0_8px_30px_rgba(15,23,42,0.18)]">
        <span className="mr-1 font-medium tabular-nums">
          {count} selected
        </span>

        <span className="mx-1 h-5 w-px bg-border/70" aria-hidden />

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
            {issueAssignees.map((member) => (
              <DropdownMenuItem
                key={member.id}
                onClick={() => onSetAssignee(member.id)}
              >
                <span className="inline-flex items-center gap-2">
                  <Avatar className="size-5 ring-0" title={member.name}>
                    <AvatarImage src={member.avatarUrl} alt="" />
                    <AvatarFallback className="text-[9px] font-semibold">
                      {memberInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  {member.id === CURRENT_USER.id ? `${member.name} (Me)` : member.name}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="mx-1 h-5 w-px bg-border/70" aria-hidden />

        <Button
          type="button"
          variant="ghost"
          className="h-8 gap-1.5 px-2.5 font-normal text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2Icon className="size-4" strokeWidth={1.75} />
          Delete
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Clear selection"
          className="size-8"
          onClick={onClear}
        >
          <XIcon className="size-4" strokeWidth={2} />
        </Button>
      </div>
    </div>
  )
}
