import { notFound } from "next/navigation"

import { ProjectBoardView } from "@/components/orbit/projects/project-board-view"
import { getProjectBySlug } from "@/lib/projects-data"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  return <ProjectBoardView project={project} />
}
