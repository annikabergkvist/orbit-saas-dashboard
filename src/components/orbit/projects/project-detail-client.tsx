"use client"

import * as React from "react"
import { notFound } from "next/navigation"

import { ProjectBoardView } from "@/components/orbit/projects/project-board-view"
import { loadPersistedProjects, subscribeStore } from "@/lib/client-store"
import { getProjectBySlug, projectsSeed } from "@/lib/projects-data"

export function ProjectDetailClient({ slug }: { slug: string }) {
  const [projects, setProjects] = React.useState(() =>
    loadPersistedProjects(projectsSeed)
  )

  React.useEffect(() => subscribeStore(() => setProjects(loadPersistedProjects(projectsSeed))), [])

  const project = getProjectBySlug(slug, projects)
  if (!project) notFound()

  return <ProjectBoardView project={project} />
}
