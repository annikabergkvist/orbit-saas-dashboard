"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getAuthSession, setAuthSession } from "@/lib/client-store"
import { getCurrentUser } from "@/lib/team-data"

export default function LoginPage() {
  const router = useRouter()
  const user = React.useMemo(() => getCurrentUser(), [])
  const [email, setEmail] = React.useState(user.email)
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (getAuthSession()) router.replace("/")
  }, [router])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError("Enter your email to continue.")
      return
    }

    setAuthSession({
      email: email.trim(),
      signedInAt: new Date().toISOString(),
    })
    router.replace("/")
  }

  return (
    <div className="dashboard-mesh-gradient flex min-h-svh items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card/80 p-8 shadow-xl backdrop-blur-md">
        <div className="mb-8 space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Orbit</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Demo sign-in — use any password to enter the workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 border-border/80 bg-background shadow-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Any password works in demo"
              className="h-10 border-border/80 bg-background shadow-none"
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" className="h-10 w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}
