"use client"

import { IntegrationIcon } from "@/components/orbit/settings/integration-icons"
import { SettingsSection } from "@/components/orbit/settings/settings-section"
import { Button } from "@/components/ui/button"
import { useStoreValue } from "@/hooks/use-orbit-store"
import { cn } from "@/lib/utils"
import { getIntegrationState, setIntegrationState } from "@/lib/client-store"
import { integrations, type IntegrationId } from "@/lib/settings-data"

export function IntegrationsSection() {
  const connected = useStoreValue(getIntegrationState)

  function toggleConnection(id: IntegrationId) {
    setIntegrationState({ ...connected, [id]: !connected[id] })
  }

  return (
    <SettingsSection
      title="Integrations"
      description="Connect Orbit to the tools your team already uses."
    >
      <ul className="divide-y divide-border/60">
        {integrations.map((item) => {
          const isConnected = connected[item.id]
          return (
            <li
              key={item.id}
              className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-card">
                <IntegrationIcon id={item.id} className="size-5" />
              </span>
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs leading-snug text-muted-foreground sm:text-sm">
                  {item.description}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-9 shrink-0 px-3 shadow-none sm:min-w-[7.5rem] sm:px-4",
                  isConnected
                    ? "border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/5 dark:text-emerald-400"
                    : "border-border/80 bg-card"
                )}
                onClick={() => toggleConnection(item.id)}
              >
                {isConnected ? "Connected" : "Connect"}
              </Button>
            </li>
          )
        })}
      </ul>
    </SettingsSection>
  )
}
