"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { buildSearchIndex, filterSearchIndex, type SearchItem } from "@/lib/search-index"
import { cn } from "@/lib/utils"

type OrbitCommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrbitCommandPalette({ open, onOpenChange }: OrbitCommandPaletteProps) {
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [query, setQuery] = React.useState("")
  const [activeIndex, setActiveIndex] = React.useState(0)

  const index = React.useMemo(() => buildSearchIndex(), [])
  const results = React.useMemo(() => filterSearchIndex(query, index), [query, index])

  React.useEffect(() => {
    if (!open) {
      setQuery("")
      setActiveIndex(0)
      return
    }
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open])

  React.useEffect(() => {
    setActiveIndex(0)
  }, [query])

  function navigate(item: SearchItem) {
    onOpenChange(false)
    router.push(item.href)
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault()
      navigate(results[activeIndex])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 p-0" showCloseButton>
        <DialogHeader className="border-b border-border/60 px-4 py-3">
          <DialogTitle className="sr-only">Search Orbit</DialogTitle>
          <DialogDescription className="sr-only">
            Search pages, projects, issues, and team members
          </DialogDescription>
          <div className="relative">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
            />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search pages, projects, issues, team…"
              className="h-10 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
              aria-label="Search"
            />
          </div>
        </DialogHeader>
        <ul className="max-h-[min(60vh,320px)] overflow-y-auto p-2" role="listbox">
          {results.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-muted-foreground">No results</li>
          ) : (
            results.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    index === activeIndex
                      ? "bg-primary/10 text-foreground"
                      : "text-foreground hover:bg-muted/60"
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => navigate(item)}
                >
                  <span className="min-w-0 truncate font-medium">{item.label}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {item.hint ?? item.group}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </DialogContent>
    </Dialog>
  )
}

export function useCommandPalette() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return { open, setOpen }
}
