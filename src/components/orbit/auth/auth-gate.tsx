"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { OrbitBootLoader } from "@/components/orbit/orbit-boot-loader"
import { getAuthSession } from "@/lib/client-store"

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = React.useState(false)

  // The session lives in localStorage, which is only readable client-side,
  // so this check (and the resulting redirect/reveal) must happen post-mount.
  React.useEffect(() => {
    if (!getAuthSession()) {
      router.replace("/login")
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true)
  }, [router])

  if (!ready) {
    return <OrbitBootLoader />
  }

  return <>{children}</>
}
