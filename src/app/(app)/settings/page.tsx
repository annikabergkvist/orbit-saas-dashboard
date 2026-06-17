import { Suspense } from "react"

import { SettingsView } from "@/components/orbit/settings/settings-view"

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsView />
    </Suspense>
  )
}
