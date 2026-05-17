import { useState, useRef } from "react"
import { useCalendar } from "@/providers/calendar-provider"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
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

  const [showNewCalSheet, setShowNewCalSheet] = useState(false)
  const [newCalName, setNewCalName] = useState("")
  const [newCalColor, setNewCalColor] = useState("#3b82f6")
  const [newCalMembers, setNewCalMembers] = useState<string[]>([])
  const [showMembers, setShowMembers] = useState(false)
  const [showImportSheet, setShowImportSheet] = useState(false)
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
    setShowNewCalSheet(false)
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

      const calId = `imported-${Date.now()}`
      const calName = file.name.replace(/\.(ics|ical)$/i, "") || "Imported"
      addCalendar({
        id: calId,
        name: calName,
        color: "#6366f1",
        memberIds: [],
        visible: true,
      })

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
      setShowImportSheet(false)
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  return (
    <>
      <div className="border-b border-border/50 bg-card">
        {/* Calendars row */}
        <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground pr-1">
            Calendars
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {calendars.map((cal) => (
              <div
                key={cal.id}
                className="group/cal flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all"
                style={{
                  backgroundColor: cal.visible ? cal.color : "var(--muted)",
                  color: cal.visible ? "#fff" : "var(--muted-foreground)",
                  opacity: cal.visible ? 1 : 0.5,
                }}
              >
                <button
                  onClick={() => toggleCalendarVisibility(cal.id)}
                  className="flex items-center gap-1.5"
                  aria-label={`Toggle ${cal.name}`}
                >
                  {cal.visible ? (
                    <Eye className="size-3 shrink-0" />
                  ) : (
                    <EyeOff className="size-3 shrink-0" />
                  )}
                  <span className={cal.visible ? "" : "line-through"}>{cal.name}</span>
                </button>
                <button
                  onClick={() => {
                    deleteCalendar(cal.id)
                    toast.success(`"${cal.name}" deleted`)
                  }}
                  className="ml-0.5 opacity-0 group-hover/cal:opacity-100 transition-opacity rounded-full hover:bg-white/20"
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
            onClick={() => setShowNewCalSheet(true)}
          >
            <Plus className="size-3" />
            Add
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 shrink-0 gap-1 rounded-full px-2.5 text-xs text-muted-foreground"
            onClick={() => setShowImportSheet(true)}
          >
            <Upload className="size-3" />
            Import
          </Button>

          {/* Member filter toggle */}
          <div className="ml-auto shrink-0 flex items-center">
            <button
              onClick={() => setShowMembers(!showMembers)}
              className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>Members ({selectedMemberIds.length}/{members.length})</span>
              {showMembers ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            </button>
          </div>
        </div>

        {/* Members filter row */}
        {showMembers && (
          <div className="flex flex-wrap gap-1.5 border-t border-border/40 px-4 py-2.5 bg-muted/20">
            {members.map((m) => {
              const active = selectedMemberIds.includes(m.id)
              return (
                <button
                  key={m.id}
                  onClick={() => toggleMember(m.id)}
                  className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-xs transition-all ${
                    active
                      ? "bg-muted text-foreground"
                      : "bg-transparent text-muted-foreground opacity-50"
                  }`}
                >
                  <Avatar size="sm" className="size-5">
                    <AvatarImage src={m.avatar} alt={m.name} />
                    <AvatarFallback className="text-[8px]">{m.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{m.name}</span>
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: active ? m.color : "transparent", border: `1.5px solid ${m.color}` }}
                  />
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Calendar Sheet */}
      <Sheet open={showNewCalSheet} onOpenChange={setShowNewCalSheet}>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>Add Calendar</SheetTitle>
            <SheetDescription>Create a new calendar group</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Calendar name"
                value={newCalName}
                onChange={(e) => setNewCalName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newCalColor}
                  onChange={(e) => setNewCalColor(e.target.value)}
                  className="size-10 cursor-pointer rounded-lg border border-border bg-transparent p-1"
                />
                <div
                  className="h-8 flex-1 rounded-lg"
                  style={{ backgroundColor: newCalColor }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Assign Members</label>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                {members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => toggleNewCalMember(m.id)}
                    className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-xs transition-colors ${
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
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleCreateCalendar} disabled={!newCalName.trim()} className="w-full">
              Create Calendar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Import Calendar Sheet */}
      <Sheet open={showImportSheet} onOpenChange={setShowImportSheet}>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>Import Calendar</SheetTitle>
            <SheetDescription>
              Import events from Google Calendar, Outlook, or Apple Calendar
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border p-6">
              <FileDown className="size-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Upload an .ics file to import events
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-4 mr-2" />
                Select File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".ics,.ical"
                className="hidden"
                onChange={handleFileImport}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">How to export:</p>
              <ul className="ml-4 list-disc space-y-0.5">
                <li>Google: Settings &gt; Import &amp; Export</li>
                <li>Outlook: Share &gt; Publish &gt; ICS</li>
                <li>Apple: File &gt; Export</li>
              </ul>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
