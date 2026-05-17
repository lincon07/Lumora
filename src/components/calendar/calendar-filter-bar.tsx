import { useState } from "react"
import { useCalendar } from "@/providers/calendar-provider"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Plus, Trash2, X, ChevronDown, ChevronUp } from "lucide-react"
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
  } = useCalendar()

  const [showNewCal, setShowNewCal] = useState(false)
  const [newCalName, setNewCalName] = useState("")
  const [newCalColor, setNewCalColor] = useState("#3b82f6")
  const [newCalMembers, setNewCalMembers] = useState<string[]>([])
  const [showMembers, setShowMembers] = useState(false)

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
    </div>
  )
}
