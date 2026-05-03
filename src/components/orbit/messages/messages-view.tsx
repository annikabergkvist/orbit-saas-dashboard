"use client"

import * as React from "react"
import {
  AtSignIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  GitBranchIcon,
  HelpCircleIcon,
  InfoIcon,
  MicIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  SendIcon,
  SlidersHorizontalIcon,
  SmileIcon,
  TypeIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

const currentUserAvatar = "https://randomuser.me/api/portraits/women/68.jpg"

type ChatMessage = {
  id: string
  role: "them" | "me"
  body: string
  time: string
}

type TeamScope = "orbit" | "acme"

type InboxTab = "all" | "orbit" | "acme"

type PinnedKind = "pr" | "meeting" | "none"

type Conversation = {
  id: string
  name: string
  handle: string
  activityLabel: string
  timeLabel: string
  snippet: string
  team: TeamScope
  unread: number
  avatarUrl: string
  workItem: {
    id: string
    title: string
    status: string
    project: string
  }
  messages: ChatMessage[]
  timeline: string[]
  pinned: {
    kind: PinnedKind
    summary: string
    cta: string
  }
}

const conversations: Conversation[] = [
  {
    id: "marco",
    name: "Marco Ruiz",
    handle: "marco",
    activityLabel: "Thread in #platform-infra",
    timeLabel: "12m",
    snippet: "Can you own the rollback checklist before Friday’s change window?",
    team: "orbit",
    unread: 2,
    avatarUrl: "https://randomuser.me/api/portraits/men/44.jpg",
    workItem: {
      id: "ENG-412",
      title: "Migrate auth service to OIDC",
      status: "In review",
      project: "Platform · Sprint 24",
    },
    messages: [
      {
        id: "m1",
        role: "them",
        body: "We’re green-lit for the OIDC cutover next week. I need someone to own the rollback checklist and the comms draft for CS.",
        time: "Yesterday at 4:12 PM",
      },
      {
        id: "m2",
        role: "me",
        body: "I can take rollback + runbook. I’ll tag you on the PR once the staging soak finishes.",
        time: "Yesterday at 4:18 PM",
      },
      {
        id: "m3",
        role: "them",
        body: "Perfect — can you own the rollback checklist before Friday’s change window? I’ll line up SRE for the window itself.",
        time: "Today at 9:41 AM",
      },
      {
        id: "m4",
        role: "me",
        body: "Sounds good. I’ll have the rollback doc + CS comms draft in #platform-infra by EOD tomorrow and link the staging soak results on the PR.",
        time: "Today at 9:52 AM",
      },
      {
        id: "m5",
        role: "them",
        body: "Great — I’ll add Priya from SRE to the change calendar invite once you drop the checklist link. Thanks for owning this end-to-end.",
        time: "Today at 10:03 AM",
      },
    ],
    timeline: ["Design review · Thu 2:00 PM", "QA sign-off pending", "Change window · Fri 6:00 PM UTC"],
    pinned: {
      kind: "pr",
      summary: "Pull request #884 · requested your review",
      cta: "Review PR",
    },
  },
  {
    id: "dana",
    name: "Dana Okonkwo",
    handle: "dana_ok",
    activityLabel: "@ Mention in #acme-delivery",
    timeLabel: "2h",
    snippet: "Can we get a written ETA on the export timeouts fix before exec readout?",
    team: "acme",
    unread: 1,
    avatarUrl: "https://randomuser.me/api/portraits/women/22.jpg",
    workItem: {
      id: "ORB-128",
      title: "Export job timeouts over 10k rows",
      status: "In progress",
      project: "ACME Corp · Success track",
    },
    messages: [
      {
        id: "a1",
        role: "them",
        body: "Can we get a written ETA on the export timeouts fix before Tuesday’s exec readout? Legal wants it in the deck.",
        time: "Today at 11:02 AM",
      },
    ],
    timeline: ["Customer SLA · 48h response", "Exec readout · Tue 10:00 AM"],
    pinned: {
      kind: "meeting",
      summary: "Customer sync · starts in 25 minutes",
      cta: "Join meeting",
    },
  },
  {
    id: "sofia",
    name: "Sofia Nguyen",
    handle: "sofia_n",
    activityLabel: "Direct message",
    timeLabel: "Yesterday",
    snippet: "Left comments on the SCIM doc — mostly small clarifications.",
    team: "orbit",
    unread: 0,
    avatarUrl: "https://randomuser.me/api/portraits/women/63.jpg",
    workItem: {
      id: "ENG-501",
      title: "SCIM provisioning documentation",
      status: "To do",
      project: "Security · Docs guild",
    },
    messages: [
      {
        id: "s1",
        role: "them",
        body: "Left comments on the SCIM doc — mostly small clarifications. Ping me if anything’s unclear before the guild review.",
        time: "Yesterday at 6:30 PM",
      },
    ],
    timeline: ["Doc freeze · May 9", "Guild review · next week"],
    pinned: {
      kind: "none",
      summary: "",
      cta: "",
    },
  },
]

function WorkspaceBadge({ team }: { team: TeamScope }) {
  if (team === "orbit") {
    return (
      <Badge className="rounded-md border-0 bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary hover:bg-primary/20">
        Orbit
      </Badge>
    )
  }
  return (
    <Badge
      variant="secondary"
      className="rounded-md border-0 bg-orange-500/15 px-2.5 py-0.5 text-xs font-semibold text-orange-800 hover:bg-orange-500/20 dark:text-orange-300"
    >
      ACME
    </Badge>
  )
}

const inboxTabs: { id: InboxTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "orbit", label: "Orbit" },
  { id: "acme", label: "Clients" },
]

export function MessagesView() {
  const [activeId, setActiveId] = React.useState(conversations[0].id)
  const [inboxTab, setInboxTab] = React.useState<InboxTab>("all")
  const [unreadsOnly, setUnreadsOnly] = React.useState(false)
  /** Below `md`, alternate between activity list and thread (Slack-mobile style). */
  const [mobileShowInbox, setMobileShowInbox] = React.useState(true)
  const isMobile = useIsMobile()

  const showAside = !isMobile || mobileShowInbox
  const showMain = !isMobile || !mobileShowInbox

  const visible = React.useMemo(() => {
    return conversations.filter((c) => {
      if (unreadsOnly && c.unread === 0) return false
      if (inboxTab === "orbit" && c.team !== "orbit") return false
      if (inboxTab === "acme" && c.team !== "acme") return false
      return true
    })
  }, [unreadsOnly, inboxTab])

  React.useEffect(() => {
    if (visible.length === 0) return
    if (!visible.some((c) => c.id === activeId)) {
      setActiveId(visible[0].id)
    }
  }, [visible, activeId])

  React.useEffect(() => {
    if (!isMobile) setMobileShowInbox(true)
  }, [isMobile])

  const selectConversation = React.useCallback(
    (id: string) => {
      setActiveId(id)
      if (isMobile) setMobileShowInbox(false)
    },
    [isMobile]
  )

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0]
  const lastMessageId = active.messages[active.messages.length - 1]?.id

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden bg-background">
      {/* Page toolbar — compact on small screens so the thread lands in the first viewport */}
      <div className="flex shrink-0 flex-wrap items-end gap-x-3 gap-y-3 border-b border-border bg-card px-4 py-3 sm:gap-x-4 sm:gap-y-4 sm:px-6 sm:py-4 md:px-10 md:py-5 lg:px-12">
        <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
          <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl md:text-2xl">
            Messages
          </h1>
          <p className="hidden max-w-xl text-sm leading-relaxed text-muted-foreground sm:block">
            DMs, mentions, and customer threads across your workspaces — tied to tickets and projects.
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:gap-3 md:w-auto md:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 gap-1.5 rounded-lg border-border bg-background px-3 text-sm font-medium shadow-none sm:gap-2 sm:px-4"
          >
            <SlidersHorizontalIcon className="size-4 shrink-0" strokeWidth={1.75} />
            <span className="max-w-[9.5rem] truncate sm:max-w-none">All workspaces</span>
            <ChevronDownIcon className="size-4 shrink-0 opacity-60" />
          </Button>
          <div className="relative min-w-0 flex-1 basis-[min(100%,14rem)] sm:min-w-[200px] md:w-72 md:flex-none">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search people, channels, and tickets"
              className="h-10 rounded-lg border-border bg-background pl-10 text-sm shadow-none"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Refresh inbox"
            className="size-10 shrink-0 rounded-lg border-border shadow-none"
          >
            <RefreshCwIcon className="size-4" strokeWidth={1.75} />
          </Button>
        </div>
      </div>

      <div
        className="flex min-h-0 flex-1 flex-col overflow-hidden max-md:min-h-0 md:max-h-[min(calc(100svh-9.5rem),56rem)] md:flex-row md:items-stretch"
        suppressHydrationWarning
      >
        {/* Activity — two columns from md; phone toggles list vs thread with max-md:hidden (no hidden/md:flex clash) */}
        <aside
          className={cn(
            "flex min-h-0 w-full min-w-0 flex-col border-border bg-muted/25 md:max-h-none md:w-[min(100%,26rem)] md:max-w-md md:shrink-0 md:border-b-0 md:border-r lg:max-w-lg",
            "max-md:max-h-[min(38svh,17.5rem)] max-md:shrink-0 max-md:border-b",
            !showAside && "max-md:hidden"
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-base font-bold tracking-tight text-foreground">Activity</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Unreads</span>
              <button
                type="button"
                role="switch"
                aria-checked={unreadsOnly}
                onClick={() => setUnreadsOnly((v) => !v)}
                className={cn(
                  "box-border inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-border/60 p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  unreadsOnly ? "justify-end bg-primary" : "justify-start bg-muted"
                )}
              >
                <span
                  className="pointer-events-none size-4 shrink-0 rounded-full bg-background shadow-sm ring-1 ring-foreground/10"
                  aria-hidden
                />
              </button>
            </div>
          </div>

          <div className="-mx-1 flex gap-0.5 overflow-x-auto border-b border-border px-2 pt-1 sm:mx-0 sm:gap-1 sm:px-3">
            {inboxTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setInboxTab(t.id)}
                className={cn(
                  "relative shrink-0 px-3 py-3 text-sm font-medium transition-colors sm:px-4",
                  inboxTab === t.id
                    ? "text-foreground after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary sm:after:inset-x-3"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {visible.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-muted-foreground">No threads match this view.</p>
            ) : (
              visible.map((c) => {
                const isActive = c.id === active.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectConversation(c.id)}
                    className={cn(
                      "relative flex w-full gap-3 border-b border-border px-5 py-4 text-left transition-colors hover:bg-muted/40",
                      isActive && "bg-primary/[0.06] hover:bg-primary/[0.08]"
                    )}
                  >
                    {isActive ? (
                      <span className="absolute inset-y-0 left-0 w-1 bg-primary" aria-hidden />
                    ) : null}
                    <div className="relative shrink-0">
                      <Avatar className="size-10 rounded-md border border-border/80 bg-muted">
                        <AvatarImage src={c.avatarUrl} alt="" />
                        <AvatarFallback className="rounded-md text-xs font-medium">
                          {c.name
                            .split(" ")
                            .map((p) => p[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {c.unread > 0 ? (
                        <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold leading-none text-primary-foreground ring-2 ring-[var(--card)]">
                          {c.unread > 9 ? "9+" : c.unread}
                        </span>
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-3">
                        <span className="line-clamp-1 text-xs font-medium text-muted-foreground">
                          {c.activityLabel}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">{c.timeLabel}</span>
                      </div>
                      <div className="truncate text-sm font-semibold text-foreground">{c.name}</div>
                      <p className="line-clamp-2 text-sm leading-relaxed text-foreground/85">{c.snippet}</p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </aside>

        {/* Thread + work context */}
        <main
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background md:min-h-0",
            !showMain && "max-md:hidden"
          )}
        >
          <header className="flex min-h-12 shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-2 sm:gap-3 sm:px-5 md:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
              {isMobile ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-10 shrink-0 text-muted-foreground"
                  aria-label="Back to inbox"
                  onClick={() => setMobileShowInbox(true)}
                >
                  <ChevronLeftIcon className="size-5" strokeWidth={1.75} />
                </Button>
              ) : null}
              <button
                type="button"
                className="flex min-w-0 items-center gap-2 rounded-lg py-1.5 pr-2 text-left hover:bg-muted/50"
              >
                <span className="truncate text-base font-semibold text-foreground">{active.name}</span>
                <ChevronDownIcon className="size-4 shrink-0 opacity-60" strokeWidth={1.75} />
              </button>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-10 text-muted-foreground"
                aria-label="People in thread"
              >
                <UsersIcon className="size-[18px]" strokeWidth={1.75} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-10 text-muted-foreground"
                aria-label="Thread details"
              >
                <InfoIcon className="size-[18px]" strokeWidth={1.75} />
              </Button>
            </div>
          </header>

          {active.pinned.kind !== "none" ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-muted/25 px-4 py-2 sm:px-5 md:px-6">
              {active.pinned.kind === "pr" ? (
                <GitBranchIcon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
              ) : (
                <VideoIcon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
              )}
              <span className="min-w-0 flex-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Pinned</span>
                <span className="text-muted-foreground"> — </span>
                {active.pinned.summary}
              </span>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Button type="button" size="sm" className="h-8 gap-1.5 rounded-md px-3 text-xs font-semibold shadow-none sm:text-sm">
                  {active.pinned.cta}
                </Button>
                {active.pinned.kind === "pr" ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-md border-border px-3 text-xs font-medium shadow-none sm:text-sm"
                  >
                    View diff
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-md border-border px-3 text-xs font-medium shadow-none sm:text-sm"
                  >
                    Copy invite
                  </Button>
                )}
              </div>
            </div>
          ) : null}

          {/* Linked assignment / ticket */}
          <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border px-4 py-2.5 sm:gap-3 sm:px-5 md:px-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted font-mono text-[10px] font-bold leading-tight text-foreground sm:text-[11px]">
              {active.workItem.id}
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="text-sm font-semibold leading-snug text-foreground">
                {active.workItem.title}
              </p>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {active.workItem.project}
                <span className="text-border"> · </span>
                <span className="font-medium text-foreground/90">{active.workItem.status}</span>
              </p>
            </div>
            <WorkspaceBadge team={active.team} />
            <div className="flex w-full shrink-0 flex-wrap gap-2 sm:w-auto sm:justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-md border-border px-3 text-xs font-medium shadow-none sm:text-sm"
              >
                View ticket
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-8 rounded-md px-3 text-xs font-semibold shadow-none sm:text-sm"
              >
                Assign to me
              </Button>
            </div>
          </div>

          {/* Thread body: grid row `minmax(0,1fr)` gives the scrollport a definite height; inner `min-h-full` + trailing `flex-1` fills slack-style dead space below the timeline. */}
          <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] overflow-hidden">
            <div className="min-h-0 overflow-y-auto overscroll-contain px-4 py-2 sm:px-5 md:px-6 md:py-3">
              <div className="flex min-h-full flex-col">
                <div className="w-full shrink-0 space-y-0.5">
                  {active.messages.map((msg) => {
                    const isLast = msg.id === lastMessageId
                    const highlight = isLast && msg.role === "them"
                    return msg.role === "them" ? (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex gap-2.5 rounded-md px-2 py-2 sm:gap-3 sm:px-3 sm:py-2.5",
                          highlight && "bg-amber-400/12 dark:bg-amber-400/10"
                        )}
                      >
                        <Avatar className="mt-0.5 size-9 shrink-0 rounded-md border border-border/80 bg-muted sm:size-10">
                          <AvatarImage src={active.avatarUrl} alt="" />
                          <AvatarFallback className="rounded-md text-sm font-medium">
                            {active.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                            <span className="text-sm font-bold text-foreground">{active.name}</span>
                            <span className="text-xs text-muted-foreground">{msg.time}</span>
                          </div>
                          <p className="text-sm leading-snug text-foreground sm:text-[15px] sm:leading-relaxed">{msg.body}</p>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex gap-2.5 rounded-md px-2 py-2 sm:gap-3 sm:px-3 sm:py-2.5",
                          isLast && "bg-muted/50"
                        )}
                      >
                        <Avatar className="mt-0.5 size-9 shrink-0 rounded-md border border-border/80 bg-muted sm:size-10">
                          <AvatarImage src={currentUserAvatar} alt="" />
                          <AvatarFallback className="rounded-md text-sm font-medium">You</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                            <span className="text-sm font-bold text-foreground">You</span>
                            <span className="text-xs text-muted-foreground">{msg.time}</span>
                          </div>
                          <p className="text-sm leading-snug text-foreground sm:text-[15px] sm:leading-relaxed">{msg.body}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 w-full shrink-0 space-y-2 sm:mt-5">
                  {active.timeline.map((line) => (
                    <div key={line} className="flex items-center gap-2 sm:gap-3">
                      <div className="h-px flex-1 bg-border" />
                      <span className="shrink-0 px-1.5 text-center text-[11px] font-medium text-muted-foreground sm:px-2 sm:text-xs">
                        {line}
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  ))}
                </div>
                <div
                  className="mt-2 min-h-0 flex-1 border-t border-border/40 bg-muted/30 sm:mt-3"
                  aria-hidden
                />
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-border bg-card px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-5 sm:py-2.5 md:px-6">
            <div className="w-full rounded-lg border border-border bg-background shadow-sm">
              <textarea
                rows={2}
                placeholder={`Message ${active.name} · ${active.workItem.id}`}
                className="w-full min-h-[3.25rem] resize-y rounded-t-lg border-0 bg-transparent px-3 py-2.5 text-sm outline-none ring-0 placeholder:text-muted-foreground focus-visible:ring-0 sm:min-h-[4rem] sm:px-4 sm:py-3 md:min-h-[4.25rem] md:text-[15px]"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/80 px-1.5 py-1.5 sm:px-2 sm:py-2">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-0.5 sm:gap-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 shrink-0 rounded-full bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground sm:size-10"
                    aria-label="Attach file"
                  >
                    <PlusIcon className="size-[18px]" strokeWidth={1.75} />
                  </Button>
                  <Separator orientation="vertical" className="mx-0.5 h-5 self-center sm:mx-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 shrink-0 text-muted-foreground hover:text-foreground sm:size-10"
                    aria-label="Start huddle or video"
                  >
                    <VideoIcon className="size-[18px]" strokeWidth={1.75} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 shrink-0 text-muted-foreground hover:text-foreground sm:size-10"
                    aria-label="Record voice clip"
                  >
                    <MicIcon className="size-[18px]" strokeWidth={1.75} />
                  </Button>
                  <Separator orientation="vertical" className="mx-0.5 h-5 self-center sm:mx-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 shrink-0 text-muted-foreground hover:text-foreground sm:size-10"
                    aria-label="Emoji"
                  >
                    <SmileIcon className="size-[18px]" strokeWidth={1.75} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 shrink-0 text-muted-foreground hover:text-foreground sm:size-10"
                    aria-label="Mention someone"
                  >
                    <AtSignIcon className="size-[18px]" strokeWidth={1.75} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 shrink-0 text-muted-foreground hover:text-foreground sm:size-10"
                    aria-label="Text formatting"
                  >
                    <TypeIcon className="size-[18px]" strokeWidth={1.75} />
                  </Button>
                </div>
                <div className="flex shrink-0 items-stretch overflow-hidden rounded-lg shadow-none ring-1 ring-border">
                  <Button
                    type="button"
                    size="icon"
                    aria-label="Send message"
                    className="size-9 rounded-none rounded-l-lg sm:size-10"
                  >
                    <SendIcon className="size-[18px]" strokeWidth={1.75} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="More send options"
                          className="size-9 rounded-none rounded-r-lg border-l border-border px-0 text-muted-foreground hover:bg-muted/80 hover:text-foreground sm:size-10"
                        >
                          <ChevronDownIcon className="size-4 opacity-70" strokeWidth={2} />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="min-w-[12rem]">
                      <DropdownMenuItem>Schedule for later</DropdownMenuItem>
                      <DropdownMenuItem>Send and mark as read</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Help"
        className="pointer-events-auto fixed bottom-6 right-4 z-10 size-11 rounded-full border-border bg-card shadow-md max-md:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] md:bottom-8 md:right-8"
      >
        <HelpCircleIcon className="size-5 text-muted-foreground" strokeWidth={1.75} />
      </Button>
    </div>
  )
}
