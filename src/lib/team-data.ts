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
  /** Optional profile bio — shown on Settings and team detail. */
  bio?: string
  /** Connected GitHub username for Account settings. */
  githubUsername?: string
  /** Connected Figma username for Account settings. */
  figmaUsername?: string
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
    bio: "Design engineer. I live in the gap between Figma and production — usually with too many tabs open and strong opinions about spacing.",
    githubUsername: "annikabergkvist",
    figmaUsername: "annikabergkvist",
    presence: "online",
  },
  {
    id: "u-sara",
    name: "Sara Chen",
    role: "Product Designer",
    roleGroup: "design",
    email: "sara.chen@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    bio: "Product designer. Making things pretty until someone asks for a dark mode variant. Coffee-powered, grid-obsessed.",
    presence: "away",
  },
  {
    id: "u-alex",
    name: "Alex Johnson",
    role: "Frontend Developer",
    roleGroup: "engineering",
    email: "alex.johnson@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
    bio: "Frontend dev. I turn designs into pixels and occasionally into bugs. Pretty sure that's a feature.",
    presence: "online",
  },
  {
    id: "u-maria",
    name: "Maria Lopez",
    role: "UX Researcher",
    roleGroup: "design",
    email: "maria.lopez@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg",
    bio: "UX researcher. Professional opinion haver. Will silently watch you struggle with a button for science.",
    presence: "online",
  },
  {
    id: "u-priya",
    name: "Priya Singh",
    role: "Backend Developer",
    roleGroup: "engineering",
    email: "priya.singh@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg",
    bio: "Backend engineer. If it's broken, it's probably the frontend. (It's never the frontend.)",
    presence: "offline",
  },
  {
    id: "u-chris",
    name: "Chris Morgan",
    role: "Platform Engineer",
    roleGroup: "engineering",
    email: "chris.morgan@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/men/52.jpg",
    bio: "Platform engineer. I keep the lights on and the deploys boring. kubectl is my love language.",
    presence: "away",
  },
  {
    id: "u-ryan",
    name: "Ryan Cooper",
    role: "QA Engineer",
    roleGroup: "qa",
    email: "ryan.cooper@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "QA engineer. I break things professionally so you don't have to. You're welcome.",
    presence: "online",
  },
  {
    id: "u-jordan",
    name: "Jordan Lee",
    role: "Design Lead",
    roleGroup: "design",
    email: "jordan.lee@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
    bio: "Design lead. Here to elevate the craft and ruin your weekend with feedback. No notes is suspicious.",
    presence: "online",
  },
  {
    id: "u-emma",
    name: "Emma Wilson",
    role: "Product Analyst",
    roleGroup: "product",
    email: "emma.wilson@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/women/17.jpg",
    bio: "Product analyst. I speak spreadsheet fluently and turn chaos into a slide deck. Ask me about the funnel.",
    presence: "offline",
  },
  {
    id: "u-david",
    name: "David Park",
    role: "Data Engineer",
    roleGroup: "engineering",
    email: "david.park@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/men/36.jpg",
    bio: "Data engineer. Pipelines by day, existential dread about schema drift by night.",
    presence: "offline",
  },
  {
    id: "u-nina",
    name: "Nina Brooks",
    role: "Technical Writer",
    roleGroup: "product",
    email: "nina.brooks@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Technical writer. I write the docs nobody reads until something breaks at 4pm on a Friday.",
    presence: "offline",
  },
  {
    id: "u-tom",
    name: "Tom Rivera",
    role: "API Technical Writer",
    roleGroup: "product",
    email: "tom.rivera@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
    bio: "API docs specialist. REST in peace. GraphQL in progress. Swagger in my heart.",
    presence: "offline",
  },
  {
    id: "u-lisa",
    name: "Lisa Zhang",
    role: "Performance Engineer",
    roleGroup: "engineering",
    email: "lisa.zhang@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    bio: "Performance engineer. I make things fast — mostly by telling other people their code is slow.",
    presence: "online",
  },
  {
    id: "u-james",
    name: "James O'Neil",
    role: "Frontend Engineer",
    roleGroup: "engineering",
    email: "james.oneil@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/men/11.jpg",
    bio: "Frontend engineer. CSS is my personality. Yes, I have opinions about your hover states.",
    presence: "away",
  },
  {
    id: "u-olivia",
    name: "Olivia Hart",
    role: "UX Designer",
    roleGroup: "design",
    email: "olivia.hart@orbit.app",
    avatarUrl: "https://randomuser.me/api/portraits/women/21.jpg",
    bio: "UX designer. Wireframes, user flows, and the occasional passive-aggressive sticky note. Design with empathy (and constraints).",
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

function readProfilePatch(): Partial<Pick<TeamMember, "name" | "role" | "bio" | "avatarUrl">> {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem("orbit:user-profile")
    if (!raw) return {}
    return JSON.parse(raw) as Partial<Pick<TeamMember, "name" | "role" | "bio" | "avatarUrl">>
  } catch {
    return {}
  }
}

function withProfilePatch(member: TeamMember): TeamMember {
  if (member.id !== CURRENT_USER_ID) return member
  return { ...member, ...readProfilePatch() }
}

/** Roster with any locally saved profile edits for the signed-in user. */
export function getTeamMembersRoster(): TeamMember[] {
  return teamMembersSeed.map(withProfilePatch)
}

/** Signed-in user — single source for shell header, Settings profile, and issue identity. */
export function getCurrentUser(): TeamMember {
  const member = getTeamMember(CURRENT_USER_ID)
  if (!member) {
    throw new Error(`Current user "${CURRENT_USER_ID}" is missing from teamMembersSeed`)
  }
  return withProfilePatch(member)
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
  return getTeamMembersRoster().map((member) => enrichTeamMember(member, issues))
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
