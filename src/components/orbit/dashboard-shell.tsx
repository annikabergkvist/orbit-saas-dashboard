"use client"

import * as React from "react"
import type { ReactNode } from "react"

import Link from "next/link"

import { usePathname, useRouter } from "next/navigation"

import {
  ChevronDownIcon,
  MessageCircleIcon,
} from "lucide-react"

import { OrbitAppSidebar } from "@/components/orbit/app-sidebar"
import { MobileTabBar } from "@/components/orbit/mobile-tab-bar"
import { NotificationsPopover } from "@/components/orbit/notifications/notifications-popover"
import { ThemeToggle } from "@/components/orbit/theme-toggle"
import {
  HeaderAppSearch,
  useHeaderSearchShortcut,
} from "@/components/orbit/search/header-app-search"
import { AuthGate } from "@/components/orbit/auth/auth-gate"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useCurrentUser } from "@/hooks/use-orbit-store"
import { setAuthSession } from "@/lib/client-store"
import { cn } from "@/lib/utils"

/** Frosted hover for top-bar icon buttons and profile (overrides ghost `hover:bg-muted`). */
const headerActionClass = cn(
  "header-action-hover hover:bg-white/35 hover:text-foreground hover:backdrop-blur-sm",
  "hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.55)] active:bg-white/25",
  "aria-expanded:bg-white/40 aria-expanded:shadow-[inset_0_1px_0_rgb(255_255_255/0.55)]",
  "dark:hover:bg-white/10 dark:active:bg-white/5 dark:aria-expanded:bg-white/12",
  "dark:hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] dark:aria-expanded:shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]"
)



function userFirstName(fullName: string) {
  return fullName.split(/\s+/)[0] ?? fullName
}

function userInitials(fullName: string) {
  return fullName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function getTimeBasedGreeting(firstName: string): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return `Good morning, ${firstName}`
  if (hour >= 12 && hour < 18) return `Good afternoon, ${firstName}`
  return `Good evening, ${firstName}`
}

function DashboardHomeHeader({ firstName }: { firstName: string }) {
  const [greeting, setGreeting] = React.useState<string | null>(null)

  // The greeting depends on the visitor's local clock, which can differ from
  // the server's render time, so it's computed post-mount to avoid a
  // hydration mismatch.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(getTimeBasedGreeting(firstName))
  }, [firstName])

  return (
    <div className="min-w-0 shrink">
      <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Dashboard</h1>
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
  if (pathname === "/settings") return null
  return null
}



function UserAccountMenu({
  compactOnMobile = true,
  user,
}: {
  compactOnMobile?: boolean
  user: ReturnType<typeof useCurrentUser>
}) {
  const router = useRouter()
  const [supportOpen, setSupportOpen] = React.useState(false)
  const [licenseOpen, setLicenseOpen] = React.useState(false)

  function signOut() {
    setAuthSession(null)
    router.replace("/login")
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className={cn(
                "h-auto gap-1.5 rounded-xl px-1.5 py-1.5 sm:gap-3 sm:px-4 sm:py-1.5",
                headerActionClass
              )}
            >
              <Avatar size="md" className="bg-muted text-foreground">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                  {userInitials(user.name)}
                </AvatarFallback>
              </Avatar>

              <span
                className={cn(
                  "text-sm font-medium",
                  compactOnMobile && "hidden md:inline"
                )}
              >
                {user.name}
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
          glass
          className="w-56 overflow-hidden rounded-xl p-0"
        >
          <div className="px-4 py-3">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="truncate text-sm font-semibold text-foreground">{user.email}</p>
          </div>

          <DropdownMenuSeparator className="my-0" />

          <div className="p-1">
            <DropdownMenuItem
              className="rounded-sm px-3 py-2"
              render={<Link href="/settings" />}
              nativeButton={false}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-sm px-3 py-2"
              onClick={() => setSupportOpen(true)}
            >
              Support
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-sm px-3 py-2"
              onClick={() => setLicenseOpen(true)}
            >
              License
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator className="my-0" />

          <div className="p-1">
            <DropdownMenuItem className="rounded-sm px-3 py-2" onClick={signOut}>
              Sign out
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Support</DialogTitle>
            <DialogDescription>
              Orbit demo — reach the team at{" "}
              <a href="mailto:support@orbit.app" className="font-medium text-primary">
                support@orbit.app
              </a>
              . Typical response within one business day.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={licenseOpen} onOpenChange={setLicenseOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>License</DialogTitle>
            <DialogDescription>
              Orbit Team Plan (demo). Portfolio build — not licensed for production use.
              Includes unlimited projects, issues, and team seats for evaluation.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

function AppShellHeader({
  pathname,
  user,
  searchOpen,
  onSearchOpenChange,
}: {
  pathname: string
  user: ReturnType<typeof useCurrentUser>
  searchOpen: boolean
  onSearchOpenChange: (open: boolean) => void
}) {
  const isHome = pathname === "/"

  return (
    <header
      className={cn(
        "flex shrink-0 items-center gap-2 px-4 sm:gap-4 sm:px-8 lg:px-10",
        "pt-[max(0.5rem,env(safe-area-inset-top))]",
        isHome ? "min-h-16 pb-3" : "h-16 max-md:h-auto max-md:min-h-14 max-md:py-2"
      )}
    >
      {isHome ? (
        <DashboardHomeHeader firstName={userFirstName(user.name)} />
      ) : shellHeaderTitle(pathname) != null ? (
        <h1 className="min-w-0 shrink truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {shellHeaderTitle(pathname)}
        </h1>
      ) : (
        <div className="min-w-0 flex-1" />
      )}

      <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-4">
        <HeaderAppSearch
          open={searchOpen}
          onOpenChange={onSearchOpenChange}
          triggerClassName={headerActionClass}
        />

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <div className="flex items-center gap-0">
            <ThemeToggle className={cn("max-md:hidden", headerActionClass)} />

            <Link
              href="/messages"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "relative size-10 rounded-full md:size-9",
                "max-md:hidden",
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
              triggerClassName={cn("size-10 rounded-full md:size-9", headerActionClass)}
              unreadDotClassName="ring-[var(--dashboard-mesh-base)]"
            />
          </div>

          <UserAccountMenu user={user} />
        </div>
      </div>
    </header>
  )
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const user = useCurrentUser()
  const [searchOpen, setSearchOpen] = React.useState(false)

  useHeaderSearchShortcut(() => setSearchOpen(true))

  return (
    <AuthGate>
      <TooltipProvider delay={0}>
        <SidebarProvider
          defaultOpen
          className="min-h-svh bg-transparent"
          style={{ "--sidebar-width-icon": "4.25rem" } as React.CSSProperties}
        >
          <OrbitAppSidebar />

          <SidebarInset className="flex min-h-0 min-w-0 flex-1 flex-col !bg-transparent max-md:h-svh max-md:max-h-svh max-md:overflow-hidden">
            <AppShellHeader
              pathname={pathname}
              user={user}
              searchOpen={searchOpen}
              onSearchOpenChange={setSearchOpen}
            />
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:overflow-visible">
              {children}
            </div>
            <MobileTabBar />
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AuthGate>
  )
}


