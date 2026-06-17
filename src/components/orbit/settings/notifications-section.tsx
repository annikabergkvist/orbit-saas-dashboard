"use client"

import * as React from "react"

import {
  SettingsSection,
  SettingsToggleRow,
} from "@/components/orbit/settings/settings-section"
import { Switch } from "@/components/ui/switch"
import {
  notificationPreferences,
  type NotificationPreferenceKey,
} from "@/lib/settings-data"

function buildDefaultPrefs() {
  return Object.fromEntries(
    notificationPreferences.map((pref) => [pref.id, pref.defaultEnabled])
  ) as Record<NotificationPreferenceKey, boolean>
}

export function NotificationsSection() {
  const [prefs, setPrefs] = React.useState(buildDefaultPrefs)

  function setPref(id: NotificationPreferenceKey, enabled: boolean) {
    // NOTE: Notification preferences are local UI state for portfolio scope.
    // In production these would persist per user and filter delivery channels.
    setPrefs((current) => ({ ...current, [id]: enabled }))
  }

  return (
    <SettingsSection
      title="Notifications"
      description="Choose what you want to be notified about."
    >
      <div className="flex flex-col">
        {notificationPreferences.map((pref) => (
          <SettingsToggleRow
            key={pref.id}
            title={pref.title}
            description={pref.description}
          >
            <Switch
              checked={prefs[pref.id]}
              onCheckedChange={(checked) => setPref(pref.id, checked)}
              aria-label={pref.title}
            />
          </SettingsToggleRow>
        ))}
      </div>
    </SettingsSection>
  )
}
