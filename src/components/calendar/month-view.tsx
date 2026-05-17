import { useMemo, useState, useRef, useCallback } from "react"
import { useCalendar } from "@/providers/calendar-provider"
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import type { CalendarEvent } from "@/lib/calendar-types"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const LONG_PRESS_DURATION = 500 // ms

interface MonthViewProps {
  onEventClick: (event: CalendarEvent) => void
  onDayClick: (date: Date) => void
  onDayLongPress?: (date: Date) => void
}

export function MonthView({ onEventClick, onDayClick, onDayLongPress }: MonthViewProps) {
  const { currentDate, expandedVisibleEvents, calendars, members, updateEvent, setCurrentDate, setView } = useCalendar()

  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null)
  const [dropTargetDate, setDropTargetDate] = useState<Date | null>(null)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const longPressTriggered = useRef(false)

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
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, month, -i)
      cells.push(d)
    }
    for (let i = 1; i <= totalDays; i++) {
      cells.push(new Date(year, month, i))
    }
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
    return expandedVisibleEvents.filter((e) => {
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

  // Long press handlers
  const handleTouchStart = useCallback((date: Date) => {
    longPressTriggered.current = false
    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true
      // Zoom into week view for that date
      setCurrentDate(date)
      setView("week")
      if (onDayLongPress) onDayLongPress(date)
    }, LONG_PRESS_DURATION)
  }, [setCurrentDate, setView, onDayLongPress])

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const handleTouchMove = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, event: CalendarEvent) => {
    e.stopPropagation()
    setDraggedEvent(event)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", event.id)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, date: Date) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDropTargetDate(date)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDropTargetDate(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, targetDate: Date) => {
    e.preventDefault()
    setDropTargetDate(null)

    if (!draggedEvent) return

    // Calculate the day difference
    const origStart = new Date(draggedEvent.start)
    const origEnd = new Date(draggedEvent.end)
    const dayDiff = Math.floor((targetDate.getTime() - new Date(origStart.getFullYear(), origStart.getMonth(), origStart.getDate()).getTime()) / 86400000)

    // Create new dates preserving time
    const newStart = new Date(origStart)
    newStart.setDate(newStart.getDate() + dayDiff)
    const newEnd = new Date(origEnd)
    newEnd.setDate(newEnd.getDate() + dayDiff)

    // Extract base event ID (remove _occ_N suffix if present)
    const baseId = draggedEvent.id.replace(/_occ_\d+$/, "")

    updateEvent(baseId, {
      start: newStart.toISOString(),
      end: newEnd.toISOString(),
    })

    setDraggedEvent(null)
  }, [draggedEvent, updateEvent])

  const handleDragEnd = useCallback(() => {
    setDraggedEvent(null)
    setDropTargetDate(null)
  }, [])

  const rowCount = weeks.length

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-border/50 shrink-0">
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
      <div
        className="grid flex-1 overflow-hidden"
        style={{ gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))` }}
      >
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b border-border/30 last:border-b-0 min-h-0">
            {week.map((day, di) => {
              const events = getEventsForDay(day)
              const maxShow = 2
              const overflow = events.length - maxShow
              const isDropTarget = dropTargetDate?.getTime() === day.getTime()
              
              return (
                <div
                  key={di}
                  onTouchStart={() => handleTouchStart(day)}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchMove}
                  onDragOver={(e) => handleDragOver(e, day)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, day)}
                  onClick={() => {
                    if (!longPressTriggered.current) {
                      onDayClick(day)
                    }
                  }}
                  className={`flex flex-col items-stretch gap-0.5 border-r border-border/20 p-1 text-left transition-all last:border-r-0 overflow-hidden cursor-pointer select-none ${
                    !isCurrentMonth(day) ? "opacity-40" : ""
                  } ${isDropTarget ? "bg-primary/20 ring-2 ring-primary ring-inset" : "hover:bg-muted/30"}`}
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
                    const isDragging = draggedEvent?.id === evt.id
                    return (
                      <div
                        key={evt.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, evt)}
                        onDragEnd={handleDragEnd}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick(evt)
                        }}
                        className={`group/evt flex items-center gap-1 rounded px-1 py-0.5 text-[10px] leading-tight transition-all cursor-grab active:cursor-grabbing truncate ${
                          isDragging ? "opacity-50 scale-95" : "hover:brightness-90"
                        }`}
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
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Drag indicator overlay */}
      {draggedEvent && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-sm text-muted-foreground pointer-events-none z-50">
          Moving: <span className="text-foreground font-medium">{draggedEvent.title}</span>
        </div>
      )}
    </div>
  )
}
