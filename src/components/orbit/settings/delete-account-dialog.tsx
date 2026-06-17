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

type DeleteAccountDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  confirmEmail: string
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
  confirmEmail,
}: DeleteAccountDialogProps) {
  const [confirmation, setConfirmation] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  const matches =
    confirmation.trim().toLowerCase() === confirmEmail.trim().toLowerCase()

  React.useEffect(() => {
    if (!open) {
      setConfirmation("")
      setSubmitted(false)
    }
  }, [open])

  function handleDelete(event: React.FormEvent) {
    event.preventDefault()
    if (!matches) return
    // NOTE: Account deletion is disabled for portfolio scope.
    // In production this would verify credentials, revoke sessions, and queue account removal.
    setSubmitted(true)
    window.setTimeout(() => onOpenChange(false), 1200)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription>
            This action is permanent. All your issues, comments, and workspace data
            will be removed and cannot be recovered.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleDelete} className="flex flex-col gap-4 px-5 pb-2">
          <div className="space-y-2">
            <Label htmlFor="delete-confirm-email">
              Type{" "}
              <span className="font-medium text-foreground">{confirmEmail}</span> to
              confirm
            </Label>
            <Input
              id="delete-confirm-email"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder={confirmEmail}
              autoComplete="off"
              className="h-10 border-border/80 bg-card shadow-none"
            />
          </div>

          <DialogFooter className="px-0 pb-0">
            <Button
              type="button"
              variant="outline"
              className="h-9 border-border/80 bg-card shadow-none"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="h-9"
              disabled={!matches || submitted}
            >
              {submitted ? "Disabled in demo" : "Delete account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
