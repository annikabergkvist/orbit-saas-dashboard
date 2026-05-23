import type { ReactNode } from "react"

import { DashboardShell } from "@/components/orbit/dashboard-shell"

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-mesh-gradient min-h-svh w-full">
      <DashboardShell>{children}</DashboardShell>
    </div>
  )
}
