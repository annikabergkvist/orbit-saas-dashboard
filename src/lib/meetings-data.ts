import { isGoogleCalendarConnected } from "@/lib/client-store"

export type DashboardMeeting = {
  id: string
  title: string
  time: string
  provider: "Meet" | "Zoom"
  /** Join URL from the synced calendar event — opens Meet or Zoom in a new tab. */
  joinUrl: string
}

/**
 * NOTE: Meeting data is seed data for the portfolio demo.
 * In production, "My Meetings" would sync with the user's connected Google Calendar
 * via the Calendar API (see Settings > Integrations). Join links would come from
 * each event's conference data (Meet / Zoom).
 */
export const dashboardMeetingsSeed: DashboardMeeting[] = [
  {
    id: "meet-1",
    title: "App Project",
    time: "9:00 AM",
    provider: "Meet",
    joinUrl: "https://meet.google.com",
  },
  {
    id: "meet-2",
    title: "User Research",
    time: "2:30 PM",
    provider: "Zoom",
    joinUrl: "https://zoom.us",
  },
]

/** Returns today's meetings when Google Calendar is connected; otherwise an empty list. */
export function getDashboardMeetings(): DashboardMeeting[] {
  if (!isGoogleCalendarConnected()) return []
  return dashboardMeetingsSeed
}
