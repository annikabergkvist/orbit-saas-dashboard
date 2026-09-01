"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

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
import type {
  NewProjectValues,
  ProjectPriority,
  ProjectType,
} from "@/lib/projects-data"

const typeOptions: { value: ProjectType; label: string }[] = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "documentation", label: "Documentation" },
]

const priorityOptions: { value: ProjectPriority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

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
              className="h-9 w-full justify-between border-border/80 bg-card px-3 font-normal shadow-none"
            />
          }
        >
          <span className="truncate">{current}</span>
          <ChevronDownIcon className="size-4 shrink-0 opacity-60" strokeWidth={2} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[var(--anchor-width)]">
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function NewProjectDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (values: NewProjectValues) => void
}) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [type, setType] = React.useState<ProjectType>("development")
  const [priority, setPriority] = React.useState<ProjectPriority>("medium")

  // Reset the form each time the dialog opens (adjust state during render,
  // guarded on the open transition, rather than in an effect).
  const [wasOpen, setWasOpen] = React.useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setTitle("")
      setDescription("")
      setType("development")
      setPriority("medium")
    }
  }

  const canSubmit = title.trim().length > 0

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmit) return
    onCreate({ title, description, type, priority })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 pb-2">
            <div className="space-y-1.5">
              <FieldLabel>Title</FieldLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Project name"
                autoFocus
                className="h-9 border-border/80 bg-card shadow-none"
                aria-label="Project title"
              />
            </div>

            <div className="space-y-1.5">
              <FieldLabel>Description</FieldLabel>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="What is this project about?"
                className="w-full resize-y rounded-md border border-border/80 bg-card px-3 py-2 text-sm leading-relaxed text-foreground shadow-none outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SelectField
                label="Type"
                current={typeOptions.find((option) => option.value === type)?.label}
              >
                <DropdownMenuRadioGroup
                  value={type}
                  onValueChange={(value) => setType(value as ProjectType)}
                >
                  {typeOptions.map((option) => (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </SelectField>

              <SelectField
                label="Priority"
                current={priorityOptions.find((option) => option.value === priority)?.label}
              >
                <DropdownMenuRadioGroup
                  value={priority}
                  onValueChange={(value) => setPriority(value as ProjectPriority)}
                >
                  {priorityOptions.map((option) => (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </SelectField>
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
              Create project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
