"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  ClipboardListIcon,
  MessageCircleIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react"

import { BioPreview } from "@/components/orbit/team/bio-preview"
import { TeamDetailPanel } from "@/components/orbit/team/team-detail-panel"
import { InviteMemberDialog } from "@/components/orbit/team/invite-member-dialog"
import { PresenceDot } from "@/components/orbit/team/presence-dot"
import { WorkloadBar } from "@/components/orbit/team/workload-bar"
import { FilterMenu } from "@/components/orbit/filter-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { getInitials } from "@/lib/format"
import { subscribeStore } from "@/lib/client-store"
import { issueProjects, issuesSeed } from "@/lib/issues-data"
import {
  enrichTeamMembers,
  filterTeamMembers,
  teamRoleGroups,
  type EnrichedTeamMember,
  type TeamRoleGroup,
} from "@/lib/team-data"

const quickActionClassName =
  "size-8 border-border/80 bg-card/80 text-muted-foreground shadow-none transition-all duration-200 hover:border-border hover:bg-muted/50 hover:text-foreground"

function TeamMemberCard({
  member,
  selected,
  cardIndex,
  onSelect,
}: {
  member: EnrichedTeamMember
  selected: boolean
  cardIndex: number
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
        "group glass-subtle panel-glass-subtle relative flex h-full flex-col gap-3 rounded-xl p-4",
        "cursor-pointer transition-transform duration-300 ease-out",
        "hover:-translate-y-px",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
        selected && "ring-1 ring-primary/40"
      )}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="relative shrink-0">
            <Avatar className="size-12 ring-0">
              <AvatarImage src={member.avatarUrl} alt="" />
              <AvatarFallback className="text-sm font-semibold">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <PresenceDot presence={member.presence} />
          </div>
          <div className="min-w-0 pt-0.5">
            <h3 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
              {member.name}
            </h3>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">{member.role}</p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground/80">{member.email}</p>
          </div>
        </div>
        <div
          className={cn(
            "flex shrink-0 items-center gap-1",
            "max-md:pointer-events-auto max-md:opacity-100",
            "pointer-events-none opacity-0 transition-opacity duration-300 md:group-hover:pointer-events-auto md:group-hover:opacity-100",
            "group-focus-within:pointer-events-auto group-focus-within:opacity-100"
          )}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={quickActionClassName}
            aria-label={`View ${member.name}'s profile`}
            onClick={() => onSelect()}
          >
            <UserIcon className="size-4" strokeWidth={1.75} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            nativeButton={false}
            className={quickActionClassName}
            aria-label={`Assign task to ${member.name}`}
            render={<Link href={`/issues?new=1&assignee=${member.id}`} />}
          >
            <ClipboardListIcon className="size-4" strokeWidth={1.75} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            nativeButton={false}
            className={quickActionClassName}
            aria-label={`Message ${member.name}`}
            render={<Link href={`/messages?member=${member.id}`} />}
          >
            <MessageCircleIcon className="size-4" strokeWidth={1.75} />
          </Button>
        </div>
      </div>

      <WorkloadBar
        activeCount={member.activeTaskCount}
        level={member.workload}
        animateDelayMs={cardIndex * 70}
      />

      <BioPreview
        key={member.id}
        bio={member.bio ?? ""}
        onReadMore={onSelect}
        className="mt-auto w-full"
      />
    </article>
  )
}

export function TeamView() {
  const searchParams = useSearchParams()
  const memberParam = searchParams.get("member")
  const [search, setSearch] = React.useState("")
  const [roleGroup, setRoleGroup] = React.useState<TeamRoleGroup | null>(null)
  const [projectSlug, setProjectSlug] = React.useState<string | null>(null)
  const [selectedMemberId, setSelectedMemberId] = React.useState<string | null>(null)
  const [inviteOpen, setInviteOpen] = React.useState(false)
  const [storeTick, setStoreTick] = React.useState(0)

  React.useEffect(() => subscribeStore(() => setStoreTick((tick) => tick + 1)), [])

  const members = React.useMemo(() => {
    // storeTick forces a recompute when localStorage-backed roster data changes.
    void storeTick
    return enrichTeamMembers(issuesSeed)
  }, [storeTick])
  const filtered = React.useMemo(
    () => filterTeamMembers(members, { search, roleGroup, projectSlug }),
    [members, search, roleGroup, projectSlug]
  )

  const selectedMember = filtered.find((m) => m.id === selectedMemberId) ?? null
  const [lastMember, setLastMember] = React.useState<EnrichedTeamMember | null>(null)
  if (selectedMember && selectedMember.id !== lastMember?.id) {
    setLastMember(selectedMember)
  }
  const panelMember = selectedMember ?? lastMember

  // Adjust selection during render (guarded) rather than in an effect, since
  // this is deriving state from a prop (the URL) that changed this render.
  const [appliedMemberParam, setAppliedMemberParam] = React.useState<string | null>(null)
  if (
    memberParam &&
    memberParam !== appliedMemberParam &&
    members.some((member) => member.id === memberParam)
  ) {
    setAppliedMemberParam(memberParam)
    setSelectedMemberId(memberParam)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-8 md:px-10 lg:px-16">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative min-w-0 w-full sm:max-w-xs sm:flex-1">
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
            className="h-10 border-border/80 bg-card pl-9 shadow-none sm:h-9"
            aria-label="Search team members"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:overflow-visible">
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
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full shrink-0 gap-1.5 px-4 sm:ml-auto sm:h-9 sm:w-auto"
          onClick={() => setInviteOpen(true)}
        >
          <PlusIcon className="size-4" strokeWidth={2} />
          Invite Member
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-subtle panel-glass-subtle rounded-xl px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">No team members match your filters.</p>
        </div>
      ) : (
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((member, index) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              cardIndex={index}
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

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  )
}
