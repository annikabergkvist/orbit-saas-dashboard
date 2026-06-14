import { Suspense } from "react"

import { IssuesView } from "@/components/orbit/issues/issues-view"

export default function IssuesPage() {
  return (
    <Suspense fallback={null}>
      <IssuesView />
    </Suspense>
  )
}
