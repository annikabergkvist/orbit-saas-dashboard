import { CURRENT_USER_ID } from "@/lib/team-data"

/** First + last initial, uppercase. Shared by avatars across the app. */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function isCurrentUserId(id: string): boolean {
  return id === CURRENT_USER_ID
}

/** Roster label: "Annika Bergkvist (Me)". */
export function withMeLabel(id: string, name: string): string {
  return isCurrentUserId(id) ? `${name} (Me)` : name
}

/** Compact filter label: "Me" vs the person's name. */
export function assigneeShortLabel(id: string, name: string): string {
  return isCurrentUserId(id) ? "Me" : name
}

export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}

/** Completed work titles — muted + strike, token-based (no hex). */
export const completedTitleClass =
  "text-muted-foreground line-through decoration-muted-foreground/80 decoration-1"

export const metaTextClass = "text-[13px] text-muted-foreground"
