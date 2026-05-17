import type { FamilyMember, CalendarGroup, CalendarEvent } from "./calendar-types"

// ── Family members ────────────────────────────────────────────────
export const familyMembers: FamilyMember[] = [
  { id: "dad",      name: "Marcus",   role: "Dad",      avatar: "/avatars/dad.jpg",      color: "#3b82f6" },
  { id: "mom",      name: "Sarah",    role: "Mom",      avatar: "/avatars/mom.jpg",      color: "#ec4899" },
  { id: "daughter", name: "Lily",     role: "Daughter",  avatar: "/avatars/daughter.jpg", color: "#a855f7" },
  { id: "son",      name: "Ethan",    role: "Son",       avatar: "/avatars/son.jpg",      color: "#22c55e" },
  { id: "grandma",  name: "Nana",     role: "Grandma",   avatar: "/avatars/grandma.jpg",  color: "#f97316" },
  { id: "grandpa",  name: "Grandpa",  role: "Grandpa",   avatar: "/avatars/grandpa.jpg",  color: "#eab308" },
]

// ── Calendar groups ───────────────────────────────────────────────
export const defaultCalendars: CalendarGroup[] = [
  { id: "family",   name: "Family",        color: "#3b82f6", memberIds: ["dad", "mom", "daughter", "son", "grandma", "grandpa"], visible: true },
  { id: "work",     name: "Work",          color: "#f97316", memberIds: ["dad", "mom"],                                           visible: true },
  { id: "school",   name: "School",        color: "#a855f7", memberIds: ["daughter", "son"],                                       visible: true },
  { id: "health",   name: "Health",        color: "#22c55e", memberIds: ["dad", "mom", "daughter", "son", "grandma", "grandpa"], visible: true },
  { id: "social",   name: "Social",        color: "#ec4899", memberIds: ["dad", "mom", "daughter", "son"],                        visible: true },
]

// ── Helper to generate dates relative to today ───────────────────
function d(dayOffset: number, hour: number, minute = 0): string {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

function allDayDate(dayOffset: number): string {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  date.setHours(0, 0, 0, 0)
  return date.toISOString()
}

// ── Mock events ───────────────────────────────────────────────────
export const defaultEvents: CalendarEvent[] = [
  // Today
  {
    id: "evt-1", title: "Family Breakfast", description: "Pancakes and fruit smoothies",
    start: d(0, 8, 0), end: d(0, 9, 0), allDay: false,
    calendarId: "family", memberIds: ["dad", "mom", "daughter", "son"],
    location: "Home", recurrence: "none",
  },
  {
    id: "evt-2", title: "Team Standup", description: "Daily sync with engineering team",
    start: d(0, 9, 30), end: d(0, 10, 0), allDay: false,
    calendarId: "work", memberIds: ["dad"],
    location: "Office / Zoom", recurrence: "weekly",
  },
  {
    id: "evt-3", title: "Math Tutoring", description: "Algebra review session",
    start: d(0, 15, 0), end: d(0, 16, 0), allDay: false,
    calendarId: "school", memberIds: ["daughter"],
    location: "Library", recurrence: "weekly",
  },
  {
    id: "evt-4", title: "Soccer Practice", description: "Bring water and shin guards",
    start: d(0, 16, 30), end: d(0, 18, 0), allDay: false,
    calendarId: "school", memberIds: ["son"],
    location: "City Park", recurrence: "weekly",
  },

  // Tomorrow
  {
    id: "evt-5", title: "Dentist Appointment", description: "Regular checkup for the kids",
    start: d(1, 10, 0), end: d(1, 11, 0), allDay: false,
    calendarId: "health", memberIds: ["daughter", "son"],
    location: "Downtown Dental", recurrence: "none",
  },
  {
    id: "evt-6", title: "Grocery Shopping", description: "Weekly grocery run",
    start: d(1, 14, 0), end: d(1, 15, 30), allDay: false,
    calendarId: "family", memberIds: ["mom"],
    location: "Whole Foods", recurrence: "weekly",
  },

  // Day after tomorrow
  {
    id: "evt-7", title: "Date Night", description: "Dinner and a movie",
    start: d(2, 19, 0), end: d(2, 22, 0), allDay: false,
    calendarId: "social", memberIds: ["dad", "mom"],
    location: "Italian Bistro", recurrence: "none",
  },
  {
    id: "evt-8", title: "Piano Recital", description: "Spring recital at the community center",
    start: d(2, 17, 0), end: d(2, 18, 30), allDay: false,
    calendarId: "school", memberIds: ["daughter"],
    location: "Community Center", recurrence: "none",
  },

  // +3 days
  {
    id: "evt-9", title: "Nana Visits", description: "Grandma coming over for the weekend",
    start: allDayDate(3), end: allDayDate(5), allDay: true,
    calendarId: "family", memberIds: ["grandma", "grandpa"],
    location: "Home", recurrence: "none",
  },

  // +4 days
  {
    id: "evt-10", title: "Science Fair", description: "Volcano project presentation",
    start: d(4, 9, 0), end: d(4, 12, 0), allDay: false,
    calendarId: "school", memberIds: ["son"],
    location: "Elementary School Gym", recurrence: "none",
  },
  {
    id: "evt-11", title: "Book Club", description: "Discussing the latest pick",
    start: d(4, 19, 0), end: d(4, 21, 0), allDay: false,
    calendarId: "social", memberIds: ["mom"],
    location: "Coffee House", recurrence: "monthly",
  },

  // +5 days
  {
    id: "evt-12", title: "Yoga Class", description: "Morning flow session",
    start: d(5, 7, 0), end: d(5, 8, 0), allDay: false,
    calendarId: "health", memberIds: ["mom"],
    location: "Sunrise Yoga Studio", recurrence: "weekly",
  },

  // +6 days
  {
    id: "evt-13", title: "BBQ Party", description: "Neighborhood cookout",
    start: d(6, 12, 0), end: d(6, 16, 0), allDay: false,
    calendarId: "social", memberIds: ["dad", "mom", "daughter", "son"],
    location: "Backyard", recurrence: "none",
  },

  // +7 days
  {
    id: "evt-14", title: "Annual Physical", description: "Yearly health checkup",
    start: d(7, 9, 0), end: d(7, 10, 0), allDay: false,
    calendarId: "health", memberIds: ["dad"],
    location: "Family Clinic", recurrence: "yearly",
  },

  // -1 day (yesterday)
  {
    id: "evt-15", title: "PTA Meeting", description: "Discuss spring fundraiser",
    start: d(-1, 18, 0), end: d(-1, 19, 30), allDay: false,
    calendarId: "school", memberIds: ["mom"],
    location: "School Auditorium", recurrence: "monthly",
  },

  // -3 days
  {
    id: "evt-16", title: "Car Service", description: "Oil change and tire rotation",
    start: d(-3, 10, 0), end: d(-3, 11, 30), allDay: false,
    calendarId: "family", memberIds: ["dad"],
    location: "Quick Lube", recurrence: "none",
  },

  // +10 days
  {
    id: "evt-17", title: "Birthday Party", description: "Ethan turns 10!",
    start: allDayDate(10), end: allDayDate(10), allDay: true,
    calendarId: "family", memberIds: ["dad", "mom", "daughter", "son", "grandma", "grandpa"],
    location: "Home", recurrence: "yearly",
  },

  // +14 days
  {
    id: "evt-18", title: "Camping Trip", description: "Weekend at Pine Ridge",
    start: allDayDate(14), end: allDayDate(16), allDay: true,
    calendarId: "family", memberIds: ["dad", "son"],
    location: "Pine Ridge Campground", recurrence: "none",
  },
]
