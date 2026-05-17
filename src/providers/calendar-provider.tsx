import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"
import type {
  FamilyMember,
  CalendarGroup,
  CalendarEvent,
  CalendarView,
} from "@/lib/calendar-types"
import {
  familyMembers as defaultMembers,
  defaultCalendars,
  defaultEvents,
} from "@/lib/calendar-data"

/**
 * Expands a recurring event into concrete occurrences within [rangeStart, rangeEnd].
 * Returns virtual copies with adjusted start/end dates.
 */
function expandRecurringEvent(
  evt: CalendarEvent,
  rangeStart: Date,
  rangeEnd: Date
): CalendarEvent[] {
  if (evt.recurrence === "none") return [evt]

  const results: CalendarEvent[] = []
  const origStart = new Date(evt.start)
  const origEnd = new Date(evt.end)
  const duration = origEnd.getTime() - origStart.getTime()

  // Advance cursor until it passes rangeEnd or max 500 iterations
  let cursor = new Date(origStart)
  let i = 0
  const MAX = 500

  while (cursor <= rangeEnd && i < MAX) {
    i++
    if (cursor >= rangeStart) {
      results.push({
        ...evt,
        id: `${evt.id}_occ_${i}`,
        start: cursor.toISOString(),
        end: new Date(cursor.getTime() + duration).toISOString(),
      })
    }
    // Advance by recurrence interval
    const next = new Date(cursor)
    if (evt.recurrence === "daily") next.setDate(next.getDate() + 1)
    else if (evt.recurrence === "weekly") next.setDate(next.getDate() + 7)
    else if (evt.recurrence === "monthly") next.setMonth(next.getMonth() + 1)
    else if (evt.recurrence === "yearly") next.setFullYear(next.getFullYear() + 1)
    cursor = next
  }

  return results
}

interface CalendarStore {
  // Data
  members: FamilyMember[]
  calendars: CalendarGroup[]
  events: CalendarEvent[]
  view: CalendarView
  currentDate: Date

  // Navigation
  setView: (v: CalendarView) => void
  setCurrentDate: (d: Date) => void
  goToday: () => void
  goNext: () => void
  goPrev: () => void

  // Calendar CRUD
  addCalendar: (cal: CalendarGroup) => void
  updateCalendar: (id: string, patch: Partial<CalendarGroup>) => void
  deleteCalendar: (id: string) => void
  toggleCalendarVisibility: (id: string) => void

  // Event CRUD
  addEvent: (evt: CalendarEvent) => void
  updateEvent: (id: string, patch: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void

  // Filters
  selectedMemberIds: string[]
  setSelectedMemberIds: (ids: string[]) => void
  toggleMember: (id: string) => void

  // Computed
  visibleEvents: CalendarEvent[]
  expandedVisibleEvents: CalendarEvent[]
}

const CalendarContext = createContext<CalendarStore | null>(null)

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [members] = useState<FamilyMember[]>(defaultMembers)
  const [calendars, setCalendars] = useState<CalendarGroup[]>(defaultCalendars)
  const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents)
  const [view, setView] = useState<CalendarView>("month")
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
    defaultMembers.map((m) => m.id)
  )

  // Navigation
  const goToday = useCallback(() => setCurrentDate(new Date()), [])

  const goNext = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev)
      if (view === "month") d.setMonth(d.getMonth() + 1)
      else if (view === "week") d.setDate(d.getDate() + 7)
      else d.setFullYear(d.getFullYear() + 1)
      return d
    })
  }, [view])

  const goPrev = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev)
      if (view === "month") d.setMonth(d.getMonth() - 1)
      else if (view === "week") d.setDate(d.getDate() - 7)
      else d.setFullYear(d.getFullYear() - 1)
      return d
    })
  }, [view])

  // Calendar CRUD
  const addCalendar = useCallback(
    (cal: CalendarGroup) => setCalendars((prev) => [...prev, cal]),
    []
  )
  const updateCalendar = useCallback(
    (id: string, patch: Partial<CalendarGroup>) =>
      setCalendars((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
      ),
    []
  )
  const deleteCalendar = useCallback(
    (id: string) => {
      setCalendars((prev) => prev.filter((c) => c.id !== id))
      setEvents((prev) => prev.filter((e) => e.calendarId !== id))
    },
    []
  )
  const toggleCalendarVisibility = useCallback(
    (id: string) =>
      setCalendars((prev) =>
        prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
      ),
    []
  )

  // Event CRUD
  const addEvent = useCallback(
    (evt: CalendarEvent) => setEvents((prev) => [...prev, evt]),
    []
  )
  const updateEvent = useCallback(
    (id: string, patch: Partial<CalendarEvent>) =>
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
      ),
    []
  )
  const deleteEvent = useCallback(
    (id: string) => setEvents((prev) => prev.filter((e) => e.id !== id)),
    []
  )

  // Member filter toggle
  const toggleMember = useCallback(
    (id: string) =>
      setSelectedMemberIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      ),
    []
  )

  // Visible events: filtered by visible calendars + selected members (or no members)
  const visibleCalendarIds = new Set(
    calendars.filter((c) => c.visible).map((c) => c.id)
  )
  const memberSet = new Set(selectedMemberIds)
  const visibleEvents = events.filter(
    (e) =>
      visibleCalendarIds.has(e.calendarId) &&
      (e.memberIds.length === 0 || e.memberIds.some((mid) => memberSet.has(mid)))
  )

  // Expanded events: recurring events are expanded into individual occurrences
  // over a ±2 year window so all views can query by date range directly.
  const expandedVisibleEvents = useMemo(() => {
    const rangeStart = new Date()
    rangeStart.setFullYear(rangeStart.getFullYear() - 2)
    const rangeEnd = new Date()
    rangeEnd.setFullYear(rangeEnd.getFullYear() + 2)
    return visibleEvents.flatMap((e) => expandRecurringEvent(e, rangeStart, rangeEnd))
  }, [visibleEvents])

  return (
    <CalendarContext.Provider
      value={{
        members,
        calendars,
        events,
        view,
        currentDate,
        setView,
        setCurrentDate,
        goToday,
        goNext,
        goPrev,
        addCalendar,
        updateCalendar,
        deleteCalendar,
        toggleCalendarVisibility,
        addEvent,
        updateEvent,
        deleteEvent,
        selectedMemberIds,
        setSelectedMemberIds,
        toggleMember,
        visibleEvents,
        expandedVisibleEvents,
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendar() {
  const ctx = useContext(CalendarContext)
  if (!ctx) throw new Error("useCalendar must be used inside CalendarProvider")
  return ctx
}
