export interface FamilyMember {
  id: string
  name: string
  role: string
  avatar: string
  color: string
}

export interface CalendarGroup {
  id: string
  name: string
  color: string
  memberIds: string[]
  visible: boolean
}

export interface CalendarEvent {
  id: string
  title: string
  description: string
  start: string // ISO date-time
  end: string   // ISO date-time
  allDay: boolean
  calendarId: string
  memberIds: string[]
  location: string
  recurrence: "none" | "daily" | "weekly" | "monthly" | "yearly"
}

export type CalendarView = "month" | "week" | "year"
