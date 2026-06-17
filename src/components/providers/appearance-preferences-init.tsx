"use client"

import * as React from "react"

const COMPACT_KEY = "orbit-density-compact"
const REDUCE_MOTION_KEY = "orbit-reduce-motion"

/** Applies persisted appearance prefs on first load (before visiting Settings). */
export function AppearancePreferencesInit() {
  React.useEffect(() => {
    const compact = window.localStorage.getItem(COMPACT_KEY) === "true"
    const reduceMotion = window.localStorage.getItem(REDUCE_MOTION_KEY) === "true"

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
