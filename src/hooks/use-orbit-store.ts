"use client"

import * as React from "react"

import { getCurrentUser, subscribeStore } from "@/lib/client-store"
import type { TeamMember } from "@/lib/team-data"

export function useCurrentUser(): TeamMember {
  const [user, setUser] = React.useState<TeamMember>(() => getCurrentUser())

  React.useEffect(() => {
    return subscribeStore(() => setUser(getCurrentUser()))
  }, [])

  return user
}

export function useStoreValue<T>(read: () => T): T {
  const [value, setValue] = React.useState(read)

  React.useEffect(() => {
    return subscribeStore(() => setValue(read()))
  }, [read])

  return value
}
