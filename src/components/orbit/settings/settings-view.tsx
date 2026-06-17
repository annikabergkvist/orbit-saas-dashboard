"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  BellIcon,
  PaletteIcon,
  PlugIcon,
  ShieldIcon,
  UserIcon,
  type LucideIcon,
} from "lucide-react"

import { AccountSection } from "@/components/orbit/settings/account-section"
import { AppearanceSection } from "@/components/orbit/settings/appearance-section"
import { IntegrationsSection } from "@/components/orbit/settings/integrations-section"
import { NotificationsSection } from "@/components/orbit/settings/notifications-section"
import { ProfileSection } from "@/components/orbit/settings/profile-section"
import { cn } from "@/lib/utils"
import { settingsTabs, type SettingsTab } from "@/lib/settings-data"

const tabIcons: Record<SettingsTab, LucideIcon> = {
  profile: UserIcon,
  account: ShieldIcon,
  notifications: BellIcon,
  appearance: PaletteIcon,
  integrations: PlugIcon,
}

function isSettingsTab(value: string | null): value is SettingsTab {
  return settingsTabs.some((tab) => tab.id === value)
}

export function SettingsView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const activeTab: SettingsTab = isSettingsTab(tabParam) ? tabParam : "profile"

  function setActiveTab(tab: SettingsTab) {
    const params = new URLSearchParams(searchParams.toString())
    if (tab === "profile") {
      params.delete("tab")
    } else {
      params.set("tab", tab)
    }
    const query = params.toString()
    router.replace(query ? `/settings?${query}` : "/settings", { scroll: false })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-8 px-6 py-8 md:px-10 lg:px-16">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile, account security, and workspace preferences.
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-8 lg:flex-row lg:items-start">
        <nav
          aria-label="Settings sections"
          className="flex shrink-0 flex-row gap-1 overflow-x-auto lg:w-52 lg:flex-col lg:overflow-visible"
        >
          {settingsTabs.map((tab) => {
            const Icon = tabIcons[tab.id]
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <Icon className="size-4" strokeWidth={1.75} />
                {tab.label}
              </button>
            )
          })}
        </nav>

        <div className="min-w-0 flex-1">
          {activeTab === "profile" ? <ProfileSection /> : null}
          {activeTab === "account" ? <AccountSection /> : null}
          {activeTab === "notifications" ? <NotificationsSection /> : null}
          {activeTab === "appearance" ? <AppearanceSection /> : null}
          {activeTab === "integrations" ? <IntegrationsSection /> : null}
        </div>
      </div>
    </div>
  )
}
