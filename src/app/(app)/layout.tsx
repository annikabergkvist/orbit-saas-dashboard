import type { ReactNode } from "react"

import { DashboardShell } from "@/components/orbit/dashboard-shell"

export default function AppLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
