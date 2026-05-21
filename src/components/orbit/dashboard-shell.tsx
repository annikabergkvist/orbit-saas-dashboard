"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronDownIcon,
  MessageCircleIcon,
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

function headerTitle(pathname: string): string | null {
  if (pathname === "/messages") return null
  if (pathname === "/projects" || pathname.startsWith("/projects/")) return null
  if (pathname === "/") return "Dashboard"
  return "Orbit"
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const title = headerTitle(pathname)

  return (
    <SidebarProvider defaultOpen>
      <OrbitAppSidebar />

      <SidebarInset className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-card px-8">
          {title != null ? (
            <div className="text-lg font-semibold">{title}</div>
          ) : null}
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/messages"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "relative"
              )}
              aria-label="Messages"
            >
              <span className="relative inline-flex">
                <MessageCircleIcon className="size-5" strokeWidth={1.75} />
                <span
                  className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary ring-2 ring-card"
                  aria-hidden="true"
                />
              </span>
            </Link>
            <NotificationsPopover />

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="gap-3 px-3 py-2">
                    <Avatar size="md" className="bg-muted text-foreground">
                      <AvatarImage
                        src="https://randomuser.me/api/portraits/women/68.jpg"
                        alt="Annika Bergkvist"
                      />
                      <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                        AB
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium md:inline">Annika Bergkvist</span>
                    <ChevronDownIcon className="hidden size-4 md:inline" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
