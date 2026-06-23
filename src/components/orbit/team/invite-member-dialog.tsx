"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InviteMemberDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [email, setEmail] = React.useState("")
  const [sent, setSent] = React.useState(false)

  React.useEffect(() => {
    if (!open) {
      setEmail("")
      setSent(false)
    }
  }, [open])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!email.trim()) return
    setSent(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite team member</DialogTitle>
          <DialogDescription>
            Send a workspace invite by email. Invites are simulated in this demo.
          </DialogDescription>
        </DialogHeader>
        {sent ? (
          <p className="px-5 pb-5 text-sm text-muted-foreground">
            Invite sent to <span className="font-medium text-foreground">{email}</span>.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 pb-5">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email address</Label>
              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="h-10 border-border/80 bg-card shadow-none"
              />
            </div>
            <DialogFooter className="px-0 pb-0">
              <Button type="submit" className="h-9 px-4">
                Send invite
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
