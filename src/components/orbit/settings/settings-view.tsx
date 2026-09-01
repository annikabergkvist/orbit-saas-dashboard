"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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
  const selectedTab: SettingsTab | null = isSettingsTab(tabParam) ? tabParam : null
  const activeTab: SettingsTab = selectedTab ?? "profile"

  function setActiveTab(tab: SettingsTab) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)
    router.replace(`/settings?${params.toString()}`, { scroll: false })
  }

  function backToIndex() {
    router.replace("/settings", { scroll: false })
  }

  const current = settingsTabs.find((tab) => tab.id === activeTab)

  const section = (
    <>
      {activeTab === "profile" ? <ProfileSection /> : null}
      {activeTab === "account" ? <AccountSection /> : null}
      {activeTab === "notifications" ? <NotificationsSection /> : null}
      {activeTab === "appearance" ? <AppearanceSection /> : null}
      {activeTab === "integrations" ? <IntegrationsSection /> : null}
    </>
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-5 px-4 py-5 md:hidden",
          selectedTab !== null && "hidden"
        )}
      >
        <header className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Profile, account, and workspace preferences.
          </p>
        </header>
        <nav
          aria-label="Settings sections"
          className="overflow-hidden rounded-xl border border-border/60 bg-card/80"
        >
          <ul className="divide-y divide-border/60">
            {settingsTabs.map((tab) => {
              const Icon = tabIcons[tab.id]
              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-muted/50"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-medium text-foreground">
                      {tab.label}
                    </span>
                    <ChevronRightIcon
                      className="size-4 shrink-0 text-muted-foreground"
                      strokeWidth={2}
                    />
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      <div
        className={cn(
          "min-h-0 flex-1 flex-col gap-6 px-4 py-5 sm:gap-8 sm:px-6 sm:py-8 md:flex md:px-10 lg:px-16",
          selectedTab === null ? "hidden" : "flex"
        )}
      >
        {selectedTab !== null ? (
          <button
            type="button"
            onClick={backToIndex}
            className="inline-flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground md:hidden"
          >
            <ChevronLeftIcon className="size-4" strokeWidth={2} />
            Settings
          </button>
        ) : null}

        <header className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground md:hidden">
            {current?.label ?? "Settings"}
          </h1>
          <h1 className="hidden text-xl font-bold tracking-tight text-foreground sm:text-2xl md:block">
            Settings
          </h1>
          <p className="hidden text-sm text-muted-foreground md:block">
            Manage your profile, account security, and workspace preferences.
          </p>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-8 lg:flex-row lg:items-start">
          <nav
            aria-label="Settings sections"
            className="hidden shrink-0 flex-col gap-1 md:flex lg:w-52"
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
                    "inline-flex h-10 min-w-0 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                  <span className="truncate">{tab.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="min-w-0 flex-1">{section}</div>
        </div>
      </div>
    </div>
  )
}
