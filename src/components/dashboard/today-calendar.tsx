import { useCalendar } from "@/providers/calendar-provider"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { CalendarDays, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function TodayCalendar() {
  const { expandedVisibleEvents, calendars, members, selectedMemberIds, toggleMember } = useCalendar()

  const today = new Date()
  const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const dayEnd = dayStart + 86400000

  const todayEvents = expandedVisibleEvents
    .filter((e) => {
      const eStart = new Date(e.start).getTime()
      const eEnd = new Date(e.end).getTime()
      return eStart < dayEnd && eEnd > dayStart
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  const formatTime = (date: string) => {
    const d = new Date(date)
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Today</span>
          <span className="text-xs text-muted-foreground">
            {DAYS[today.getDay()]}, {today.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </span>
        </div>
        <Link to="/calendar" className="flex items-center gap-1 text-xs text-primary hover:underline">
          View Calendar <ChevronRight className="size-3" />
        </Link>
      </div>

      {/* Member filter chips */}
      <div className="flex flex-wrap gap-1.5 border-b border-border/30 px-4 py-2">
        {members.slice(0, 8).map((m) => {
          const isActive = selectedMemberIds.includes(m.id)
          return (
            <button
              key={m.id}
              onClick={() => toggleMember(m.id)}
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] transition-all ${
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground opacity-50 hover:opacity-75"
              }`}
            >
              <Avatar className="size-4">
                <AvatarImage src={m.avatar} alt={m.name} />
                <AvatarFallback className="text-[6px]">{m.name[0]}</AvatarFallback>
              </Avatar>
              <span>{m.name.split(" ")[0]}</span>
            </button>
          )
        })}
      </div>

      {/* Events list */}
      <div className="flex flex-col divide-y divide-border/20">
        {todayEvents.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            No events today
          </div>
        ) : (
          todayEvents.slice(0, 5).map((event) => {
            const cal = calendars.find((c) => c.id === event.calendarId)
            const eventMembers = members.filter((m) => event.memberIds.includes(m.id))
            return (
              <div key={event.id} className="flex items-center gap-3 px-4 py-2.5">
                <div
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: cal?.color || "#3b82f6" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.allDay ? "All day" : formatTime(event.start)}
                    {event.location && ` · ${event.location}`}
                  </p>
                </div>
                {eventMembers.length > 0 && (
                  <div className="flex -space-x-1.5">
                    {eventMembers.slice(0, 3).map((m) => (
                      <Avatar key={m.id} className="size-5 ring-1 ring-card">
                        <AvatarImage src={m.avatar} alt={m.name} />
                        <AvatarFallback className="text-[8px]">{m.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
        {todayEvents.length > 5 && (
          <div className="px-4 py-2 text-center text-xs text-muted-foreground">
            +{todayEvents.length - 5} more events
          </div>
        )}
      </div>
    </div>
  )
}
