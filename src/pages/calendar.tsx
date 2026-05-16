import { CalendarDays } from "lucide-react"

export default function CalendarPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-chart-5/10">
        <CalendarDays className="size-8 text-chart-5" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">Calendar</h2>
      <p className="text-muted-foreground text-center max-w-sm">
        Your family calendar and events will appear here. Schedule appointments, birthdays, and reminders.
      </p>
    </div>
  )
}
