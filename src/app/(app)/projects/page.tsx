import { Suspense } from "react"

import { ProjectsOverview } from "@/components/orbit/projects/projects-overview"

export default function ProjectsPage() {
  return (
    <Suspense fallback={null}>
      <ProjectsOverview />
    </Suspense>
  )
}
