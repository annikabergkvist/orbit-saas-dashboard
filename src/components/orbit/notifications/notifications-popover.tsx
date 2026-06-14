"use client"

import * as React from "react"
import Link from "next/link"
import { BellIcon, ExternalLinkIcon, FileTextIcon } from "lucide-react"

import {
  formatNotificationText,
  isUnread,
  seedNotifications,
  type Notification,
} from "@/lib/notifications"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("")
}

function formatRelativeTime(iso: string) {
  const deltaMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.max(0, Math.floor(deltaMs / 60_000))
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} minutes ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  return `${days} days ago`
}

function NotificationRow({
  notification,
  onMarkRead,
}: {
  notification: Notification
  onMarkRead: (id: string) => void
}) {
  const unread = isUnread(notification)
  const text = formatNotificationText(notification)
  const ctas = notification.ctas ?? []

  return (
    <div className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 rounded-sm px-3 py-2 transition-colors hover:bg-accent">
      <Avatar size="md" className="mt-0.5 bg-muted text-foreground">
        {notification.actor.avatarUrl ? (
          <AvatarImage src={notification.actor.avatarUrl} alt="" />
        ) : null}
        <AvatarFallback className="bg-muted text-xs font-semibold">
          {initials(notification.actor.name)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <Link
          href={notification.entity.href}
          onClick={() => {
            if (unread) onMarkRead(notification.id)
          }}
          className="block outline-none"
        >
          <p className="min-w-0 text-sm leading-snug">
            <span className="font-medium text-foreground">{text.actor}</span>{" "}
            <span className="text-muted-foreground">{text.verb}</span>{" "}
            <span className="font-semibold text-foreground">{text.entityName}</span>
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
            <span>{formatRelativeTime(notification.createdAt)}</span>
            {notification.project ? (
              <>
                <span aria-hidden>·</span>
                <span className="truncate">{notification.project.name}</span>
              </>
            ) : null}
          </div>
        </Link>

        {ctas.length > 0 ? (
          <div className="mt-2 flex items-center gap-2">
            {ctas.map((cta) =>
              cta.kind === "link" ? (
                <Link
                  key={`${notification.id}-${cta.label}`}
                  href={cta.href}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "xs",
                      className: "bg-background shadow-none",
                    })
                  )}
                  onClick={() => {
                    if (unread) onMarkRead(notification.id)
                  }}
                >
                  {cta.label}
                </Link>
              ) : (
                <Button
                  key={`${notification.id}-${cta.actionId}`}
                  type="button"
                  variant={cta.actionId === "deny" ? "destructive" : "outline"}
                  size="xs"
                  className={cn(
                    "shadow-none",
                    cta.actionId === "deny" ? "" : "bg-background"
                  )}
                  onClick={() => {
                    if (unread) onMarkRead(notification.id)
                  }}
                >
                  {cta.label}
                </Button>
              )
            )}
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2 pt-1">
        {unread ? (
          <span
            className="mt-0.5 size-2 rounded-full bg-primary ring-2 ring-popover"
            aria-label="Unread"
          />
        ) : (
          <span className="size-2" aria-hidden />
        )}
      </div>

      {notification.category === "comment" && notification.commentPreview ? (
        <div className="col-span-3 mt-3">
          <div className="rounded-lg bg-muted/35 px-3 py-2.5">
            <div className="grid grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1">
              <div className="inline-flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-sm">
                <FileTextIcon className="size-4" strokeWidth={2} />
              </div>

              <div className="min-w-0 truncate text-[11px] font-semibold text-foreground">
                {notification.commentPreview.title}
              </div>

              <Link
                href={notification.commentPreview.href}
                className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-primary underline underline-offset-4 hover:text-primary/90"
                onClick={() => {
                  if (unread) onMarkRead(notification.id)
                }}
              >
                Open file
                <ExternalLinkIcon className="size-3.5" strokeWidth={1.75} />
              </Link>

              <p className="col-start-2 col-span-2 mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                {notification.commentPreview.summary}
              </p>
            </div>
          </div>

          <Link
            href={notification.commentPreview.threadHref}
            className="mt-2 inline-flex text-xs font-medium text-muted-foreground/90 underline-offset-4 hover:text-foreground hover:underline"
            onClick={() => {
              if (unread) onMarkRead(notification.id)
            }}
          >
            View {notification.commentPreview.moreCount} more comments
          </Link>
        </div>
      ) : null}
    </div>
  )
}

export function NotificationsPopover({
  triggerClassName,
  unreadDotClassName,
  iconClassName,
}: {
  triggerClassName?: string
  unreadDotClassName?: string
  iconClassName?: string
} = {}) {
  const [notifications, setNotifications] = React.useState<Notification[]>(
    seedNotifications
  )
  const [popoverOpen, setPopoverOpen] = React.useState(false)
  const [notificationsTab, setNotificationsTab] = React.useState<
    "unread" | "all"
  >("all")

  const unreadCount = React.useMemo(
    () => notifications.filter(isUnread).length,
    [notifications]
  )

  function markAllAsRead() {
    const now = new Date().toISOString()
    setNotifications((prev) =>
      prev.map((n) => (isUnread(n) ? { ...n, readAt: now } : n))
    )
  }

  function markRead(id: string) {
    const now = new Date().toISOString()
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: now } : n))
    )
  }

  const unreadNotifications = notifications.filter(isUnread)

  return (
    <TooltipProvider>
      <Popover
        open={popoverOpen}
        onOpenChange={(open) => {
          setPopoverOpen(open)
          if (open) setNotificationsTab("all")
        }}
      >
        <Tooltip>
          <TooltipTrigger
            render={
              <PopoverTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={
                      unreadCount > 0
                        ? `Notifications (${unreadCount} unread)`
                        : "Notifications"
                    }
                    className={cn("relative", triggerClassName)}
                  >
                    <span className="relative inline-flex">
                      <BellIcon
                        className={cn("size-5", iconClassName)}
                        strokeWidth={1.75}
                      />
                      {unreadCount > 0 ? (
                        <span
                          className={cn(
                            "absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary ring-2 ring-card",
                            unreadDotClassName
                          )}
                          aria-hidden="true"
                        />
                      ) : null}
                    </span>
                  </Button>
                }
              />
            }
          />
          {unreadCount > 0 ? (
            <TooltipContent side="bottom" align="end" sideOffset={10}>
              {unreadCount > 9 ? "9+" : unreadCount} unread
            </TooltipContent>
          ) : null}
        </Tooltip>

        <PopoverContent
          align="end"
          side="bottom"
          sideOffset={8}
          className="w-[380px] overflow-hidden rounded-md p-0 shadow-lg ring-1 ring-foreground/5"
        >
          <div className="flex items-start justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Notifications</p>
              <p className="truncate text-sm font-semibold text-foreground">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "You're all caught up"}
              </p>
            </div>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto shrink-0 px-0 py-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </div>

          <Separator className="my-0" />

          <div className="px-4 py-3">
            <Tabs
              value={notificationsTab}
              onValueChange={(value) => {
                if (value === "unread" || value === "all") {
                  setNotificationsTab(value)
                }
              }}
            >
              <TabsList className="w-full justify-between">
                <TabsTrigger value="unread" className="flex-1 justify-center">
                  Unread
                  {unreadCount > 0 ? (
                    <span className="ml-1.5 rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {unreadCount}
                    </span>
                  ) : null}
                </TabsTrigger>
                <TabsTrigger value="all" className="flex-1 justify-center">
                  All
                </TabsTrigger>
              </TabsList>

              <TabsContent value="unread" className="mt-3">
                <div className="max-h-[420px] overflow-auto">
                  {unreadNotifications.length === 0 ? (
                    <div className="rounded-sm px-3 py-8 text-center text-sm text-muted-foreground">
                      You&apos;re all caught up.
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {unreadNotifications.map((n) => (
                        <NotificationRow
                          key={n.id}
                          notification={n}
                          onMarkRead={markRead}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="all" className="mt-3">
                <div className="max-h-[420px] overflow-auto">
                  <div className="space-y-1">
                    {notifications.map((n) => (
                      <NotificationRow
                        key={n.id}
                        notification={n}
                        onMarkRead={markRead}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {unreadCount === 0 && notificationsTab === "all" ? (
            <>
              <Separator className="my-0" />
              <div className="px-4 py-3 text-center text-xs text-muted-foreground">
                You&apos;re all caught up
              </div>
            </>
          ) : null}
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}

