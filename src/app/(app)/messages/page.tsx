import { Suspense } from "react"

import { MessagesView } from "@/components/orbit/messages/messages-view"

export default function MessagesPage() {
  return (
    <Suspense fallback={null}>
      <MessagesView />
    </Suspense>
  )
}
