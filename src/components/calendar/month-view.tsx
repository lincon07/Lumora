import { useMemo } from "react"
import { useCalendar } from "@/providers/calendar-provider"
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import type { CalendarEvent } from "@/lib/calendar-types"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

interface MonthViewProps {
  onEventClick: (event: CalendarEvent) => void
  onDayClick: (date: Date) => void
}

export function MonthView({ onEventClick, onDayClick }: MonthViewProps) {
  const { currentDate, visibleEvents, calendars, members } = useCalendar()

  const calMap = useMemo(
    () => Object.fromEntries(calendars.map((c) => [c.id, c])),
    [calendars]
  )
  const memberMap = useMemo(
    () => Object.fromEntries(members.map((m) => [m.id, m])),
    [members]
  )

  const weeks = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const first = new Date(year, month, 1)
    const last = new Date(year, month + 1, 0)
    const startDay = first.getDay()
    const totalDays = last.getDate()

    const cells: Date[] = []
    // Fill leading days from previous month
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, month, -i)
      cells.push(d)
    }
    // Current month
    for (let i = 1; i <= totalDays; i++) {
      cells.push(new Date(year, month, i))
    }
    // Fill trailing days
    while (cells.length % 7 !== 0) {
      cells.push(new Date(year, month + 1, cells.length - startDay - totalDays + 1))
    }

    const w: Date[][] = []
    for (let i = 0; i < cells.length; i += 7) {
      w.push(cells.slice(i, i + 7))
    }
    return w
  }, [currentDate])

  function getEventsForDay(date: Date): CalendarEvent[] {
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    const dayEnd = dayStart + 86400000
    return visibleEvents.filter((e) => {
      const eStart = new Date(e.start).getTime()
      const eEnd = new Date(e.end).getTime()
      return eStart < dayEnd && eEnd > dayStart
    })
  }

  const today = new Date()
  const isToday = (d: Date) =>
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()

  const isCurrentMonth = (d: Date) => d.getMonth() === currentDate.getMonth()

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-border/50">
        {DAYS.map((day) => (
          <div
            key={day}
            className="px-2 py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid flex-1 grid-rows-[repeat(auto-fill,minmax(0,1fr))]">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b border-border/30 last:border-b-0">
            {week.map((day, di) => {
              const events = getEventsForDay(day)
              const maxShow = 3
              const overflow = events.length - maxShow
              return (
                <button
                  key={di}
                  onClick={() => onDayClick(day)}
                  className={`flex flex-col items-stretch gap-0.5 border-r border-border/20 p-1 text-left transition-colors hover:bg-muted/30 last:border-r-0 min-h-[5.5rem] ${
                    !isCurrentMonth(day) ? "opacity-40" : ""
                  }`}
                >
                  <span
                    className={`mb-0.5 flex size-6 items-center justify-center self-end rounded-full text-xs font-medium ${
                      isToday(day)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  {events.slice(0, maxShow).map((evt) => {
                    const cal = calMap[evt.calendarId]
                    return (
                      <div
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick(evt)
                        }}
                        className="group/evt flex items-center gap-1 rounded px-1 py-0.5 text-[10px] leading-tight transition-colors hover:brightness-90 cursor-pointer truncate"
                        style={{ backgroundColor: (cal?.color ?? "#888") + "20", color: cal?.color ?? "#888" }}
                      >
                        <span
                          className="size-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: cal?.color ?? "#888" }}
                        />
                        <span className="truncate font-medium">{evt.title}</span>
                        {evt.memberIds.length > 0 && (
                          <AvatarGroup className="ml-auto shrink-0 -space-x-1.5">
                            {evt.memberIds.slice(0, 2).map((mid) => {
                              const m = memberMap[mid]
                              if (!m) return null
                              return (
                                <Avatar key={mid} size="sm" className="size-4 ring-1">
                                  <AvatarImage src={m.avatar} alt={m.name} />
                                  <AvatarFallback className="text-[8px]">{m.name[0]}</AvatarFallback>
                                </Avatar>
                              )
                            })}
                          </AvatarGroup>
                        )}
                      </div>
                    )
                  })}
                  {overflow > 0 && (
                    <span className="text-[10px] text-muted-foreground px-1">
                      +{overflow} more
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
