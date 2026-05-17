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
import { Eye, EyeOff, Plus, X, ChevronDown, ChevronUp, Upload, FileDown, Link, CheckCircle2, AlertCircle, ExternalLink, Pencil, Trash2, Check } from "lucide-react"
import { toast } from "sonner"
import type { CalendarGroup } from "@/lib/calendar-types"

export function CalendarFilterBar() {
  const {
    members,
    calendars,
    selectedMemberIds,
    toggleMember,
    toggleCalendarVisibility,
    addCalendar,
    updateCalendar,
    deleteCalendar,
    addEvent,
  } = useCalendar()

  const [showNewCalSheet, setShowNewCalSheet] = useState(false)
  const [newCalName, setNewCalName] = useState("")
  const [newCalColor, setNewCalColor] = useState("#3b82f6")
  const [newCalMembers, setNewCalMembers] = useState<string[]>([])
  const [showMembers, setShowMembers] = useState(false)
  const [showImportSheet, setShowImportSheet] = useState(false)
  const [showConnectSheet, setShowConnectSheet] = useState(false)
  const [googleConnected, setGoogleConnected] = useState(false)
  const [googleClientId, setGoogleClientId] = useState("")
  const [googleClientSecret, setGoogleClientSecret] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Edit calendar state
  const [editingCalendar, setEditingCalendar] = useState<CalendarGroup | null>(null)
  const [editCalName, setEditCalName] = useState("")
  const [editCalColor, setEditCalColor] = useState("")
  const [editCalMembers, setEditCalMembers] = useState<string[]>([])

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

  // Edit calendar functions
  function openEditCalendar(cal: CalendarGroup) {
    setEditingCalendar(cal)
    setEditCalName(cal.name)
    setEditCalColor(cal.color)
    setEditCalMembers(cal.memberIds)
  }

  function toggleEditCalMember(id: string) {
    setEditCalMembers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function handleUpdateCalendar() {
    if (!editingCalendar || !editCalName.trim()) return
    updateCalendar(editingCalendar.id, {
      name: editCalName.trim(),
      color: editCalColor,
      memberIds: editCalMembers,
    })
    toast.success(`Calendar "${editCalName.trim()}" updated`)
    setEditingCalendar(null)
  }

  function handleDeleteCalendar() {
    if (!editingCalendar) return
    deleteCalendar(editingCalendar.id)
    toast.success(`Calendar "${editingCalendar.name}" deleted`)
    setEditingCalendar(null)
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
                  onClick={() => openEditCalendar(cal)}
                  className="ml-0.5 opacity-0 group-hover/cal:opacity-100 transition-opacity rounded-full hover:bg-white/20 p-0.5"
                  aria-label={`Edit ${cal.name}`}
                >
                  <Pencil className="size-2.5" />
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

          <Button
            variant="ghost"
            size="sm"
            className={`h-7 shrink-0 gap-1 rounded-full px-2.5 text-xs ${googleConnected ? "text-green-500" : "text-muted-foreground"}`}
            onClick={() => setShowConnectSheet(true)}
          >
            {googleConnected ? <CheckCircle2 className="size-3" /> : <Link className="size-3" />}
            {googleConnected ? "Google Connected" : "Connect"}
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

      {/* Google Calendar Connect Sheet */}
      <Sheet open={showConnectSheet} onOpenChange={setShowConnectSheet}>
        <SheetContent side="right" className="w-96">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="size-5" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google Calendar
            </SheetTitle>
            <SheetDescription>
              Connect your Google Calendar account to sync events in real-time.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-5 px-4 py-4">
            {googleConnected ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                  <CheckCircle2 className="size-5 text-green-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Connected</p>
                    <p className="text-xs text-muted-foreground">Google Calendar is syncing</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => {
                    setGoogleConnected(false)
                    setGoogleClientId("")
                    setGoogleClientSecret("")
                    toast.success("Google Calendar disconnected")
                  }}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground space-y-1.5">
                  <p className="font-medium text-foreground">Setup required</p>
                  <p>To connect Google Calendar you need OAuth 2.0 credentials from Google Cloud Console.</p>
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline mt-1"
                  >
                    Open Google Cloud Console <ExternalLink className="size-3" />
                  </a>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Client ID</label>
                    <Input
                      placeholder="xxxx.apps.googleusercontent.com"
                      value={googleClientId}
                      onChange={(e) => setGoogleClientId(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Client Secret</label>
                    <Input
                      type="password"
                      placeholder="Your client secret"
                      value={googleClientSecret}
                      onChange={(e) => setGoogleClientSecret(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 flex gap-2">
                  <AlertCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    In production this OAuth flow runs server-side via Tauri commands. This UI is the frontend template — wire up the backend IPC command to exchange the auth code for tokens.
                  </p>
                </div>

                <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">Required OAuth scopes:</p>
                  <ul className="ml-3 list-disc space-y-0.5">
                    <li>https://www.googleapis.com/auth/calendar.readonly</li>
                    <li>https://www.googleapis.com/auth/calendar.events</li>
                  </ul>
                </div>
              </>
            )}
          </div>

          {!googleConnected && (
            <SheetFooter className="px-4">
              <Button
                className="w-full gap-2"
                disabled={!googleClientId.trim() || !googleClientSecret.trim()}
                onClick={() => {
                  // In production: invoke("start_google_oauth", { clientId, clientSecret })
                  // then handle the redirect URI callback to exchange code for tokens.
                  setGoogleConnected(true)
                  toast.success("Google Calendar connected (demo mode)")
                  setShowConnectSheet(false)
                }}
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </Button>
            </SheetFooter>
          )}
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

      {/* Edit Calendar Sheet */}
      <Sheet open={!!editingCalendar} onOpenChange={(open) => !open && setEditingCalendar(null)}>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>Edit Calendar</SheetTitle>
            <SheetDescription>Update calendar settings and members</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Calendar name"
                value={editCalName}
                onChange={(e) => setEditCalName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={editCalColor}
                  onChange={(e) => setEditCalColor(e.target.value)}
                  className="size-10 cursor-pointer rounded-lg border border-border bg-transparent p-1"
                />
                <div
                  className="h-8 flex-1 rounded-lg"
                  style={{ backgroundColor: editCalColor }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Assigned Members</label>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                {members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => toggleEditCalMember(m.id)}
                    className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-xs transition-colors ${
                      editCalMembers.includes(m.id)
                        ? "bg-primary/15 text-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {editCalMembers.includes(m.id) && <Check className="size-3" />}
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
          <SheetFooter className="flex-col gap-2">
            <Button onClick={handleUpdateCalendar} disabled={!editCalName.trim()} className="w-full">
              Save Changes
            </Button>
            <Button
              variant="outline"
              className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={handleDeleteCalendar}
            >
              <Trash2 className="size-4 mr-2" />
              Delete Calendar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
