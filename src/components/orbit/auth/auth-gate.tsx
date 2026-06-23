"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { getAuthSession } from "@/lib/client-store"

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    if (!getAuthSession()) {
      router.replace("/login")
      return
    }
    setReady(true)
  }, [router])

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-transparent">
        <p className="text-sm text-muted-foreground">Loading Orbit…</p>
      </div>
    )
  }

  return <>{children}</>
}
