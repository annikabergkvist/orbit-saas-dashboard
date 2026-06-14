"use client"



import * as React from "react"

import Link from "next/link"

import { usePathname } from "next/navigation"

import {

  HouseIcon,

  LayoutGridIcon,

  MessageCircleIcon,

  SquareCheckIcon,

  UsersIcon,

  SettingsIcon,

  PlusIcon,

  type LucideIcon,

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

  SidebarSeparator,

} from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"



const navItems: {

  title: string

  href: string

  icon: LucideIcon

  /** When set, shows a primary dot on the icon and a count pill on the right. */

  unreadCount?: number

}[] = [

  { title: "Dashboard", href: "/", icon: HouseIcon },

  { title: "Messages", href: "/messages", icon: MessageCircleIcon, unreadCount: 5 },

  { title: "Projects", href: "/projects", icon: LayoutGridIcon },

  { title: "Issues", href: "/issues", icon: SquareCheckIcon },

  { title: "Team", href: "/team", icon: UsersIcon },

  { title: "Settings", href: "/settings", icon: SettingsIcon },

]



export function OrbitAppSidebar() {

  const pathname = usePathname()



  return (

    <Sidebar

      collapsible="icon"

      variant="sidebar"

      innerClassName="sidebar-glass"

      className="border-r-transparent"

    >

      <SidebarHeader className="gap-5 px-7 pt-7 pb-5">

        <div className="min-w-0 group-data-[collapsible=icon]:hidden">

          <div className="truncate text-md font-semibold">Orbit</div>

        </div>

      </SidebarHeader>



      <SidebarSeparator className="my-2 data-horizontal:w-[calc(100%-3rem)] bg-white/25" />



      <SidebarContent>

        <SidebarGroup className="px-3 py-1">

          <SidebarMenu className="gap-0">

            {navItems.map((item) => {

              const active =

                pathname === item.href ||

                (item.href !== "/" && pathname.startsWith(`${item.href}/`))

              const unread = item.unreadCount ?? 0

              const showUnread = unread > 0

              return (

                <SidebarMenuItem key={item.href}>

                  <SidebarMenuButton

                    isActive={active}

                    tooltip={item.title}

                    size="lg"

                    className="bg-transparent px-2 hover:bg-transparent active:bg-transparent data-active:bg-transparent data-active:font-semibold"

                    render={

                      <Link href={item.href}>

                        <span

                          className={cn(

                            "flex w-full min-w-0 items-center gap-2 rounded-xl px-3 py-2 transition-colors",

                            "group-hover/menu-button:bg-white/20 group-hover/menu-button:backdrop-blur-sm group-hover/menu-button:text-foreground",

                            "group-data-[active]/menu-button:bg-white/45 group-data-[active]/menu-button:font-semibold group-data-[active]/menu-button:text-foreground group-data-[active]/menu-button:shadow-sm",

                            "group-data-[active]/menu-button:backdrop-blur-md group-data-[active]/menu-button:ring-1 group-data-[active]/menu-button:ring-white/50"

                          )}

                        >

                          {showUnread ? (

                            <span className="relative inline-flex shrink-0">

                              <item.icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />

                              <span

                                className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary ring-2 ring-transparent"

                                aria-hidden

                              />

                            </span>

                          ) : (

                            <item.icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />

                          )}

                          <span className="min-w-0 flex-1 truncate">{item.title}</span>

                          {showUnread ? (

                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[0.65rem] font-semibold leading-none text-primary-foreground group-data-[collapsible=icon]:hidden">

                              {unread > 99 ? "99+" : unread}

                            </span>

                          ) : null}

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



      <SidebarSeparator className="my-2 data-horizontal:w-[calc(100%-3rem)] bg-white/25" />



      <SidebarFooter className="px-5 pt-2 pb-5">

        <Button

          variant="default"

          size="lg"

          nativeButton={false}

          className="h-10 w-full justify-center gap-2 px-4 group-data-[collapsible=icon]:justify-center"

          render={<Link href="/issues?new=1" />}

        >

          <PlusIcon />

          <span className="group-data-[collapsible=icon]:hidden">New Issue</span>

        </Button>

      </SidebarFooter>

    </Sidebar>

  )

}


