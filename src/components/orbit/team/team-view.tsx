"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  ChevronDownIcon,
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
import { subscribeStore } from "@/lib/client-store"
import { issueProjects, issuesSeed } from "@/lib/issues-data"
import {
  enrichTeamMembers,
  filterTeamMembers,
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

const quickActionClassName =
  "size-8 border-border/80 bg-card/80 text-muted-foreground shadow-none transition-all duration-200 hover:border-border hover:bg-muted/50 hover:text-foreground hover:shadow-[0_1px_4px_rgba(15,23,42,0.06)]"

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
        "cursor-pointer transition-[transform,box-shadow] duration-300 ease-out",
        "hover:-translate-y-px hover:shadow-[0_4px_18px_rgba(15,23,42,0.07)]",
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
                {memberInitials(member.name)}
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
            "pointer-events-none opacity-0 transition-opacity duration-300",
            "group-hover:pointer-events-auto group-hover:opacity-100",
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

  const members = React.useMemo(() => enrichTeamMembers(issuesSeed), [storeTick])
  const filtered = React.useMemo(
    () => filterTeamMembers(members, { search, roleGroup, projectSlug }),
    [members, search, roleGroup, projectSlug]
  )

  const selectedMember = filtered.find((m) => m.id === selectedMemberId) ?? null
  const lastMemberRef = React.useRef<EnrichedTeamMember | null>(null)
  if (selectedMember) lastMemberRef.current = selectedMember
  const panelMember = selectedMember ?? lastMemberRef.current

  React.useEffect(() => {
    if (memberParam && members.some((member) => member.id === memberParam)) {
      setSelectedMemberId(memberParam)
    }
  }, [memberParam, members])

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 px-6 py-8 md:px-10 lg:px-16">
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
        <Button
          type="button"
          variant="outline"
          className="ml-auto h-9 gap-1.5 px-4"
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
