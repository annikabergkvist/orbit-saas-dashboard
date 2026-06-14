"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { BOARD_COLUMN_LABELS, type WorkItemStatus } from "@/lib/status"
import {
  CURRENT_USER,
  getAssignee,
  issueAssignees,
  issueProjects,
  type Issue,
  type IssuePriority,
} from "@/lib/issues-data"

export type NewIssueValues = Omit<Issue, "id" | "comments">

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

/** "YYYY-MM-DD" -> "Mon D" (the seed dueLabel format parseDueLabel understands). */
function toDueLabel(value: string): string {
  if (!value) return "—"
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function todayLabel(): string {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </span>
  )
}

function SelectField({
  label,
  current,
  children,
}: {
  label: string
  current: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="h-9 w-full justify-between gap-1.5 border-border/80 bg-card px-3 font-normal shadow-none"
            >
              <span className="inline-flex min-w-0 items-center gap-2 truncate">{current}</span>
              <ChevronDownIcon className="size-4 shrink-0 opacity-60" strokeWidth={2} />
            </Button>
          }
        />
        <DropdownMenuContent align="start" className="min-w-[13rem]">
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function NewIssueDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (values: NewIssueValues) => void
}) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [status, setStatus] = React.useState<WorkItemStatus>("todo")
  const [priority, setPriority] = React.useState<IssuePriority>("medium")
  const [assigneeId, setAssigneeId] = React.useState(CURRENT_USER.id)
  const [projectSlug, setProjectSlug] = React.useState(issueProjects[0]?.slug ?? "")
  const [dueDate, setDueDate] = React.useState("")

  // Reset the form each time the dialog opens.
  React.useEffect(() => {
    if (open) {
      setTitle("")
      setDescription("")
      setStatus("todo")
      setPriority("medium")
      setAssigneeId(CURRENT_USER.id)
      setProjectSlug(issueProjects[0]?.slug ?? "")
      setDueDate("")
    }
  }, [open])

  const assignee = getAssignee(assigneeId)
  const projectTitle =
    issueProjects.find((p) => p.slug === projectSlug)?.title ?? "Select project"
  const canSubmit = title.trim() !== ""

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onCreate({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assigneeId,
      projectSlug,
      dueLabel: toDueLabel(dueDate),
      createdLabel: todayLabel(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>New issue</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 pb-2">
            <div className="space-y-1.5">
              <FieldLabel>Title</FieldLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short, descriptive summary"
                autoFocus
                className="h-9 border-border/80 bg-card shadow-none"
                aria-label="Issue title"
              />
            </div>

            <div className="space-y-1.5">
              <FieldLabel>Description</FieldLabel>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Add more detail..."
                className="w-full resize-y rounded-md border border-border/80 bg-card px-3 py-2 text-sm leading-relaxed text-foreground shadow-none outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Status" current={BOARD_COLUMN_LABELS[status]}>
                <DropdownMenuRadioGroup
                  value={status}
                  onValueChange={(v) => setStatus(v as WorkItemStatus)}
                >
                  {statusValues.map((s) => (
                    <DropdownMenuRadioItem key={s} value={s}>
                      {BOARD_COLUMN_LABELS[s]}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </SelectField>

              <SelectField
                label="Priority"
                current={priorityValues.find((p) => p.value === priority)?.label}
              >
                <DropdownMenuRadioGroup
                  value={priority}
                  onValueChange={(v) => setPriority(v as IssuePriority)}
                >
                  {priorityValues.map((p) => (
                    <DropdownMenuRadioItem key={p.value} value={p.value}>
                      {p.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </SelectField>

              <SelectField
                label="Assignee"
                current={
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
                }
              >
                <DropdownMenuRadioGroup
                  value={assigneeId}
                  onValueChange={(v) => setAssigneeId(v)}
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
              </SelectField>

              <SelectField label="Project" current={<span className="truncate">{projectTitle}</span>}>
                <DropdownMenuRadioGroup
                  value={projectSlug}
                  onValueChange={(v) => setProjectSlug(v)}
                >
                  {issueProjects.map((project) => (
                    <DropdownMenuRadioItem key={project.slug} value={project.slug}>
                      {project.title}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </SelectField>

              <div className="space-y-1.5">
                <FieldLabel>Due date</FieldLabel>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={cn(
                    "h-9 border-border/80 bg-card shadow-none",
                    !dueDate && "text-muted-foreground"
                  )}
                  aria-label="Due date"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              Create issue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
