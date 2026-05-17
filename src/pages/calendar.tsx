import { useState } from "react"
import { CalendarProvider, useCalendar } from "@/providers/calendar-provider"
import { CalendarSidebar } from "@/components/calendar/calendar-sidebar"
import { CalendarToolbar } from "@/components/calendar/calendar-toolbar"
import { MonthView } from "@/components/calendar/month-view"
import { WeekView } from "@/components/calendar/week-view"
import { YearView } from "@/components/calendar/year-view"
import { EventForm } from "@/components/calendar/event-form"
import type { CalendarEvent } from "@/lib/calendar-types"

function CalendarInner() {
  const { view, setView, setCurrentDate, currentDate } = useCalendar()
  const [formOpen, setFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [defaultDate, setDefaultDate] = useState<Date | undefined>()

  function handleNewEvent() {
    setEditingEvent(null)
    setDefaultDate(new Date())
    setFormOpen(true)
  }

  function handleEventClick(event: CalendarEvent) {
    setEditingEvent(event)
    setFormOpen(true)
  }

  function handleDayClick(date: Date) {
    setEditingEvent(null)
    setDefaultDate(date)
    setFormOpen(true)
  }

  function handleMonthClick(month: number) {
    const d = new Date(currentDate)
    d.setMonth(month)
    setCurrentDate(d)
    setView("month")
  }

  return (
    <div className="flex h-full overflow-hidden">
      <CalendarSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <CalendarToolbar onNewEvent={handleNewEvent} />
        {view === "month" && (
          <MonthView onEventClick={handleEventClick} onDayClick={handleDayClick} />
        )}
        {view === "week" && (
          <WeekView onEventClick={handleEventClick} onSlotClick={handleDayClick} />
        )}
        {view === "year" && <YearView onMonthClick={handleMonthClick} />}
      </div>
      <EventForm
        open={formOpen}
        onOpenChange={setFormOpen}
        event={editingEvent}
        defaultDate={defaultDate}
      />
    </div>
  )
}

export default function CalendarPage() {
  return (
    <CalendarProvider>
      <CalendarInner />
    </CalendarProvider>
  )
}
