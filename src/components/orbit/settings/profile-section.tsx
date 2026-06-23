"use client"

import * as React from "react"
import { UploadIcon } from "lucide-react"

import { SettingsSection } from "@/components/orbit/settings/settings-section"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { setUserProfilePatch, subscribeStore } from "@/lib/client-store"
import { getCurrentUser } from "@/lib/team-data"

function memberInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function ProfileSection() {
  const rosterUser = React.useMemo(() => getCurrentUser(), [])
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [name, setName] = React.useState(rosterUser.name)
  const [role, setRole] = React.useState(rosterUser.role)
  const [bio, setBio] = React.useState(rosterUser.bio ?? "")
  const [avatarUrl, setAvatarUrl] = React.useState(rosterUser.avatarUrl)
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    return subscribeStore(() => {
      const user = getCurrentUser()
      setName(user.name)
      setRole(user.role)
      setBio(user.bio ?? "")
      setAvatarUrl(user.avatarUrl)
    })
  }, [])

  React.useEffect(() => {
    if (!saved) return
    const timer = window.setTimeout(() => setSaved(false), 2000)
    return () => window.clearTimeout(timer)
  }, [saved])

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    // NOTE: Avatar upload is local-only for portfolio scope.
    // In production this would upload to object storage and update the user profile via API.
    const objectUrl = URL.createObjectURL(file)
    setAvatarUrl(objectUrl)
  }

  function handleSave(event: React.FormEvent) {
    event.preventDefault()
    setUserProfilePatch({ name, role, bio, avatarUrl })
    setSaved(true)
  }

  return (
    <SettingsSection
      title="Profile"
      description="This information is visible to your team."
    >
      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar className="size-16 ring-0">
            <AvatarImage src={avatarUrl} alt="" />
            <AvatarFallback className="text-base font-semibold">
              {memberInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1.5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handlePhotoChange}
            />
            <Button
              type="button"
              variant="outline"
              className="h-9 gap-2 border-border/80 bg-card px-4 shadow-none"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon className="size-4" strokeWidth={1.75} />
              Change photo
            </Button>
            <p className="text-xs text-muted-foreground">JPG or PNG, max 2MB.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Full name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 border-border/80 bg-card shadow-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-role">Role</Label>
            <Input
              id="profile-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-10 border-border/80 bg-card shadow-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-bio">Bio</Label>
          <Textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="min-h-24 border-border/80 bg-card shadow-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" className="h-9 px-4">
            Save changes
          </Button>
          {saved ? (
            <span className="text-sm text-muted-foreground">Changes saved locally.</span>
          ) : null}
        </div>
      </form>
    </SettingsSection>
  )
}
