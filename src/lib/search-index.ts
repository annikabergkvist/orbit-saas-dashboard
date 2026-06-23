import { issuesSeed } from "@/lib/issues-data"
import { listProjects } from "@/lib/projects-data"
import { teamMembersSeed } from "@/lib/team-data"

export type SearchItem = {
  id: string
  label: string
  hint?: string
  href: string
  group: "Pages" | "Projects" | "Issues" | "Team"
}

const pageItems: SearchItem[] = [
  { id: "page-dashboard", label: "Dashboard", href: "/", group: "Pages" },
  { id: "page-messages", label: "Messages", href: "/messages", group: "Pages" },
  { id: "page-projects", label: "Projects", href: "/projects", group: "Pages" },
  { id: "page-issues", label: "Issues", href: "/issues", group: "Pages" },
  { id: "page-team", label: "Team", href: "/team", group: "Pages" },
  { id: "page-settings", label: "Settings", href: "/settings", group: "Pages" },
  {
    id: "page-settings-integrations",
    label: "Integrations",
    hint: "Settings",
    href: "/settings?tab=integrations",
    group: "Pages",
  },
]

export function buildSearchIndex(): SearchItem[] {
  const projects = listProjects({ sort: "name-asc" }).map((project) => ({
    id: `project-${project.slug}`,
    label: project.title,
    hint: "Project",
    href: `/projects/${project.slug}`,
    group: "Projects" as const,
  }))

  const issues = issuesSeed.map((issue) => ({
    id: `issue-${issue.id}`,
    label: `${issue.id} · ${issue.title}`,
    hint: "Issue",
    href: `/issues?issue=${issue.id}`,
    group: "Issues" as const,
  }))

  const team = teamMembersSeed.map((member) => ({
    id: `member-${member.id}`,
    label: member.name,
    hint: member.role,
    href: `/team?member=${member.id}`,
    group: "Team" as const,
  }))

  return [...pageItems, ...projects, ...issues, ...team]
}

export function filterSearchIndex(query: string, items: SearchItem[]): SearchItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return items.slice(0, 12)
  return items
    .filter((item) => {
      const haystack = `${item.label} ${item.hint ?? ""} ${item.group}`.toLowerCase()
      return haystack.includes(q)
    })
    .slice(0, 12)
}
