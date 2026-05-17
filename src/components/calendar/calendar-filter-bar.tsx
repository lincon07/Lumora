import { useState, useRef } from "react"
import { useCalendar } from "@/providers/calendar-provider"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Plus, X, ChevronDown, ChevronUp, Upload, FileDown } from "lucide-react"
import { toast } from "sonner"

export function CalendarFilterBar() {
  const {
    members,
    calendars,
    selectedMemberIds,
    toggleMember,
    toggleCalendarVisibility,
    addCalendar,
    deleteCalendar,
    addEvent,
  } = useCalendar()

  const [showNewCal, setShowNewCal] = useState(false)
  const [newCalName, setNewCalName] = useState("")
  const [newCalColor, setNewCalColor] = useState("#3b82f6")
  const [newCalMembers, setNewCalMembers] = useState<string[]>([])
  const [showMembers, setShowMembers] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleCreateCalendar() {
    if (!newCalName.trim()) return
    addCalendar({
      id: `cal-${Date.now()}`,
      name: newCalName.trim(),
      color: newCalColor,
      memberIds: newCalMembers,
      visible: true,
    })
    toast.success(`Calendar "${newCalName.trim()}" created`)
    setNewCalName("")
    setNewCalColor("#3b82f6")
    setNewCalMembers([])
    setShowNewCal(false)
  }

  function toggleNewCalMember(id: string) {
    setNewCalMembers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // Parse ICS file (Google Calendar, Outlook, Apple Calendar export format)
  function parseICS(content: string): { title: string; start: Date; end: Date; description?: string; location?: string }[] {
    const events: { title: string; start: Date; end: Date; description?: string; location?: string }[] = []
    const lines = content.split(/\r?\n/)
    let current: { title?: string; start?: Date; end?: Date; description?: string; location?: string } | null = null

    for (const line of lines) {
      if (line.startsWith("BEGIN:VEVENT")) {
        current = {}
      } else if (line.startsWith("END:VEVENT") && current) {
        if (current.title && current.start && current.end) {
          events.push({
            title: current.title,
            start: current.start,
            end: current.end,
            description: current.description,
            location: current.location,
          })
        }
        current = null
      } else if (current) {
        if (line.startsWith("SUMMARY:")) {
          current.title = line.slice(8)
        } else if (line.startsWith("DTSTART")) {
          const dateStr = line.split(":").pop() ?? ""
          current.start = parseICSDate(dateStr)
        } else if (line.startsWith("DTEND")) {
          const dateStr = line.split(":").pop() ?? ""
          current.end = parseICSDate(dateStr)
        } else if (line.startsWith("DESCRIPTION:")) {
          current.description = line.slice(12)
        } else if (line.startsWith("LOCATION:")) {
          current.location = line.slice(9)
        }
      }
    }
    return events
  }

  function parseICSDate(str: string): Date {
    // Format: 20260517T140000Z or 20260517
    const clean = str.replace(/[^0-9T]/g, "")
    if (clean.length >= 8) {
      const year = parseInt(clean.slice(0, 4), 10)
      const month = parseInt(clean.slice(4, 6), 10) - 1
      const day = parseInt(clean.slice(6, 8), 10)
      const hour = clean.length >= 11 ? parseInt(clean.slice(9, 11), 10) : 0
      const min = clean.length >= 13 ? parseInt(clean.slice(11, 13), 10) : 0
      return new Date(year, month, day, hour, min)
    }
    return new Date()
  }

  function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const content = evt.target?.result as string
      if (!content) {
        toast.error("Could not read file")
        return
      }

      const events = parseICS(content)
      if (events.length === 0) {
        toast.error("No events found in file")
        return
      }

      // Create a new calendar for the import
      const calId = `imported-${Date.now()}`
      const calName = file.name.replace(/\.(ics|ical)$/i, "") || "Imported"
      addCalendar({
        id: calId,
        name: calName,
        color: "#6366f1",
        memberIds: [],
        visible: true,
      })

      // Add all events
      events.forEach((evt, i) => {
        addEvent({
          id: `import-${Date.now()}-${i}`,
          title: evt.title,
          description: evt.description ?? "",
          start: evt.start,
          end: evt.end,
          allDay: false,
          calendarId: calId,
          memberIds: [],
          location: evt.location ?? "",
          recurrence: "none",
        })
      })

      toast.success(`Imported ${events.length} events into "${calName}"`)
      setShowImport(false)
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  return (
    <div className="border-b border-border/50 bg-card">
      {/* Calendars row */}
      <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto">
        <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground pr-1">
          Calendars
        </span>
        <div className="flex items-center gap-1.5 flex-nowrap">
          {calendars.map((cal) => (
            <div key={cal.id} className="group/cal flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors"
              style={{
                borderColor: cal.color,
                backgroundColor: cal.visible ? cal.color + "20" : "transparent",
                color: cal.visible ? cal.color : "var(--muted-foreground)",
              }}
            >
              <button
                onClick={() => toggleCalendarVisibility(cal.id)}
                className="flex items-center gap-1.5"
                aria-label={`Toggle ${cal.name}`}
              >
                {cal.visible
                  ? <Eye className="size-3 shrink-0" />
                  : <EyeOff className="size-3 shrink-0 opacity-50" />
                }
                <span className={cal.visible ? "" : "line-through opacity-50"}>{cal.name}</span>
              </button>
              <button
                onClick={() => {
                  deleteCalendar(cal.id)
                  toast.success(`"${cal.name}" deleted`)
                }}
                className="ml-1 opacity-0 group-hover/cal:opacity-100 transition-opacity rounded-full hover:text-destructive"
                aria-label={`Delete ${cal.name}`}
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 shrink-0 gap-1 rounded-full px-2.5 text-xs text-muted-foreground"
          onClick={() => setShowNewCal(!showNewCal)}
        >
          {showNewCal ? <X className="size-3" /> : <Plus className="size-3" />}
          {showNewCal ? "Cancel" : "Add"}
        </Button>

        {/* Import button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 shrink-0 gap-1 rounded-full px-2.5 text-xs text-muted-foreground"
          onClick={() => setShowImport(!showImport)}
        >
          <Upload className="size-3" />
          Import
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".ics,.ical"
          className="hidden"
          onChange={handleFileImport}
        />

        {/* Member filter toggle */}
        <div className="ml-auto shrink-0 flex items-center">
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
          >
            <span>Members ({selectedMemberIds.length}/{members.length})</span>
            {showMembers ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </button>
        </div>
      </div>

      {/* New calendar form */}
      {showNewCal && (
        <div className="flex flex-wrap items-end gap-3 border-t border-border/40 px-4 py-3 bg-muted/30">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Calendar name"
              value={newCalName}
              onChange={(e) => setNewCalName(e.target.value)}
              className="h-7 w-40 text-xs"
            />
            <input
              type="color"
              value={newCalColor}
              onChange={(e) => setNewCalColor(e.target.value)}
              className="size-7 cursor-pointer rounded border border-border bg-transparent p-0.5"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {members.map((m) => (
              <button
                key={m.id}
                onClick={() => toggleNewCalMember(m.id)}
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors ${
                  newCalMembers.includes(m.id)
                    ? "bg-primary/15 text-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Avatar size="sm" className="size-4">
                  <AvatarImage src={m.avatar} alt={m.name} />
                  <AvatarFallback className="text-[8px]">{m.name[0]}</AvatarFallback>
                </Avatar>
                {m.name}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={handleCreateCalendar} disabled={!newCalName.trim()} className="h-7 text-xs">
            Create
          </Button>
        </div>
      )}

      {/* Members filter row */}
      {showMembers && (
        <div className="flex flex-wrap gap-1.5 border-t border-border/40 px-4 py-2.5 bg-muted/20">
          {members.map((m) => {
            const active = selectedMemberIds.includes(m.id)
            return (
              <button
                key={m.id}
                onClick={() => toggleMember(m.id)}
                className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs transition-all ${
                  active
                    ? "border-transparent bg-muted text-foreground"
                    : "border-border text-muted-foreground opacity-50"
                }`}
              >
                <Avatar size="sm" className="size-5">
                  <AvatarImage src={m.avatar} alt={m.name} />
                  <AvatarFallback className="text-[8px]">{m.name[0]}</AvatarFallback>
                </Avatar>
                <span>{m.name}</span>
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: active ? m.color : "transparent",
                    border: `1.5px solid ${m.color}`,
                  }}
                />
              </button>
            )
          })}
        </div>
      )}

      {/* Import panel */}
      {showImport && (
        <div className="border-t border-border/40 px-4 py-3 bg-muted/30">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <FileDown className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Import Calendar</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Import events from Google Calendar, Outlook, or Apple Calendar by uploading an .ics file.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-2 text-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-3.5" />
                Select .ics file
              </Button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>or drag and drop</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              <strong>How to export:</strong>
              <ul className="mt-1 ml-4 list-disc space-y-0.5">
                <li>Google Calendar: Settings &gt; Import &amp; Export &gt; Export</li>
                <li>Outlook: Calendar &gt; Share &gt; Publish &gt; ICS</li>
                <li>Apple Calendar: File &gt; Export &gt; Export...</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
