"use client"

import * as React from "react"

import { getCurrentUserWithPatch, subscribeStore, type UserProfilePatch } from "@/lib/client-store"
import type { TeamMember } from "@/lib/team-data"

export function useCurrentUser(): TeamMember {
  const [user, setUser] = React.useState<TeamMember>(() => getCurrentUserWithPatch())

  React.useEffect(() => {
    return subscribeStore(() => setUser(getCurrentUserWithPatch()))
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

export type { UserProfilePatch }
