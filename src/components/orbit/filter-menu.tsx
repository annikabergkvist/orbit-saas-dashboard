"use client"

import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const ANY = "__any__"

export function FilterMenu({
  label,
  value,
  options,
  onChange,
  allowClear = true,
}: {
  label: string
  value: string | null
  options: { value: string; label: string }[]
  onChange: (value: string | null) => void
  /** When false, the menu has no "Any" reset item and always keeps a value (e.g. Sort). */
  allowClear?: boolean
}) {
  const current = options.find((o) => o.value === value)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-9 w-full min-w-0 shrink-0 gap-1.5 border-border/80 bg-card px-3 font-normal shadow-none sm:w-auto",
              current && "border-primary/40 text-foreground"
            )}
          >
            <span className="shrink-0 text-muted-foreground">{label}:</span>
            <span className="truncate">{current ? current.label : "Any"}</span>
            <ChevronDownIcon className="size-4 opacity-60" strokeWidth={2} />
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="min-w-[12rem]">
        <DropdownMenuRadioGroup
          value={value ?? ANY}
          onValueChange={(v) => onChange(v === ANY ? null : v)}
        >
          {allowClear ? (
            <DropdownMenuRadioItem value={ANY}>Any {label.toLowerCase()}</DropdownMenuRadioItem>
          ) : null}
          {options.map((o) => (
            <DropdownMenuRadioItem key={o.value} value={o.value}>
              {o.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
