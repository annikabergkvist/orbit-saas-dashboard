import type { WorkItemStatus } from "@/lib/status"
import { projectsSeed } from "@/lib/projects-data"

export type TeamPresence = "online" | "away" | "offline"

export type TeamRoleGroup = "design" | "engineering" | "product" | "qa"

export type TeamMember = {
  id: string
  name: string
  role: string
  roleGroup: TeamRoleGroup
  email: string
  avatarUrl: string
  /**
   * NOTE: Status is currently driven by seed data.
   * In production this would connect to a presence system
   * (WebSocket/Pusher/Supabase Realtime) to show live
   * online/away/offline status. Kept static for portfolio scope.
   */
  presence: TeamPresence
}

/** Minimal issue shape for derived workload — keeps team-data free of issues-data imports. */
export type TeamIssueRef = {
  id: string
  title: string
  status: WorkItemStatus
  assigneeId: string
  projectSlug: string
  dueLabel: string
  priority: "low" | "medium" | "high"
}

export type WorkloadLevel = "light" | "balanced" | "heavy" | "overloaded"

export type EnrichedTeamMember = TeamMember & {
  activeTaskCount: number
  completedTaskCount: number
  workload: WorkloadLevel
  projectSlugs: string[]
  activeIssues: TeamIssueRef[]
  completedIssues: TeamIssueRef[]
}

export const CURRENT_USER_ID = "u-annika"

function canonicalName(name: string): string {
  const lower = name.trim().toLowerCase()
  if (lower === "anna bergkvist") return "Annika Bergkvist"
  return name.trim()
}

/** Project slugs + avatar per person, derived from every project team roster. */
function buildProjectMembership(): Map<string, { slugs: string[]; avatarUrl: string }> {
  const map = new Map<string, { slugs: Set<string>; avatarUrl: string }>()

  for (const project of projectsSeed) {
    for (const member of project.team) {
      const name = canonicalName(member.name)
      const existing = map.get(name)
      if (!existing) {
        map.set(name, { slugs: new Set([project.slug]), avatarUrl: member.avatarUrl })
      } else {
        existing.slugs.add(project.slug)
      }
    }
  }

  return new Map(
    [...map.entries()].map(([name, value]) => [
      name,
      { slugs: [...value.slugs], avatarUrl: value.avatarUrl },
    ])
  )
}

const projectMembershipByName = buildProjectMembership()

/** Single source of truth for people across Team, Issues, and assignee pickers. */
export const teamMembersSeed: TeamMember[] = [
  {
    id: CURRENT_USER_ID,
    name: "Annika Bergkvist",
    role: "Design Engineer",
    roleGroup: "design",
    email: "annika@orbit.app",
    avatarUrl: "/avatars/annika.png?v=2",
    presence: "online",
  },
  {
    id: "u-sara",
    name: "Sara Chen",
    role: "Product Designer",
    roleGroup: "design",
    email: "sara.chen@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    presence: "away",
  },
  {
    id: "u-alex",
    name: "Alex Johnson",
    role: "Frontend Developer",
    roleGroup: "engineering",
    email: "alex.johnson@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
    presence: "online",
  },
  {
    id: "u-maria",
    name: "Maria Lopez",
    role: "UX Researcher",
    roleGroup: "design",
    email: "maria.lopez@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg",
    presence: "online",
  },
  {
    id: "u-priya",
    name: "Priya Singh",
    role: "Backend Developer",
    roleGroup: "engineering",
    email: "priya.singh@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg",
    presence: "offline",
  },
  {
    id: "u-chris",
    name: "Chris Morgan",
    role: "Platform Engineer",
    roleGroup: "engineering",
    email: "chris.morgan@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/men/52.jpg",
    presence: "away",
  },
  {
    id: "u-ryan",
    name: "Ryan Cooper",
    role: "QA Engineer",
    roleGroup: "qa",
    email: "ryan.cooper@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    presence: "online",
  },
  {
    id: "u-jordan",
    name: "Jordan Lee",
    role: "Design Lead",
    roleGroup: "design",
    email: "jordan.lee@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
    presence: "online",
  },
  {
    id: "u-emma",
    name: "Emma Wilson",
    role: "Product Analyst",
    roleGroup: "product",
    email: "emma.wilson@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/women/17.jpg",
    presence: "offline",
  },
  {
    id: "u-david",
    name: "David Park",
    role: "Data Engineer",
    roleGroup: "engineering",
    email: "david.park@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/men/36.jpg",
    presence: "offline",
  },
  {
    id: "u-nina",
    name: "Nina Brooks",
    role: "Technical Writer",
    roleGroup: "product",
    email: "nina.brooks@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    presence: "offline",
  },
  {
    id: "u-tom",
    name: "Tom Rivera",
    role: "API Technical Writer",
    roleGroup: "product",
    email: "tom.rivera@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
    presence: "offline",
  },
  {
    id: "u-lisa",
    name: "Lisa Zhang",
    role: "Performance Engineer",
    roleGroup: "engineering",
    email: "lisa.zhang@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    presence: "online",
  },
  {
    id: "u-james",
    name: "James O'Neil",
    role: "Frontend Engineer",
    roleGroup: "engineering",
    email: "james.oneil@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/men/11.jpg",
    presence: "away",
  },
  {
    id: "u-olivia",
    name: "Olivia Hart",
    role: "UX Designer",
    roleGroup: "design",
    email: "olivia.hart@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/women/21.jpg",
    presence: "online",
  },
]

const memberById = new Map(teamMembersSeed.map((member) => [member.id, member]))
const projectTitleBySlug = new Map(projectsSeed.map((p) => [p.slug, p.title]))

export const teamRoleGroups: { value: TeamRoleGroup; label: string }[] = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "product", label: "Product" },
  { value: "qa", label: "QA" },
]

/** Active = not completed. Thresholds keep workload honest as issues change. */
export function getWorkloadLevel(activeCount: number): WorkloadLevel {
  if (activeCount >= 10) return "overloaded"
  if (activeCount >= 7) return "heavy"
  if (activeCount >= 4) return "balanced"
  return "light"
}

export function workloadLabel(level: WorkloadLevel): string {
  switch (level) {
    case "light":
      return "Light"
    case "balanced":
      return "Balanced"
    case "heavy":
      return "Heavy"
    case "overloaded":
      return "Overloaded"
  }
}

export function presenceLabel(presence: TeamPresence): string {
  switch (presence) {
    case "online":
      return "Online"
    case "away":
      return "Away"
    case "offline":
      return "Offline"
  }
}

export function getTeamMember(id: string): TeamMember | undefined {
  return memberById.get(id)
}

export function getProjectTitle(slug: string): string {
  return projectTitleBySlug.get(slug) ?? slug
}

function issuesForMember(memberId: string, issues: TeamIssueRef[]) {
  return issues.filter((issue) => issue.assigneeId === memberId)
}

export function enrichTeamMember(
  member: TeamMember,
  issues: TeamIssueRef[]
): EnrichedTeamMember {
  const assigned = issuesForMember(member.id, issues)
  const activeIssues = assigned.filter((issue) => issue.status !== "completed")
  const completedIssues = assigned.filter((issue) => issue.status === "completed")
  const activeTaskCount = activeIssues.length
  const issueProjectSlugs = assigned.map((issue) => issue.projectSlug)
  const rosterProjectSlugs = projectMembershipByName.get(member.name)?.slugs ?? []
  const projectSlugs = [...new Set([...issueProjectSlugs, ...rosterProjectSlugs])]

  return {
    ...member,
    activeTaskCount,
    completedTaskCount: completedIssues.length,
    workload: getWorkloadLevel(activeTaskCount),
    projectSlugs,
    activeIssues,
    completedIssues,
  }
}

export function enrichTeamMembers(issues: TeamIssueRef[]): EnrichedTeamMember[] {
  return teamMembersSeed.map((member) => enrichTeamMember(member, issues))
}

export type TeamFilters = {
  search?: string
  roleGroup?: TeamRoleGroup | null
  projectSlug?: string | null
}

export function filterTeamMembers(
  members: EnrichedTeamMember[],
  filters: TeamFilters = {}
): EnrichedTeamMember[] {
  const query = filters.search?.trim().toLowerCase() ?? ""

  return members.filter((member) => {
    if (filters.roleGroup && member.roleGroup !== filters.roleGroup) return false
    if (filters.projectSlug && !member.projectSlugs.includes(filters.projectSlug)) {
      return false
    }

    if (query) {
      const haystack = `${member.name} ${member.role} ${member.email}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }

    return true
  })
}

export function getProjectLabels(slugs: string[]): string[] {
  return slugs.map((slug) => getProjectTitle(slug))
}
