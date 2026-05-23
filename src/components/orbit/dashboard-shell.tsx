"use client"



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

      <DropdownMenuContent align="end" glass>

        <DropdownMenuItem>Profile</DropdownMenuItem>

        <DropdownMenuItem>Settings</DropdownMenuItem>

        <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>

  )

}



/** Routes that render their own page title in content — shell header stays actions-only on the left. */

function pageHasOwnTitle(pathname: string): boolean {

  return (

    pathname === "/messages" ||

    pathname === "/projects" ||

    pathname.startsWith("/projects/")

  )

}



function shellHeaderTitle(pathname: string): string | null {

  if (pathname === "/") return null

  if (pageHasOwnTitle(pathname)) return null

  if (pathname === "/issues") return "Issues"

  if (pathname === "/team") return "Team"

  if (pathname === "/settings") return "Settings"

  return "Orbit"

}



function AppShellHeader({ pathname }: { pathname: string }) {

  const title = shellHeaderTitle(pathname)

  const isHome = pathname === "/"



  return (

    <header className="flex h-16 shrink-0 items-center gap-4 px-8 lg:px-10">

      {isHome ? (

        <h1 className="shrink-0 text-2xl font-bold tracking-tight text-foreground">

          Hello, {userFirstName(currentUser.name)}

        </h1>

      ) : title != null ? (

        <h1 className="shrink-0 text-2xl font-bold tracking-tight text-foreground">

          {title}

        </h1>

      ) : (

        <div className="min-w-0 flex-1" />

      )}



      <div className="ml-auto flex min-w-0 items-center gap-4">
        <label className="dashboard-header-search relative hidden h-10 min-w-0 items-center gap-2.5 rounded-full px-4 sm:flex sm:w-[min(100%,36rem)] lg:w-[38rem]">

          <SearchIcon

            className="size-[18px] shrink-0 text-muted-foreground"

            strokeWidth={1.75}

            aria-hidden

          />

          <input

            type="search"

            placeholder="Search..."

            className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"

            aria-label="Search"

          />

        </label>



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


