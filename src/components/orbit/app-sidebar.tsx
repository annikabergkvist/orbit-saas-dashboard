"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HomeIcon,
  FolderKanbanIcon,
  BugIcon,
  UsersIcon,
  SettingsIcon,
  PlusIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Home", href: "/", icon: HomeIcon },
  { title: "Projects", href: "/projects", icon: FolderKanbanIcon },
  { title: "Issues", href: "/issues", icon: BugIcon },
  { title: "Team", href: "/team", icon: UsersIcon },
  { title: "Settings", href: "/settings", icon: SettingsIcon },
] as const

export function OrbitAppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* Brand + global search (mirrors Linear-style sidebar patterns). */}
      <SidebarHeader className="gap-3 p-3">
        <div className="flex items-center gap-2">
          <div className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <span className="text-xs font-semibold leading-none">O</span>
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-sm font-semibold">Orbit</div>
          </div>
        </div>

        <div className="px-0.5">
          <SidebarInput placeholder="Search" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Primary navigation. "tooltip" becomes useful when sidebar is collapsed to icon-only mode. */}
        <SidebarGroup className="py-1">
          <SidebarMenu>
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={active}
                    tooltip={item.title}
                    render={
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {/* Primary call-to-action. We'll wire this up to a create-issue flow later. */}
        <Button className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center">
          <PlusIcon />
          <span className="group-data-[collapsible=icon]:hidden">New Issue</span>
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

