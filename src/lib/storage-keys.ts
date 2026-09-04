/** localStorage keys for the Orbit demo. Keep reads/writes on this list. */
export const STORAGE_KEYS = {
  auth: "orbit:auth",
  integrations: "orbit:integrations",
  notificationPrefs: "orbit:notification-prefs",
  userProfile: "orbit:user-profile",
  issues: "orbit:issues",
  projects: "orbit:projects",
  boardTasks: "orbit:board-tasks",
  messages: "orbit:messages",
  densityCompact: "orbit-density-compact",
  reduceMotion: "orbit-reduce-motion",
} as const
