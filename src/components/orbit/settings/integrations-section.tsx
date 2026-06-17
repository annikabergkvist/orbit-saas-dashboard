"use client"

import * as React from "react"

import { IntegrationIcon } from "@/components/orbit/settings/integration-icons"
import { SettingsSection } from "@/components/orbit/settings/settings-section"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { integrations, type IntegrationId } from "@/lib/settings-data"

function buildConnectionState() {
  return Object.fromEntries(
    integrations.map((item) => [item.id, item.connected])
  ) as Record<IntegrationId, boolean>
}

export function IntegrationsSection() {
  const [connected, setConnected] = React.useState(buildConnectionState)

  function toggleConnection(id: IntegrationId) {
    // NOTE: Integration OAuth flows are stubbed for portfolio scope.
    // In production these would open OAuth and update connection state from the server.
    setConnected((current) => ({ ...current, [id]: !current[id] }))
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
              className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-card">
                  <IntegrationIcon id={item.id} className="size-5" />
                </span>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-9 min-w-[7.5rem] border-border/80 bg-card px-4 shadow-none",
                  isConnected &&
                    "border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/5 dark:text-emerald-400"
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
