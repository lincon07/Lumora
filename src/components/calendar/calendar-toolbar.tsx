import { useCalendar } from "@/providers/calendar-provider"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import type { CalendarView } from "@/lib/calendar-types"

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]

interface CalendarToolbarProps {
  onNewEvent: () => void
}

export function CalendarToolbar({ onNewEvent }: CalendarToolbarProps) {
  const { view, setView, currentDate, goToday, goNext, goPrev } = useCalendar()

  const label =
    view === "year"
      ? `${currentDate.getFullYear()}`
      : view === "month"
        ? `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
        : (() => {
            const start = new Date(currentDate)
            start.setDate(start.getDate() - start.getDay())
            const end = new Date(start)
            end.setDate(end.getDate() + 6)
            const sameMonth = start.getMonth() === end.getMonth()
            if (sameMonth) {
              return `${MONTHS[start.getMonth()]} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`
            }
            return `${MONTHS[start.getMonth()].slice(0, 3)} ${start.getDate()} - ${MONTHS[end.getMonth()].slice(0, 3)} ${end.getDate()}, ${end.getFullYear()}`
          })()

  const views: { value: CalendarView; label: string }[] = [
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ]

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/50 px-4 py-3">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={goToday}>
          Today
        </Button>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon-sm" onClick={goPrev} aria-label="Previous">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={goNext} aria-label="Next">
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <h2 className="text-base font-semibold text-foreground text-balance">{label}</h2>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border border-border bg-muted/30 p-0.5">
          {views.map((v) => (
            <button
              key={v.value}
              onClick={() => setView(v.value)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                view === v.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <Button size="sm" onClick={onNewEvent}>
          <Plus className="size-4" />
          Event
        </Button>
      </div>
    </div>
  )
}
