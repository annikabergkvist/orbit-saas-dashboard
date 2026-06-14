"use client"

import * as React from "react"
import type { ReactNode } from "react"

import Link from "next/link"

import { usePathname } from "next/navigation"

import {

  ChevronDownIcon,

  MessageCircleIcon,

  SearchIcon,

} from "lucide-react"



import { OrbitAppSidebar } from "@/components/orbit/app-sidebar"

import { NotificationsPopover } from "@/components/orbit/notifications/notifications-popover"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Button, buttonVariants } from "@/components/ui/button"

import {

  DropdownMenu,

  DropdownMenuContent,

  DropdownMenuItem,

  DropdownMenuSeparator,

  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"



const currentUser = {
  name: "Annika Bergkvist",
  email: "annika@orbit.app",
  avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
}

/** Frosted hover for top-bar icon buttons and profile (overrides ghost `hover:bg-muted`). */
const headerActionClass = cn(
  "header-action-hover hover:bg-white/35 hover:text-foreground hover:backdrop-blur-sm",
  "hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.55)] active:bg-white/25",
  "aria-expanded:bg-white/40 aria-expanded:shadow-[inset_0_1px_0_rgb(255_255_255/0.55)]"
)



function userFirstName(fullName: string) {
  return fullName.split(/\s+/)[0] ?? fullName
}

function getTimeBasedGreeting(firstName: string): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return `Good morning, ${firstName}`
  if (hour >= 12 && hour < 18) return `Good afternoon, ${firstName}`
  return `Good evening, ${firstName}`
}

function DashboardHomeHeader({ firstName }: { firstName: string }) {
  const [greeting, setGreeting] = React.useState<string | null>(null)

  React.useEffect(() => {
    setGreeting(getTimeBasedGreeting(firstName))
  }, [firstName])

  return (
    <div className="min-w-0 shrink-0">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
      {greeting != null ? (
        <p className="mt-0.5 text-[13px] text-muted-foreground">{greeting}</p>
      ) : null}
    </div>
  )
}

function shellHeaderTitle(pathname: string): string | null {
  if (pathname === "/") return null
  if (pathname === "/messages") return "Messages"
  if (pathname === "/projects" || pathname.startsWith("/projects/")) return "Projects"
  if (pathname === "/issues") return "Issues"
  if (pathname === "/team") return "Team"
  if (pathname === "/settings") return "Settings"
  return null
}



function HeaderExpandableSearch() {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  React.useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  return (
    <div ref={containerRef} className="flex flex-row-reverse items-center">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("size-9 shrink-0 rounded-full", headerActionClass)}
        aria-label={open ? "Close search" : "Open search"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <SearchIcon className="size-5" strokeWidth={1.75} />
      </Button>

      <div
        className={cn(
          "dashboard-header-search flex h-10 items-center overflow-hidden rounded-full transition-[width] duration-200 ease-in-out",
          open ? "w-[240px]" : "w-0"
        )}
      >
        <input
          ref={inputRef}
          type="search"
          placeholder="Search... ⌘K"
          aria-label="Search"
          tabIndex={open ? 0 : -1}
          className="h-full w-[240px] shrink-0 bg-transparent px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>
    </div>
  )
}

function UserAccountMenu({ compactOnMobile = true }: { compactOnMobile?: boolean }) {

  return (

    <DropdownMenu>

      <DropdownMenuTrigger

        render={

          <Button
            variant="ghost"
            className={cn(
              "h-auto gap-2 rounded-xl px-3 py-2 sm:gap-3 sm:px-4 sm:py-1.5",
              headerActionClass
            )}
          >
            <Avatar size="md" className="bg-muted text-foreground">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
              <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                AB
              </AvatarFallback>
            </Avatar>

            <span
              className={cn(
                "text-sm font-medium",
                compactOnMobile && "hidden md:inline"
              )}
            >
              {currentUser.name}
            </span>

            <ChevronDownIcon
              className={cn("size-4", compactOnMobile && "hidden md:inline")}
            />

          </Button>

        }

      />

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 overflow-hidden rounded-md p-0 shadow-lg ring-1 ring-foreground/5"
      >
        <div className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Signed in as</p>
          <p className="truncate text-sm font-semibold text-foreground">
            {currentUser.email}
          </p>
        </div>

        <DropdownMenuSeparator className="my-0" />

        <div className="p-1">
          <DropdownMenuItem className="rounded-sm px-3 py-2">
            Account settings
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-sm px-3 py-2">Support</DropdownMenuItem>
          <DropdownMenuItem className="rounded-sm px-3 py-2">License</DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="my-0" />

        <div className="p-1">
          <DropdownMenuItem className="rounded-sm px-3 py-2">Sign out</DropdownMenuItem>
        </div>
      </DropdownMenuContent>

    </DropdownMenu>

  )

}



function AppShellHeader({ pathname }: { pathname: string }) {
  const title = shellHeaderTitle(pathname)
  const isHome = pathname === "/"

  return (
    <header
      className={cn(
        "flex shrink-0 items-center gap-4 px-8 lg:px-10",
        isHome ? "min-h-16 py-3" : "h-16"
      )}
    >
      {isHome ? (
        <DashboardHomeHeader firstName={userFirstName(currentUser.name)} />
      ) : title != null ? (
        <h1 className="shrink-0 text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
      ) : (
        <div className="min-w-0 flex-1" />
      )}



      <div className="ml-auto flex min-w-0 items-center gap-4">
        <HeaderExpandableSearch />

        <div className="flex shrink-0 items-center gap-1">
          <div className="flex items-center gap-0">
            <Link
              href="/messages"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "relative size-9 rounded-full",
                headerActionClass
              )}
              aria-label="Messages"
            >
              <span className="relative inline-flex">
                <MessageCircleIcon className="size-5" strokeWidth={1.75} />
                <span
                  className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary ring-2 ring-[var(--dashboard-mesh-base)]"
                  aria-hidden="true"
                />
              </span>
            </Link>

            <NotificationsPopover
              triggerClassName={cn("size-9 rounded-full", headerActionClass)}
              unreadDotClassName="ring-[var(--dashboard-mesh-base)]"
            />
          </div>

          <UserAccountMenu />
        </div>

      </div>

    </header>

  )

}



export function DashboardShell({ children }: { children: ReactNode }) {

  const pathname = usePathname()



  return (

    <SidebarProvider defaultOpen className="min-h-svh bg-transparent">

      <OrbitAppSidebar />



      <SidebarInset className="flex min-h-0 min-w-0 flex-1 flex-col !bg-transparent">

        <AppShellHeader pathname={pathname} />

        <div className="flex min-h-0 flex-1 flex-col">{children}</div>

      </SidebarInset>

    </SidebarProvider>

  )

}


