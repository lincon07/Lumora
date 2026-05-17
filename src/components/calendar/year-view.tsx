import { useMemo } from "react"
import { useCalendar } from "@/providers/calendar-provider"

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]
const DAYS_LETTER = ["S", "M", "T", "W", "T", "F", "S"]

interface YearViewProps {
  onMonthClick: (month: number) => void
}

export function YearView({ onMonthClick }: YearViewProps) {
  const { currentDate, visibleEvents, calendars } = useCalendar()
  const year = currentDate.getFullYear()

  const calMap = useMemo(
    () => Object.fromEntries(calendars.map((c) => [c.id, c])),
    [calendars]
  )

  const today = new Date()

  function getMonthDays(month: number) {
    const first = new Date(year, month, 1)
    const last = new Date(year, month + 1, 0)
    const startDay = first.getDay()
    const totalDays = last.getDate()

    const cells: (number | null)[] = []
    for (let i = 0; i < startDay; i++) cells.push(null)
    for (let i = 1; i <= totalDays; i++) cells.push(i)
    return cells
  }

  function getEventCountForDay(month: number, day: number): { count: number; color: string } {
    const dayStart = new Date(year, month, day).getTime()
    const dayEnd = dayStart + 86400000
    const dayEvents = visibleEvents.filter((e) => {
      const eStart = new Date(e.start).getTime()
      const eEnd = new Date(e.end).getTime()
      return eStart < dayEnd && eEnd > dayStart
    })
    if (dayEvents.length === 0) return { count: 0, color: "" }
    const firstCal = calMap[dayEvents[0].calendarId]
    return { count: dayEvents.length, color: firstCal?.color ?? "#888" }
  }

  const isToday = (month: number, day: number) =>
    year === today.getFullYear() &&
    month === today.getMonth() &&
    day === today.getDate()

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 12 }, (_, month) => {
          const cells = getMonthDays(month)
          return (
            <button
              key={month}
              onClick={() => onMonthClick(month)}
              className="flex flex-col gap-2 rounded-lg p-3 text-left transition-colors hover:bg-muted/30"
            >
              <h3 className="text-sm font-semibold text-foreground">
                {MONTHS[month]}
              </h3>
              <div className="grid grid-cols-7 gap-px">
                {DAYS_LETTER.map((d, i) => (
                  <span
                    key={i}
                    className="flex size-5 items-center justify-center text-[9px] text-muted-foreground"
                  >
                    {d}
                  </span>
                ))}
                {cells.map((day, i) => {
                  if (day === null) {
                    return <span key={i} className="size-5" />
                  }
                  const { count, color } = getEventCountForDay(month, day)
                  return (
                    <span
                      key={i}
                      className={`relative flex size-5 items-center justify-center rounded-full text-[9px] ${
                        isToday(month, day)
                          ? "bg-primary text-primary-foreground font-bold"
                          : count > 0
                            ? "font-medium text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {day}
                      {count > 0 && !isToday(month, day) && (
                        <span
                          className="absolute -bottom-0.5 size-1 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      )}
                    </span>
                  )
                })}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
