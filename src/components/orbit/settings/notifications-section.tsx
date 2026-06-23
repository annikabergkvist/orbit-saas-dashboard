"use client"

import {
  SettingsSection,
  SettingsToggleRow,
} from "@/components/orbit/settings/settings-section"
import { Switch } from "@/components/ui/switch"
import { useStoreValue } from "@/hooks/use-orbit-store"
import { getNotificationPrefs, setNotificationPrefs } from "@/lib/client-store"
import {
  notificationPreferences,
  type NotificationPreferenceKey,
} from "@/lib/settings-data"

export function NotificationsSection() {
  const prefs = useStoreValue(getNotificationPrefs)

  function setPref(id: NotificationPreferenceKey, enabled: boolean) {
    setNotificationPrefs({ ...prefs, [id]: enabled })
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
