"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import {
  SettingsSection,
  SettingsToggleRow,
} from "@/components/orbit/settings/settings-section"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type ThemeChoice = "light" | "dark" | "system"

const COMPACT_KEY = "orbit-density-compact"
const REDUCE_MOTION_KEY = "orbit-reduce-motion"

const themeOptions: {
  id: ThemeChoice
  label: string
  previewClassName: string
}[] = [
  {
    id: "light",
    label: "Light",
    previewClassName: "bg-white border border-border/80",
  },
  {
    id: "dark",
    label: "Dark",
    previewClassName: "bg-zinc-900 border border-zinc-700",
  },
  {
    id: "system",
    label: "System",
    previewClassName: "border border-border/80 bg-gradient-to-r from-white to-zinc-900",
  },
]

function readStoredBoolean(key: string, fallback: boolean) {
  if (typeof window === "undefined") return fallback
  const value = window.localStorage.getItem(key)
  if (value == null) return fallback
  return value === "true"
}

export function AppearanceSection() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [compactMode, setCompactMode] = React.useState(false)
  const [reduceMotion, setReduceMotion] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    setCompactMode(readStoredBoolean(COMPACT_KEY, false))
    setReduceMotion(readStoredBoolean(REDUCE_MOTION_KEY, false))
  }, [])

  React.useEffect(() => {
    if (!mounted) return
    if (compactMode) {
      document.documentElement.setAttribute("data-density", "compact")
    } else {
      document.documentElement.removeAttribute("data-density")
    }
    window.localStorage.setItem(COMPACT_KEY, String(compactMode))
  }, [compactMode, mounted])

  React.useEffect(() => {
    if (!mounted) return
    if (reduceMotion) {
      document.documentElement.setAttribute("data-reduce-motion", "true")
    } else {
      document.documentElement.removeAttribute("data-reduce-motion")
    }
    window.localStorage.setItem(REDUCE_MOTION_KEY, String(reduceMotion))
  }, [reduceMotion, mounted])

  const activeTheme = (theme ?? "light") as ThemeChoice

  return (
    <SettingsSection
      title="Appearance"
      description="Customize how Orbit looks for you."
    >
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Theme</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {themeOptions.map((option) => {
            const selected = mounted && activeTheme === option.id
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setTheme(option.id)}
                className={cn(
                  "flex flex-col gap-2 rounded-xl border p-3 text-left transition-colors",
                  selected
                    ? "border-primary ring-1 ring-primary/30"
                    : "border-border/70 hover:border-border"
                )}
              >
                <span
                  className={cn(
                    "h-16 w-full rounded-md",
                    option.previewClassName
                  )}
                  aria-hidden
                />
                <span
                  className={cn(
                    "text-sm",
                    selected ? "font-semibold text-foreground" : "text-muted-foreground"
                  )}
                >
                  {option.label}
                </span>
              </button>
            )
          })}
        </div>
        {mounted && activeTheme === "system" ? (
          <p className="text-xs text-muted-foreground">
            Currently using {resolvedTheme === "dark" ? "dark" : "light"} mode from your system.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col">
        <SettingsToggleRow
          title="Compact mode"
          description="Reduce spacing for a denser layout."
        >
          <Switch
            checked={compactMode}
            onCheckedChange={setCompactMode}
            aria-label="Compact mode"
          />
        </SettingsToggleRow>
        <SettingsToggleRow
          title="Reduce motion"
          description="Minimize animations and transitions."
        >
          <Switch
            checked={reduceMotion}
            onCheckedChange={setReduceMotion}
            aria-label="Reduce motion"
          />
        </SettingsToggleRow>
      </div>
    </SettingsSection>
  )
}
