import type { FamilyMember, CalendarGroup, CalendarEvent } from "./calendar-types"

// ── Family members (diverse ages and backgrounds) ─────────────────
export const familyMembers: FamilyMember[] = [
  // Children
  { id: "child-boy-asian",     name: "Kenji",    role: "Child",   avatar: "/avatars/child-boy-asian.jpg",     color: "#FBBF24" },
  { id: "child-girl-african",  name: "Amara",    role: "Child",   avatar: "/avatars/child-girl-african.jpg",  color: "#F472B6" },
  { id: "child-boy-latino",    name: "Diego",    role: "Child",   avatar: "/avatars/child-boy-latino.jpg",    color: "#FB923C" },
  { id: "child-girl-caucasian",name: "Emma",     role: "Child",   avatar: "/avatars/child-girl-caucasian.jpg",color: "#60A5FA" },
  
  // Teens
  { id: "teen-girl-asian",     name: "Mei",      role: "Teen",    avatar: "/avatars/teen-girl-asian.jpg",     color: "#A78BFA" },
  { id: "teen-boy-african",    name: "Jamal",    role: "Teen",    avatar: "/avatars/teen-boy-african.jpg",    color: "#34D399" },
  { id: "teen-girl-latina",    name: "Sofia",    role: "Teen",    avatar: "/avatars/teen-girl-latina.jpg",    color: "#FB7185" },
  { id: "teen-boy-caucasian",  name: "Liam",     role: "Teen",    avatar: "/avatars/teen-boy-caucasian.jpg",  color: "#38BDF8" },
  
  // Adults
  { id: "adult-man-asian",         name: "Hiroshi", role: "Adult",   avatar: "/avatars/adult-man-asian.jpg",         color: "#1D4ED8" },
  { id: "adult-woman-african",     name: "Nia",     role: "Adult",   avatar: "/avatars/adult-woman-african.jpg",     color: "#0D9488" },
  { id: "adult-man-latino",        name: "Carlos",  role: "Adult",   avatar: "/avatars/adult-man-latino.jpg",        color: "#9F1239" },
  { id: "adult-woman-caucasian",   name: "Rachel",  role: "Adult",   avatar: "/avatars/adult-woman-caucasian.jpg",   color: "#D97706" },
  { id: "adult-woman-indian",      name: "Priya",   role: "Adult",   avatar: "/avatars/adult-woman-indian.jpg",      color: "#DB2777" },
  { id: "adult-man-middleeastern", name: "Omar",    role: "Adult",   avatar: "/avatars/adult-man-middleeastern.jpg", color: "#2563EB" },
  
  // Seniors
  { id: "senior-man-asian",       name: "Takeshi",  role: "Senior",  avatar: "/avatars/senior-man-asian.jpg",       color: "#78716C" },
  { id: "senior-woman-african",   name: "Grace",    role: "Senior",  avatar: "/avatars/senior-woman-african.jpg",   color: "#7C3AED" },
  { id: "senior-man-caucasian",   name: "Walter",   role: "Senior",  avatar: "/avatars/senior-man-caucasian.jpg",   color: "#059669" },
  { id: "senior-woman-latina",    name: "Rosa",     role: "Senior",  avatar: "/avatars/senior-woman-latina.jpg",    color: "#EA580C" },
]

// ── Calendar groups ───────────────────────────────────────────────
export const defaultCalendars: CalendarGroup[] = [
  { id: "family",   name: "Family",        color: "#3b82f6", memberIds: ["adult-man-asian", "adult-woman-african", "teen-girl-asian", "child-boy-latino", "senior-woman-latina"], visible: true },
  { id: "work",     name: "Work",          color: "#f97316", memberIds: ["adult-man-asian", "adult-woman-african", "adult-man-latino", "adult-woman-indian"],                    visible: true },
  { id: "school",   name: "School",        color: "#a855f7", memberIds: ["child-boy-asian", "child-girl-african", "teen-boy-african", "teen-girl-latina"],                       visible: true },
  { id: "health",   name: "Health",        color: "#22c55e", memberIds: ["senior-man-asian", "senior-woman-african", "senior-man-caucasian", "adult-woman-caucasian"],           visible: true },
  { id: "social",   name: "Social",        color: "#ec4899", memberIds: ["teen-girl-asian", "teen-boy-caucasian", "adult-man-middleeastern", "child-girl-caucasian"],            visible: true },
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
    calendarId: "family", memberIds: ["adult-man-asian", "adult-woman-african", "teen-girl-asian", "child-boy-latino"],
    location: "Home", recurrence: "none",
  },
  {
    id: "evt-2", title: "Team Standup", description: "Daily sync with engineering team",
    start: d(0, 9, 30), end: d(0, 10, 0), allDay: false,
    calendarId: "work", memberIds: ["adult-man-asian"],
    location: "Office / Zoom", recurrence: "weekly",
  },
  {
    id: "evt-3", title: "Math Tutoring", description: "Algebra review session",
    start: d(0, 15, 0), end: d(0, 16, 0), allDay: false,
    calendarId: "school", memberIds: ["teen-girl-latina"],
    location: "Library", recurrence: "weekly",
  },
  {
    id: "evt-4", title: "Soccer Practice", description: "Bring water and shin guards",
    start: d(0, 16, 30), end: d(0, 18, 0), allDay: false,
    calendarId: "school", memberIds: ["child-boy-asian", "teen-boy-african"],
    location: "City Park", recurrence: "weekly",
  },

  // Tomorrow
  {
    id: "evt-5", title: "Dentist Appointment", description: "Regular checkup for the kids",
    start: d(1, 10, 0), end: d(1, 11, 0), allDay: false,
    calendarId: "health", memberIds: ["child-girl-african", "child-boy-latino"],
    location: "Downtown Dental", recurrence: "none",
  },
  {
    id: "evt-6", title: "Grocery Shopping", description: "Weekly grocery run",
    start: d(1, 14, 0), end: d(1, 15, 30), allDay: false,
    calendarId: "family", memberIds: ["adult-woman-african"],
    location: "Whole Foods", recurrence: "weekly",
  },

  // Day after tomorrow
  {
    id: "evt-7", title: "Date Night", description: "Dinner and a movie",
    start: d(2, 19, 0), end: d(2, 22, 0), allDay: false,
    calendarId: "social", memberIds: ["adult-man-asian", "adult-woman-african"],
    location: "Italian Bistro", recurrence: "none",
  },
  {
    id: "evt-8", title: "Piano Recital", description: "Spring recital at the community center",
    start: d(2, 17, 0), end: d(2, 18, 30), allDay: false,
    calendarId: "school", memberIds: ["teen-girl-asian"],
    location: "Community Center", recurrence: "none",
  },

  // +3 days
  {
    id: "evt-9", title: "Grandparents Visit", description: "Grandparents coming over for the weekend",
    start: allDayDate(3), end: allDayDate(5), allDay: true,
    calendarId: "family", memberIds: ["senior-man-asian", "senior-woman-latina"],
    location: "Home", recurrence: "none",
  },

  // +4 days
  {
    id: "evt-10", title: "Science Fair", description: "Volcano project presentation",
    start: d(4, 9, 0), end: d(4, 12, 0), allDay: false,
    calendarId: "school", memberIds: ["child-boy-asian"],
    location: "Elementary School Gym", recurrence: "none",
  },
  {
    id: "evt-11", title: "Book Club", description: "Discussing the latest pick",
    start: d(4, 19, 0), end: d(4, 21, 0), allDay: false,
    calendarId: "social", memberIds: ["adult-woman-indian"],
    location: "Coffee House", recurrence: "monthly",
  },

  // +5 days
  {
    id: "evt-12", title: "Yoga Class", description: "Morning flow session",
    start: d(5, 7, 0), end: d(5, 8, 0), allDay: false,
    calendarId: "health", memberIds: ["adult-woman-caucasian"],
    location: "Sunrise Yoga Studio", recurrence: "weekly",
  },

  // +6 days
  {
    id: "evt-13", title: "BBQ Party", description: "Neighborhood cookout",
    start: d(6, 12, 0), end: d(6, 16, 0), allDay: false,
    calendarId: "social", memberIds: ["adult-man-middleeastern", "teen-boy-caucasian", "child-girl-caucasian"],
    location: "Backyard", recurrence: "none",
  },

  // +7 days
  {
    id: "evt-14", title: "Annual Physical", description: "Yearly health checkup",
    start: d(7, 9, 0), end: d(7, 10, 0), allDay: false,
    calendarId: "health", memberIds: ["senior-man-caucasian"],
    location: "Family Clinic", recurrence: "yearly",
  },

  // -1 day (yesterday)
  {
    id: "evt-15", title: "PTA Meeting", description: "Discuss spring fundraiser",
    start: d(-1, 18, 0), end: d(-1, 19, 30), allDay: false,
    calendarId: "school", memberIds: ["adult-woman-african"],
    location: "School Auditorium", recurrence: "monthly",
  },

  // -3 days
  {
    id: "evt-16", title: "Car Service", description: "Oil change and tire rotation",
    start: d(-3, 10, 0), end: d(-3, 11, 30), allDay: false,
    calendarId: "family", memberIds: ["adult-man-latino"],
    location: "Quick Lube", recurrence: "none",
  },

  // +10 days
  {
    id: "evt-17", title: "Birthday Party", description: "Diego turns 8!",
    start: allDayDate(10), end: allDayDate(10), allDay: true,
    calendarId: "family", memberIds: ["child-boy-latino", "child-boy-asian", "child-girl-african", "teen-girl-asian", "senior-woman-latina"],
    location: "Home", recurrence: "yearly",
  },

  // +14 days
  {
    id: "evt-18", title: "Camping Trip", description: "Weekend at Pine Ridge",
    start: allDayDate(14), end: allDayDate(16), allDay: true,
    calendarId: "family", memberIds: ["adult-man-asian", "teen-boy-african", "child-boy-asian"],
    location: "Pine Ridge Campground", recurrence: "none",
  },
]
