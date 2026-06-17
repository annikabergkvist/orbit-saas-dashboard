"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { AuthProviderIcon } from "@/components/orbit/settings/auth-provider-icons"
import { DeleteAccountDialog } from "@/components/orbit/settings/delete-account-dialog"
import { SettingsSection } from "@/components/orbit/settings/settings-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  getConnectedAccountsForUser,
  type AuthProviderId,
  type ConnectedAccount,
} from "@/lib/settings-data"
import { getCurrentUser } from "@/lib/team-data"

function buildProviderState(accounts: ConnectedAccount[]) {
  return Object.fromEntries(
    accounts.map((account) => [account.id, account.connected])
  ) as Record<AuthProviderId, boolean>
}

export function AccountSection() {
  const rosterUser = React.useMemo(() => getCurrentUser(), [])
  const seedAccounts = React.useMemo(
    () => getConnectedAccountsForUser(rosterUser),
    [rosterUser]
  )

  const [email, setEmail] = React.useState(rosterUser.email)
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [emailSaved, setEmailSaved] = React.useState(false)
  const [passwordSaved, setPasswordSaved] = React.useState(false)
  const [connected, setConnected] = React.useState(buildProviderState(seedAccounts))
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  React.useEffect(() => {
    if (!emailSaved) return
    const timer = window.setTimeout(() => setEmailSaved(false), 2000)
    return () => window.clearTimeout(timer)
  }, [emailSaved])

  React.useEffect(() => {
    if (!passwordSaved) return
    const timer = window.setTimeout(() => setPasswordSaved(false), 2000)
    return () => window.clearTimeout(timer)
  }, [passwordSaved])

  function handleEmailSubmit(event: React.FormEvent) {
    event.preventDefault()
    // NOTE: Email updates are local-only for portfolio scope.
    // In production this would verify the new address and update auth credentials.
    setEmailSaved(true)
  }

  function handlePasswordSubmit(event: React.FormEvent) {
    event.preventDefault()
    // NOTE: Password changes are stubbed for portfolio scope.
    // In production this would validate the current password and hash the new one server-side.
    setNewPassword("")
    setPasswordSaved(true)
  }

  function toggleProvider(id: AuthProviderId) {
    // NOTE: OAuth linking is stubbed for portfolio scope.
    setConnected((current) => ({ ...current, [id]: !current[id] }))
  }

  return (
    <div className="flex flex-col gap-6">
      <SettingsSection
        title="Email"
        description="Used for sign in and notifications."
      >
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="account-email">Email address</Label>
            <Input
              id="account-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 border-border/80 bg-card shadow-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              variant="outline"
              className="h-9 border-border/80 bg-card px-4 shadow-none"
            >
              Update email
            </Button>
            {emailSaved ? (
              <span className="text-sm text-muted-foreground">Email updated locally.</span>
            ) : null}
          </div>
        </form>
      </SettingsSection>

      <SettingsSection
        title="Password"
        description="Change your password regularly to keep your account secure."
      >
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="account-current-password">Current password</Label>
            <Input
              id="account-current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-10 border-border/80 bg-card shadow-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-new-password">New password</Label>
            <Input
              id="account-new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter a new password"
              className="h-10 border-border/80 bg-card shadow-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              variant="outline"
              className="h-9 border-border/80 bg-card px-4 shadow-none"
            >
              Change password
            </Button>
            {passwordSaved ? (
              <span className="text-sm text-muted-foreground">
                Password updated locally.
              </span>
            ) : null}
          </div>
        </form>
      </SettingsSection>

      <SettingsSection
        title="Connected accounts"
        description="Sign in faster with a connected provider."
      >
        <ul className="divide-y divide-border/60">
          {seedAccounts.map((account) => {
            const isConnected = connected[account.id]
            const subtitle =
              isConnected && account.username
                ? account.username
                : isConnected && account.id === "google"
                  ? rosterUser.email
                  : account.statusLabel ?? "Not connected"
            return (
              <li
                key={account.id}
                className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-card">
                    <AuthProviderIcon id={account.id} className="size-5" />
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-sm font-medium text-foreground">{account.name}</p>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                  </div>
                </div>
                {isConnected ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckIcon className="size-4" strokeWidth={2} />
                    Connected
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 min-w-[7.5rem] border-border/80 bg-card px-4 shadow-none"
                    onClick={() => toggleProvider(account.id)}
                  >
                    Connect
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      </SettingsSection>

      <SettingsSection
        title="Danger zone"
        description="Irreversible and destructive actions."
        titleClassName="text-destructive"
        className="border border-destructive/40"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium text-foreground">Delete account</p>
            <p className="max-w-xl text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This cannot
              be undone.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-9 shrink-0 border-border/80 bg-card px-4 shadow-none",
              "hover:border-destructive/50 hover:text-destructive"
            )}
            onClick={() => setDeleteOpen(true)}
          >
            Delete account
          </Button>
        </div>
      </SettingsSection>

      <DeleteAccountDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        confirmEmail={email}
      />
    </div>
  )
}
