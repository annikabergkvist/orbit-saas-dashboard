"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { buildSearchIndex, filterSearchIndex, type SearchItem } from "@/lib/search-index"
import { cn } from "@/lib/utils"

export function HeaderAppSearch({
  className,
  triggerClassName,
  open,
  onOpenChange,
}: {
  className?: string
  triggerClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const router = useRouter()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [activeIndex, setActiveIndex] = React.useState(0)

  const isOpen = open ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  const index = React.useMemo(() => buildSearchIndex(), [])
  const results = React.useMemo(() => filterSearchIndex(query, index), [query, index])
  const showResults = isOpen && query.trim().length > 0 && results.length > 0

  React.useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, setOpen])

  React.useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  React.useEffect(() => {
    setActiveIndex(0)
  }, [query])

  function navigate(item: SearchItem) {
    setOpen(false)
    setQuery("")
    router.push(item.href)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
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
    <div ref={containerRef} className={cn("relative flex flex-row-reverse items-center", className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("size-9 shrink-0 rounded-full", triggerClassName)}
        aria-label={isOpen ? "Close search" : "Open search"}
        aria-expanded={isOpen}
        onClick={() => setOpen(!isOpen)}
      >
        <SearchIcon className="size-5" strokeWidth={1.75} />
      </Button>

      <div
        className={cn(
          "dashboard-header-search flex h-10 items-center overflow-hidden rounded-full transition-[width] duration-200 ease-in-out",
          isOpen ? "w-[240px]" : "w-0"
        )}
      >
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search… ⌘K"
          aria-label="Search Orbit"
          tabIndex={isOpen ? 0 : -1}
          className="h-full w-[240px] shrink-0 bg-transparent px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>

      {showResults ? (
        <div className="absolute top-full right-0 z-50 mt-2 w-[min(100vw-2rem,320px)] overflow-hidden rounded-xl border border-border/60 bg-popover shadow-xl">
          <ul className="max-h-72 overflow-y-auto p-1" role="listbox">
            {results.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    index === activeIndex
                      ? "bg-primary/10 text-foreground"
                      : "hover:bg-muted/60"
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
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export function useHeaderSearchShortcut(onOpen: () => void) {
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        onOpen()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onOpen])
}
