import { Suspense } from "react"

import { TeamView } from "@/components/orbit/team/team-view"

export default function TeamPage() {
  return (
    <Suspense fallback={null}>
      <TeamView />
    </Suspense>
  )
}
