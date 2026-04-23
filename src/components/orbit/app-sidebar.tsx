"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HouseIcon,
  LayoutGridIcon,
  SquareCheckIcon,
  SearchIcon,
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Home", href: "/", icon: HouseIcon },
  { title: "Projects", href: "/projects", icon: LayoutGridIcon },
  { title: "Issues", href: "/issues", icon: SquareCheckIcon },
  { title: "Team", href: "/team", icon: UsersIcon },
  { title: "Settings", href: "/settings", icon: SettingsIcon },
] as const

export function OrbitAppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* Brand + global search (mirrors Linear-style sidebar patterns). */}
      <SidebarHeader className="gap-5 px-7 pt-7 pb-5">
        <div className="flex items-center gap-2">
          <div className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <span className="text-s font-semibold leading-none">O</span>
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-md font-semibold">Orbit</div>
          </div>
        </div>
      </SidebarHeader>

      {/* Section divider between header and nav (matches reference). */}
      <SidebarSeparator className="my-2 w-[calc(100%-3rem)] self-center" />

      <SidebarContent>
        {/* Search row lives under the first separator (matches reference). */}
        <div className="px-5 pt-2 pb-3">
          <button
            type="button"
            className="group flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-muted-foreground outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <SearchIcon className="size-4" />
            <span className="flex-1 truncate">Search</span>
            <span className="px-2 py-0.5 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
              ⌘K
            </span>
          </button>
        </div>

        {/* Primary navigation. "tooltip" becomes useful when sidebar is collapsed to icon-only mode. */}
        <SidebarGroup className="px-3 py-1">
          <SidebarMenu className="gap-0">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={active}
                    tooltip={item.title}
                    size="lg"
                    // Keep the row height/spacing, but render a smaller inner "pill" for hover/active.
                    className="bg-transparent px-2 hover:bg-transparent active:bg-transparent data-active:bg-transparent data-active:font-semibold"
                    render={
                      <Link href={item.href}>
                        <span className="flex w-full items-center gap-2 rounded-md px-3 py-2 transition-colors group-hover/menu-button:bg-sidebar-accent group-hover/menu-button:text-sidebar-accent-foreground group-data-[active]/menu-button:bg-sidebar-accent group-data-[active]/menu-button:text-sidebar-accent-foreground">
                          <item.icon />
                          <span>{item.title}</span>
                        </span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Divider above the primary CTA. */}
      <SidebarSeparator className="my-2 w-[calc(100%-3rem)] self-center" />

      <SidebarFooter className="px-5 pt-2 pb-5">
        {/* Primary call-to-action. We'll wire this up to a create-issue flow later. */}
        <Button
          size="lg"
          className="h-10 w-full justify-center gap-2 px-4 group-data-[collapsible=icon]:justify-center"
        >
          <PlusIcon />
          <span className="group-data-[collapsible=icon]:hidden">New Issue</span>
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

