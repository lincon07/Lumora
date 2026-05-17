import { useCalendar } from "@/providers/calendar-provider"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Eye,
  EyeOff,
  Plus,
  Trash2,
  X,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function CalendarSidebar() {
  const {
    members,
    calendars,
    selectedMemberIds,
    toggleMember,
    toggleCalendarVisibility,
    addCalendar,
    deleteCalendar,
  } = useCalendar()

  const [showNewCal, setShowNewCal] = useState(false)
  const [newCalName, setNewCalName] = useState("")
  const [newCalColor, setNewCalColor] = useState("#3b82f6")
  const [newCalMembers, setNewCalMembers] = useState<string[]>([])

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

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-5 overflow-y-auto border-r border-border/50 p-4">
      {/* Calendars Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Calendars
          </h3>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setShowNewCal(!showNewCal)}
            aria-label="Add calendar"
          >
            {showNewCal ? <X className="size-3" /> : <Plus className="size-3" />}
          </Button>
        </div>

        {/* New Calendar Form */}
        {showNewCal && (
          <div className="mb-3 flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
            <Input
              placeholder="Calendar name"
              value={newCalName}
              onChange={(e) => setNewCalName(e.target.value)}
              className="h-7 text-xs"
            />
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Color</label>
              <input
                type="color"
                value={newCalColor}
                onChange={(e) => setNewCalColor(e.target.value)}
                className="size-6 cursor-pointer rounded border-0 bg-transparent p-0"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Members
              </label>
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
                    <Avatar size="sm">
                      <AvatarImage src={m.avatar} alt={m.name} />
                      <AvatarFallback>{m.name[0]}</AvatarFallback>
                    </Avatar>
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleCreateCalendar}
              disabled={!newCalName.trim()}
              className="mt-1"
            >
              Create
            </Button>
          </div>
        )}

        {/* Calendar list */}
        <div className="flex flex-col gap-1">
          {calendars.map((cal) => (
            <div
              key={cal.id}
              className="group flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50"
            >
              <button
                onClick={() => toggleCalendarVisibility(cal.id)}
                className="flex items-center gap-2 flex-1 min-w-0"
              >
                <span
                  className="size-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: cal.visible ? cal.color : "transparent", border: `2px solid ${cal.color}` }}
                />
                <span
                  className={`truncate text-sm ${
                    cal.visible ? "text-foreground" : "text-muted-foreground line-through"
                  }`}
                >
                  {cal.name}
                </span>
              </button>
              <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => toggleCalendarVisibility(cal.id)}
                  className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                  aria-label={cal.visible ? "Hide calendar" : "Show calendar"}
                >
                  {cal.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                </button>
                <button
                  onClick={() => {
                    deleteCalendar(cal.id)
                    toast.success(`Calendar "${cal.name}" deleted`)
                  }}
                  className="rounded p-0.5 text-muted-foreground hover:text-destructive"
                  aria-label="Delete calendar"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Family Members Filter */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Family Members
        </h3>
        <div className="flex flex-col gap-1">
          {members.map((m) => {
            const active = selectedMemberIds.includes(m.id)
            return (
              <button
                key={m.id}
                onClick={() => toggleMember(m.id)}
                className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-muted/70 text-foreground"
                    : "text-muted-foreground hover:bg-muted/30"
                }`}
              >
                <Avatar size="sm" className={active ? "" : "opacity-40"}>
                  <AvatarImage src={m.avatar} alt={m.name} />
                  <AvatarFallback>{m.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start min-w-0">
                  <span className={`truncate text-sm ${active ? "" : "line-through"}`}>{m.name}</span>
                  <span className="text-[10px] text-muted-foreground">{m.role}</span>
                </div>
                <span
                  className="ml-auto size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: active ? m.color : "transparent", border: `1.5px solid ${m.color}` }}
                />
              </button>
            )
          })}
        </div>
      </section>
    </aside>
  )
}
