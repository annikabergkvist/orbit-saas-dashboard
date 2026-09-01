"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Theme is only known client-side (next-themes reads it post-hydration), so
  // this mount flag is required to avoid a hydration mismatch / theme flash.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("relative size-9 rounded-full", className)}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <SunIcon
        className="size-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0"
        strokeWidth={1.75}
        aria-hidden
      />
      <MoonIcon
        className="absolute size-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"
        strokeWidth={1.75}
        aria-hidden
      />
    </Button>
  )
}
