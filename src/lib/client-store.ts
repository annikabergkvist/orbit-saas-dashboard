/**
 * Browser-local persistence for the Orbit portfolio demo.
 * In production these keys would be replaced by API-backed user/workspace state.
 */

import type { BoardTask } from "@/lib/projects-data"
import type { Issue } from "@/lib/issues-data"
import {
  integrations,
  notificationPreferences,
  type IntegrationId,
  type NotificationPreferenceKey,
} from "@/lib/settings-data"
import { CURRENT_USER_ID, teamMembersSeed, type TeamMember } from "@/lib/team-data"

export const STORE_EVENT = "orbit:store-updated"

export const STORAGE_KEYS = {
  auth: "orbit:auth",
  integrations: "orbit:integrations",
  notificationPrefs: "orbit:notification-prefs",
  userProfile: "orbit:user-profile",
  issues: "orbit:issues",
  boardTasks: "orbit:board-tasks",
  messages: "orbit:messages",
  completedIssueIds: "orbit:completed-issue-ids",
} as const

export type UserProfilePatch = {
  name?: string
  role?: string
  bio?: string
  avatarUrl?: string
}

export type AuthSession = {
  email: string
  signedInAt: string
}

export type StoredMessage = {
  id: string
  role: "them" | "me"
  body: string
  time: string
}

function isBrowser() {
  return typeof window !== "undefined"
}

function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJSON(key: string, value: unknown) {
  if (!isBrowser()) return
  window.localStorage.setItem(key, JSON.stringify(value))
  queueMicrotask(() => {
    window.dispatchEvent(new CustomEvent(STORE_EVENT, { detail: { key } }))
  })
}

export function subscribeStore(listener: () => void) {
  if (!isBrowser()) return () => undefined
  const handler = () => listener()
  window.addEventListener(STORE_EVENT, handler)
  window.addEventListener("storage", handler)
  return () => {
    window.removeEventListener(STORE_EVENT, handler)
    window.removeEventListener("storage", handler)
  }
}

export function getDefaultIntegrationState(): Record<IntegrationId, boolean> {
  return Object.fromEntries(
    integrations.map((item) => [item.id, item.connected])
  ) as Record<IntegrationId, boolean>
}

export function getIntegrationState(): Record<IntegrationId, boolean> {
  return readJSON(STORAGE_KEYS.integrations, getDefaultIntegrationState())
}

export function setIntegrationState(state: Record<IntegrationId, boolean>) {
  writeJSON(STORAGE_KEYS.integrations, state)
}

export function isGoogleCalendarConnected(): boolean {
  return getIntegrationState().google_calendar
}

export function getDefaultNotificationPrefs(): Record<NotificationPreferenceKey, boolean> {
  return Object.fromEntries(
    notificationPreferences.map((pref) => [pref.id, pref.defaultEnabled])
  ) as Record<NotificationPreferenceKey, boolean>
}

export function getNotificationPrefs(): Record<NotificationPreferenceKey, boolean> {
  return readJSON(STORAGE_KEYS.notificationPrefs, getDefaultNotificationPrefs())
}

export function setNotificationPrefs(prefs: Record<NotificationPreferenceKey, boolean>) {
  writeJSON(STORAGE_KEYS.notificationPrefs, prefs)
}

export function getUserProfilePatch(): UserProfilePatch {
  return readJSON<UserProfilePatch>(STORAGE_KEYS.userProfile, {})
}

export function setUserProfilePatch(patch: UserProfilePatch) {
  writeJSON(STORAGE_KEYS.userProfile, patch)
}

export function getCurrentUserWithPatch(): TeamMember {
  const base = teamMembersSeed.find((m) => m.id === CURRENT_USER_ID)
  if (!base) {
    throw new Error(`Current user "${CURRENT_USER_ID}" is missing from teamMembersSeed`)
  }
  const patch = getUserProfilePatch()
  return { ...base, ...patch }
}

export function getAuthSession(): AuthSession | null {
  return readJSON<AuthSession | null>(STORAGE_KEYS.auth, null)
}

export function setAuthSession(session: AuthSession | null) {
  if (session == null) {
    if (isBrowser()) window.localStorage.removeItem(STORAGE_KEYS.auth)
    if (isBrowser()) {
      queueMicrotask(() => {
        window.dispatchEvent(
          new CustomEvent(STORE_EVENT, { detail: { key: STORAGE_KEYS.auth } })
        )
      })
    }
    return
  }
  writeJSON(STORAGE_KEYS.auth, session)
}

export function loadPersistedIssues(fallback: Issue[]): Issue[] {
  const stored = readJSON<Issue[] | null>(STORAGE_KEYS.issues, null)
  return stored ?? fallback
}

export function savePersistedIssues(issues: Issue[]) {
  writeJSON(STORAGE_KEYS.issues, issues)
}

export function loadBoardTasks(projectSlug: string, fallback: BoardTask[]): BoardTask[] {
  const all = readJSON<Record<string, BoardTask[]>>(STORAGE_KEYS.boardTasks, {})
  return all[projectSlug] ?? fallback
}

export function saveBoardTasks(projectSlug: string, tasks: BoardTask[]) {
  const all = readJSON<Record<string, BoardTask[]>>(STORAGE_KEYS.boardTasks, {})
  all[projectSlug] = tasks
  writeJSON(STORAGE_KEYS.boardTasks, all)
}

export function getCompletedIssueIds(): Set<string> {
  return new Set(readJSON<string[]>(STORAGE_KEYS.completedIssueIds, []))
}

export function setCompletedIssueIds(ids: Set<string>) {
  writeJSON(STORAGE_KEYS.completedIssueIds, [...ids])
}

export function loadConversationMessages(
  conversationId: string,
  fallback: StoredMessage[]
): StoredMessage[] {
  const all = readJSON<Record<string, StoredMessage[]>>(STORAGE_KEYS.messages, {})
  return all[conversationId] ?? fallback
}

export function saveConversationMessages(conversationId: string, messages: StoredMessage[]) {
  const all = readJSON<Record<string, StoredMessage[]>>(STORAGE_KEYS.messages, {})
  all[conversationId] = messages
  writeJSON(STORAGE_KEYS.messages, all)
}

export function clearAllOrbitData() {
  if (!isBrowser()) return
  for (const key of Object.values(STORAGE_KEYS)) {
    window.localStorage.removeItem(key)
  }
  queueMicrotask(() => {
    window.dispatchEvent(new CustomEvent(STORE_EVENT, { detail: { key: "all" } }))
  })
}
