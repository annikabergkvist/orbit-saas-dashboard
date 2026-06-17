/**
 * User preference seeds for Settings — aligned with notification categories in notifications.ts.
 * NOTE: Toggles are local UI state for portfolio scope. In production these would persist
 * per user via API and drive notification delivery (email, in-app, push).
 */

export type SettingsTab =
  | "profile"
  | "account"
  | "notifications"
  | "appearance"
  | "integrations"

export const settingsTabs: {
  id: SettingsTab
  label: string
}[] = [
  { id: "profile", label: "Profile" },
  { id: "account", label: "Account" },
  { id: "notifications", label: "Notifications" },
  { id: "appearance", label: "Appearance" },
  { id: "integrations", label: "Integrations" },
]

export type AuthProviderId = "github" | "google" | "figma"

export type ConnectedAccount = {
  id: AuthProviderId
  name: string
  connected: boolean
  username?: string
  statusLabel?: string
}

/**
 * NOTE: OAuth connection state is stubbed for portfolio scope.
 * In production these would reflect linked providers from the auth service.
 */
export function getConnectedAccountsForUser(user: {
  githubUsername?: string
  figmaUsername?: string
}): ConnectedAccount[] {
  return [
    {
      id: "github",
      name: "GitHub",
      connected: Boolean(user.githubUsername),
      username: user.githubUsername,
    },
    {
      id: "figma",
      name: "Figma",
      connected: Boolean(user.figmaUsername),
      username: user.figmaUsername,
    },
    {
      id: "google",
      name: "Google",
      connected: false,
      statusLabel: "Not connected",
    },
  ]
}

export type NotificationPreferenceKey =
  | "mentions"
  | "assignments"
  | "status_changes"
  | "comments"
  | "email_digest"

export type NotificationPreference = {
  id: NotificationPreferenceKey
  title: string
  description: string
  defaultEnabled: boolean
}

export const notificationPreferences: NotificationPreference[] = [
  {
    id: "mentions",
    title: "Mentions",
    description: "When someone @mentions you in a comment.",
    defaultEnabled: true,
  },
  {
    id: "assignments",
    title: "Task assignments",
    description: "When an issue is assigned to you.",
    defaultEnabled: true,
  },
  {
    id: "status_changes",
    title: "Status changes",
    description: "When an issue you follow changes status.",
    defaultEnabled: false,
  },
  {
    id: "comments",
    title: "Comments",
    description: "When someone comments on an issue you follow.",
    defaultEnabled: true,
  },
  {
    id: "email_digest",
    title: "Email digest",
    description: "A daily summary of your activity.",
    defaultEnabled: true,
  },
]

export type IntegrationId = "slack" | "github" | "google_calendar" | "figma"

export type Integration = {
  id: IntegrationId
  name: string
  description: string
  connected: boolean
}

/**
 * NOTE: Integration OAuth flows are stubbed for portfolio scope.
 * In production these would use OAuth (Slack, GitHub, Google) and store tokens server-side.
 */
export const integrations: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    description: "Get notifications and updates in your channels.",
    connected: true,
  },
  {
    id: "github",
    name: "GitHub",
    description: "Link issues to pull requests and commits.",
    connected: true,
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    description: "Sync meetings and due dates to your calendar.",
    connected: false,
  },
  {
    id: "figma",
    name: "Figma",
    description: "Embed designs directly in your issues.",
    connected: true,
  },
]
