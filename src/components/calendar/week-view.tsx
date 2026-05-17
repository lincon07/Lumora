import { useMemo } from "react"
import { useCalendar } from "@/providers/calendar-provider"
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import type { CalendarEvent } from "@/lib/calendar-types"

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

interface WeekViewProps {
  onEventClick: (event: CalendarEvent) => void
  onSlotClick: (date: Date) => void
}

export function WeekView({ onEventClick, onSlotClick }: WeekViewProps) {
  const { currentDate, expandedVisibleEvents, calendars, members } = useCalendar()

  const calMap = useMemo(
    () => Object.fromEntries(calendars.map((c) => [c.id, c])),
    [calendars]
  )
  const memberMap = useMemo(
    () => Object.fromEntries(members.map((m) => [m.id, m])),
    [members]
  )

  const weekDays = useMemo(() => {
    const start = new Date(currentDate)
    start.setDate(start.getDate() - start.getDay())
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      return d
    })
  }, [currentDate])

  const today = new Date()
  const isToday = (d: Date) =>
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()

  function getEventsForDayHour(date: Date, hour: number): CalendarEvent[] {
    const slotStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour).getTime()
    const slotEnd = slotStart + 3600000
    return expandedVisibleEvents.filter((e) => {
      if (e.allDay) return false
      const eStart = new Date(e.start).getTime()
      const eEnd = new Date(e.end).getTime()
      // Only show at the event start hour
      return eStart >= slotStart && eStart < slotEnd
    })
  }

  function getAllDayEvents(date: Date): CalendarEvent[] {
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    const dayEnd = dayStart + 86400000
    return expandedVisibleEvents.filter((e) => {
      if (!e.allDay) return false
      const eStart = new Date(e.start).getTime()
      const eEnd = new Date(e.end).getTime()
      return eStart < dayEnd && eEnd > dayStart
    })
  }

  function formatHour(h: number): string {
    if (h === 0) return "12 AM"
    if (h < 12) return `${h} AM`
    if (h === 12) return "12 PM"
    return `${h - 12} PM`
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-[3.5rem_repeat(7,1fr)] border-b border-border/50">
        <div />
        {weekDays.map((day, i) => (
          <div
            key={i}
            className={`flex flex-col items-center py-2 text-xs border-l border-border/20 ${
              isToday(day) ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <span className="font-medium">{DAYS_SHORT[day.getDay()]}</span>
            <span
              className={`mt-0.5 flex size-7 items-center justify-center rounded-full text-sm font-semibold ${
                isToday(day) ? "bg-primary text-primary-foreground" : "text-foreground"
              }`}
            >
              {day.getDate()}
            </span>
          </div>
        ))}
      </div>

      {/* All-day row */}
      {weekDays.some((d) => getAllDayEvents(d).length > 0) && (
        <div className="grid grid-cols-[3.5rem_repeat(7,1fr)] border-b border-border/50">
          <div className="flex items-center justify-center text-[10px] text-muted-foreground py-1">
            All day
          </div>
          {weekDays.map((day, i) => {
            const events = getAllDayEvents(day)
            return (
              <div key={i} className="flex flex-col gap-0.5 border-l border-border/20 p-0.5">
                {events.map((evt) => {
                  const cal = calMap[evt.calendarId]
                  return (
                    <button
                      key={evt.id}
                      onClick={() => onEventClick(evt)}
                      className="rounded px-1.5 py-0.5 text-[10px] font-medium truncate text-left"
                      style={{
                        backgroundColor: (cal?.color ?? "#888") + "25",
                        color: cal?.color ?? "#888",
                      }}
                    >
                      {evt.title}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[3.5rem_repeat(7,1fr)]">
          {HOURS.map((hour) => (
            <div key={hour} className="contents">
              <div className="flex items-start justify-end pr-2 pt-0 text-[10px] text-muted-foreground h-14 border-b border-border/20">
                <span className="-mt-1.5">{formatHour(hour)}</span>
              </div>
              {weekDays.map((day, di) => {
                const events = getEventsForDayHour(day, hour)
                return (
                  <button
                    key={di}
                    onClick={() => {
                      const d = new Date(day)
                      d.setHours(hour)
                      onSlotClick(d)
                    }}
                    className="relative flex flex-col gap-0.5 border-b border-l border-border/20 p-0.5 h-14 hover:bg-muted/20 transition-colors text-left"
                  >
                    {events.map((evt) => {
                      const cal = calMap[evt.calendarId]
                      const duration =
                        (new Date(evt.end).getTime() - new Date(evt.start).getTime()) / 3600000
                      return (
                        <div
                          key={evt.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onEventClick(evt)
                          }}
                          className="flex flex-col gap-0.5 rounded px-1 py-0.5 text-[10px] cursor-pointer truncate"
                          style={{
                            backgroundColor: (cal?.color ?? "#888") + "20",
                            color: cal?.color ?? "#888",
                            minHeight: `${Math.max(duration * 3.5, 1.75)}rem`,
                          }}
                        >
                          <span className="font-medium truncate">{evt.title}</span>
                          {evt.memberIds.length > 0 && (
                            <AvatarGroup className="-space-x-1">
                              {evt.memberIds.slice(0, 3).map((mid) => {
                                const m = memberMap[mid]
                                if (!m) return null
                                return (
                                  <Avatar key={mid} size="sm" className="size-3.5 ring-1">
                                    <AvatarImage src={m.avatar} alt={m.name} />
                                    <AvatarFallback className="text-[6px]">{m.name[0]}</AvatarFallback>
                                  </Avatar>
                                )
                              })}
                            </AvatarGroup>
                          )}
                        </div>
                      )
                    })}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
