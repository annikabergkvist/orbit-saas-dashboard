"use client"

import * as React from "react"

import { STORAGE_KEYS } from "@/lib/storage-keys"

/** Applies persisted appearance prefs on first load (before visiting Settings). */
export function AppearancePreferencesInit() {
  React.useEffect(() => {
    const compact = window.localStorage.getItem(STORAGE_KEYS.densityCompact) === "true"
    const reduceMotion = window.localStorage.getItem(STORAGE_KEYS.reduceMotion) === "true"

    if (compact) {
      document.documentElement.setAttribute("data-density", "compact")
    } else {
      document.documentElement.removeAttribute("data-density")
    }

    if (reduceMotion) {
      document.documentElement.setAttribute("data-reduce-motion", "true")
    } else {
      document.documentElement.removeAttribute("data-reduce-motion")
    }
  }, [])

  return null
}
