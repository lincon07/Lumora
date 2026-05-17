import { useState, useEffect } from "react"
import { useCalendar } from "@/providers/calendar-provider"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import type { CalendarEvent } from "@/lib/calendar-types"
import { Trash2 } from "lucide-react"

interface EventFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: CalendarEvent | null
  defaultDate?: Date
}

const RECURRENCE_OPTIONS = [
  { value: "none", label: "No repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
] as const

function toLocalDatetime(iso: string): string {
  const d = new Date(iso)
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

function toLocalDate(iso: string): string {
  return toLocalDatetime(iso).slice(0, 10)
}

export function EventForm({ open, onOpenChange, event, defaultDate }: EventFormProps) {
  const { calendars, members, addEvent, updateEvent, deleteEvent } = useCalendar()
  const isEdit = !!event

  const defaultStart = defaultDate ?? new Date()
  const defaultEnd = new Date(defaultStart.getTime() + 60 * 60 * 1000)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [allDay, setAllDay] = useState(false)
  const [calendarId, setCalendarId] = useState("")
  const [memberIds, setMemberIds] = useState<string[]>([])
  const [location, setLocation] = useState("")
  const [recurrence, setRecurrence] = useState<CalendarEvent["recurrence"]>("none")

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description)
      setStart(event.allDay ? toLocalDate(event.start) : toLocalDatetime(event.start))
      setEnd(event.allDay ? toLocalDate(event.end) : toLocalDatetime(event.end))
      setAllDay(event.allDay)
      setCalendarId(event.calendarId)
      setMemberIds(event.memberIds)
      setLocation(event.location)
      setRecurrence(event.recurrence)
    } else {
      setTitle("")
      setDescription("")
      setStart(toLocalDatetime(defaultStart.toISOString()))
      setEnd(toLocalDatetime(defaultEnd.toISOString()))
      setAllDay(false)
      setCalendarId(calendars[0]?.id ?? "")
      setMemberIds([])
      setLocation("")
      setRecurrence("none")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    const startISO = allDay
      ? new Date(start + "T00:00:00").toISOString()
      : new Date(start).toISOString()
    const endISO = allDay
      ? new Date(end + "T23:59:59").toISOString()
      : new Date(end).toISOString()

    if (isEdit && event) {
      updateEvent(event.id, {
        title: title.trim(),
        description,
        start: startISO,
        end: endISO,
        allDay,
        calendarId,
        memberIds,
        location,
        recurrence,
      })
      toast.success(`Event "${title.trim()}" updated`)
    } else {
      addEvent({
        id: `evt-${Date.now()}`,
        title: title.trim(),
        description,
        start: startISO,
        end: endISO,
        allDay,
        calendarId,
        memberIds,
        location,
        recurrence,
      })
      toast.success(`Event "${title.trim()}" created`)
    }
    onOpenChange(false)
  }

  function handleDelete() {
    if (event) {
      deleteEvent(event.id)
      toast.success(`Event "${event.title}" deleted`)
      onOpenChange(false)
    }
  }

  function toggleMember(id: string) {
    setMemberIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const selectedCalendar = calendars.find((c) => c.id === calendarId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Event" : "New Event"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the event details below."
              : "Fill in the details to create a new event."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={2}
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none transition-colors dark:bg-input/30"
            />
          </div>

          {/* All-day toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="size-4 rounded border-input accent-primary"
            />
            <span className="text-sm">All-day event</span>
          </label>

          {/* Start / End */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Start</label>
              <Input
                type={allDay ? "date" : "datetime-local"}
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">End</label>
              <Input
                type={allDay ? "date" : "datetime-local"}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          {/* Calendar */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Calendar</label>
            <div className="flex flex-wrap gap-1.5">
              {calendars.map((cal) => (
                <button
                  key={cal.id}
                  type="button"
                  onClick={() => setCalendarId(cal.id)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
                    calendarId === cal.id
                      ? "border-transparent text-foreground"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                  style={
                    calendarId === cal.id
                      ? { backgroundColor: cal.color + "25" }
                      : undefined
                  }
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: cal.color }}
                  />
                  {cal.name}
                </button>
              ))}
            </div>
          </div>

          {/* Members */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Assign Members
              {selectedCalendar && (
                <span className="text-muted-foreground font-normal">
                  {" "}(from {selectedCalendar.name})
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {members.map((m) => {
                const inCalendar = selectedCalendar?.memberIds.includes(m.id) ?? true
                if (!inCalendar) return null
                const active = memberIds.includes(m.id)
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMember(m.id)}
                    className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs transition-colors ${
                      active
                        ? "border-primary/30 bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Avatar size="sm">
                      <AvatarImage src={m.avatar} alt={m.name} />
                      <AvatarFallback>{m.name[0]}</AvatarFallback>
                    </Avatar>
                    {m.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Location</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location"
            />
          </div>

          {/* Recurrence */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Repeat</label>
            <div className="flex flex-wrap gap-1.5">
              {RECURRENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRecurrence(opt.value as CalendarEvent["recurrence"])}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    recurrence === opt.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <SheetFooter className="flex-row gap-2 p-0 mt-2">
            {isEdit && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                <Trash2 className="size-4" />
                Delete
              </Button>
            )}
            <div className="flex-1" />
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              {isEdit ? "Save Changes" : "Create Event"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
