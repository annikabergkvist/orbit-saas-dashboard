"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HouseIcon,
  LayoutGridIcon,
  MessageCircleIcon,
  SquareCheckIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const tabs: {
  title: string
  href: string
  icon: LucideIcon
  match: (pathname: string) => boolean
  unread?: number
}[] = [
  {
    title: "Home",
    href: "/",
    icon: HouseIcon,
    match: (pathname) => pathname === "/",
  },
  {
    title: "Projects",
    href: "/projects",
    icon: LayoutGridIcon,
    match: (pathname) => pathname === "/projects" || pathname.startsWith("/projects/"),
  },
  {
    title: "Issues",
    href: "/issues",
    icon: SquareCheckIcon,
    match: (pathname) => pathname === "/issues" || pathname.startsWith("/issues/"),
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageCircleIcon,
    match: (pathname) => pathname === "/messages",
    unread: 3,
  },
  {
    title: "Team",
    href: "/team",
    icon: UsersIcon,
    match: (pathname) => pathname === "/team",
  },
]

export function MobileTabBar() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  return (
    <nav
      aria-label="Primary"
      className="glass-subtle shrink-0 rounded-none border-t border-white/50 px-1 pt-1 shadow-none dark:border-violet-500/20 md:hidden"
      style={{ paddingBottom: "max(0.35rem, env(safe-area-inset-bottom))" }}
    >
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const active = tab.match(pathname)
          const unread = tab.unread ?? 0
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpenMobile(false)}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[11px] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground active:bg-white/30 dark:active:bg-violet-950/40"
                )}
              >
                <span className="relative inline-flex">
                  <tab.icon
                    className="size-5"
                    strokeWidth={active ? 2.25 : 1.75}
                    aria-hidden
                  />
                  {unread > 0 ? (
                    <span
                      className="absolute -right-2 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground"
                      aria-hidden
                    >
                      {unread > 9 ? "9+" : unread}
                    </span>
                  ) : null}
                </span>
                {tab.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
