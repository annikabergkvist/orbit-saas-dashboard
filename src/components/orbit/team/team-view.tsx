"use client"

import * as React from "react"
import Link from "next/link"
import {
  ChevronDownIcon,
  MessageCircleIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"

import { TeamDetailPanel } from "@/components/orbit/team/team-detail-panel"
import { PresenceDot } from "@/components/orbit/team/presence-dot"
import { WorkloadBar } from "@/components/orbit/team/workload-bar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { issueProjects, issuesSeed } from "@/lib/issues-data"
import {
  enrichTeamMembers,
  filterTeamMembers,
  getProjectTitle,
  teamRoleGroups,
  type EnrichedTeamMember,
  type TeamRoleGroup,
} from "@/lib/team-data"

const ANY = "__any__"

function memberInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
}

function FilterMenu({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string | null
  options: { value: string; label: string }[]
  onChange: (value: string | null) => void
}) {
  const current = options.find((o) => o.value === value)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-9 gap-1.5 border-border/80 bg-card px-3 font-normal shadow-none",
              current && "border-primary/40 text-foreground"
            )}
          >
            <span className="text-muted-foreground">{label}:</span>
            <span>{current ? current.label : "Any"}</span>
            <ChevronDownIcon className="size-4 opacity-60" strokeWidth={2} />
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="min-w-[12rem]">
        <DropdownMenuRadioGroup
          value={value ?? ANY}
          onValueChange={(v) => onChange(v === ANY ? null : v)}
        >
          <DropdownMenuRadioItem value={ANY}>Any {label.toLowerCase()}</DropdownMenuRadioItem>
          {options.map((o) => (
            <DropdownMenuRadioItem key={o.value} value={o.value}>
              {o.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function TeamMemberCard({
  member,
  selected,
  onSelect,
}: {
  member: EnrichedTeamMember
  selected: boolean
  onSelect: () => void
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      className={cn(
        "glass-subtle panel-glass-subtle flex flex-col gap-4 rounded-xl p-4",
        "cursor-pointer",
        selected && "ring-1 ring-primary/40"
      )}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="relative shrink-0">
            <Avatar className="size-10 ring-0">
              <AvatarImage src={member.avatarUrl} alt="" />
              <AvatarFallback className="text-xs font-semibold">
                {memberInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <PresenceDot presence={member.presence} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-foreground">{member.name}</h3>
            <p className="truncate text-sm text-muted-foreground">{member.role}</p>
            <p className="truncate text-xs text-muted-foreground">{member.email}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          nativeButton={false}
          className="size-8 shrink-0 border-border/80 bg-card shadow-none"
          aria-label={`Message ${member.name}`}
          render={<Link href={`/messages?member=${member.id}`} />}
          onClick={(e) => e.stopPropagation()}
        >
          <MessageCircleIcon className="size-4" strokeWidth={1.75} />
        </Button>
      </div>

      <WorkloadBar activeCount={member.activeTaskCount} level={member.workload} />

      {member.projectSlugs.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {member.projectSlugs.map((slug) => (
            <span
              key={slug}
              className="inline-flex max-w-full items-center rounded-md border border-foreground/10 bg-foreground/[0.03] px-2 py-0.5 text-xs text-muted-foreground"
            >
              <span className="truncate">{getProjectTitle(slug)}</span>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No active projects</p>
      )}
    </article>
  )
}

export function TeamView() {
  const [search, setSearch] = React.useState("")
  const [roleGroup, setRoleGroup] = React.useState<TeamRoleGroup | null>(null)
  const [projectSlug, setProjectSlug] = React.useState<string | null>(null)
  const [selectedMemberId, setSelectedMemberId] = React.useState<string | null>(null)

  const members = React.useMemo(() => enrichTeamMembers(issuesSeed), [])
  const filtered = React.useMemo(
    () => filterTeamMembers(members, { search, roleGroup, projectSlug }),
    [members, search, roleGroup, projectSlug]
  )

  const selectedMember = filtered.find((m) => m.id === selectedMemberId) ?? null
  const lastMemberRef = React.useRef<EnrichedTeamMember | null>(null)
  if (selectedMember) lastMemberRef.current = selectedMember
  const panelMember = selectedMember ?? lastMemberRef.current

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 px-6 py-8 md:px-10 lg:px-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-xl font-semibold text-foreground">Team</h1>
          <span className="text-sm text-muted-foreground">
            {members.length} members
          </span>
        </div>
        <Button type="button" variant="outline" className="h-9 gap-1.5 px-4">
          <PlusIcon className="size-4" strokeWidth={2} />
          Invite Member
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <SearchIcon
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
            aria-hidden
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team members..."
            className="h-9 border-border/80 bg-card pl-9 shadow-none"
            aria-label="Search team members"
          />
        </div>
        <FilterMenu
          label="Role"
          value={roleGroup}
          options={teamRoleGroups.map((g) => ({ value: g.value, label: g.label }))}
          onChange={(v) => setRoleGroup(v as TeamRoleGroup | null)}
        />
        <FilterMenu
          label="Project"
          value={projectSlug}
          options={issueProjects.map((p) => ({ value: p.slug, label: p.title }))}
          onChange={setProjectSlug}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="glass-subtle panel-glass-subtle rounded-xl px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">No team members match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              selected={selectedMemberId === member.id}
              onSelect={() => setSelectedMemberId(member.id)}
            />
          ))}
        </div>
      )}

      <TeamDetailPanel
        member={panelMember}
        open={selectedMemberId !== null}
        onClose={() => setSelectedMemberId(null)}
      />
    </div>
  )
}
