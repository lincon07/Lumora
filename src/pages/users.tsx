import { useState, useRef } from "react"
import { CalendarProvider, useCalendar } from "@/providers/calendar-provider"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Pencil,
  Trash2,
  User,
  Baby,
  GraduationCap,
  Briefcase,
  Heart,
  X,
  Check,
  Palette,
} from "lucide-react"
import { toast } from "sonner"
import type { FamilyMember } from "@/lib/calendar-types"

const ROLE_OPTIONS = ["Child", "Teen", "Adult", "Senior"]

const ROLE_ICONS: Record<string, React.ElementType> = {
  Child: Baby,
  Teen: GraduationCap,
  Adult: Briefcase,
  Senior: Heart,
}

const ROLE_COLORS: Record<string, string> = {
  Child: "bg-amber-500/20 text-amber-400",
  Teen: "bg-violet-500/20 text-violet-400",
  Adult: "bg-blue-500/20 text-blue-400",
  Senior: "bg-emerald-500/20 text-emerald-400",
}

const COLOR_PRESETS = [
  "#FBBF24", "#F472B6", "#FB923C", "#60A5FA",
  "#A78BFA", "#34D399", "#FB7185", "#38BDF8",
  "#1D4ED8", "#0D9488", "#9F1239", "#D97706",
  "#DB2777", "#2563EB", "#78716C", "#7C3AED",
]

function UsersInner() {
  const { members, addMember, updateMember, deleteMember } = useCalendar()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<FamilyMember | null>(null)

  // New member form state
  const [newName, setNewName] = useState("")
  const [newRole, setNewRole] = useState("Adult")
  const [newColor, setNewColor] = useState("#3b82f6")
  const [newAvatar, setNewAvatar] = useState("")

  // Edit form state
  const [editName, setEditName] = useState("")
  const [editRole, setEditRole] = useState("")
  const [editColor, setEditColor] = useState("")

  // Swipe state
  const swipeRef = useRef<{ [key: string]: { startX: number; currentX: number } }>({})
  const [swipedId, setSwipedId] = useState<string | null>(null)

  function handleAddMember() {
    if (!newName.trim()) {
      toast.error("Please enter a name")
      return
    }
    const id = `member-${Date.now()}`
    addMember({
      id,
      name: newName.trim(),
      role: newRole,
      color: newColor,
      avatar: newAvatar || `/avatars/placeholder-${newRole.toLowerCase()}.jpg`,
    })
    toast.success(`Added ${newName}`)
    setNewName("")
    setNewRole("Adult")
    setNewColor("#3b82f6")
    setNewAvatar("")
    setShowAddSheet(false)
  }

  function startEditing(member: FamilyMember) {
    setEditingId(member.id)
    setEditName(member.name)
    setEditRole(member.role)
    setEditColor(member.color)
  }

  function saveEditing() {
    if (!editingId) return
    updateMember(editingId, {
      name: editName,
      role: editRole,
      color: editColor,
    })
    toast.success("Member updated")
    setEditingId(null)
  }

  function cancelEditing() {
    setEditingId(null)
  }

  function confirmDelete(member: FamilyMember) {
    setDeleteConfirm(member)
  }

  function handleDelete() {
    if (!deleteConfirm) return
    deleteMember(deleteConfirm.id)
    toast.success(`Removed ${deleteConfirm.name}`)
    setDeleteConfirm(null)
    setSwipedId(null)
  }

  // Touch swipe handlers
  function handleTouchStart(id: string, e: React.TouchEvent) {
    swipeRef.current[id] = { startX: e.touches[0].clientX, currentX: 0 }
  }

  function handleTouchMove(id: string, e: React.TouchEvent) {
    if (!swipeRef.current[id]) return
    const diff = swipeRef.current[id].startX - e.touches[0].clientX
    swipeRef.current[id].currentX = diff
    if (diff > 60) {
      setSwipedId(id)
    } else if (diff < 20) {
      setSwipedId(null)
    }
  }

  function handleTouchEnd(id: string) {
    if (swipeRef.current[id]?.currentX > 100) {
      // Keep swiped state for delete action
    } else {
      setSwipedId(null)
    }
    delete swipeRef.current[id]
  }

  // Group members by role
  const grouped = ROLE_OPTIONS.map((role) => ({
    role,
    members: members.filter((m) => m.role === role),
  })).filter((g) => g.members.length > 0)

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Family Members</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {members.length} member{members.length !== 1 ? "s" : ""} in your household
          </p>
        </div>
        <Button onClick={() => setShowAddSheet(true)} className="gap-2">
          <Plus className="size-4" />
          Add Member
        </Button>
      </div>

      {/* Members grouped by role */}
      {grouped.map(({ role, members: roleMembers }) => {
        const Icon = ROLE_ICONS[role] || User
        return (
          <div key={role} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center size-7 rounded-lg ${ROLE_COLORS[role]}`}>
                <Icon className="size-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{role}s</h3>
              <span className="text-xs text-muted-foreground">({roleMembers.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {roleMembers.map((member) => {
                const isEditing = editingId === member.id
                const isSwiped = swipedId === member.id

                return (
                  <div
                    key={member.id}
                    className="relative overflow-hidden rounded-xl"
                    onTouchStart={(e) => handleTouchStart(member.id, e)}
                    onTouchMove={(e) => handleTouchMove(member.id, e)}
                    onTouchEnd={() => handleTouchEnd(member.id)}
                  >
                    {/* Delete action behind card */}
                    <div
                      className={`absolute inset-y-0 right-0 flex items-center justify-end pr-4 bg-destructive transition-all ${
                        isSwiped ? "w-24" : "w-0"
                      }`}
                    >
                      <button
                        onClick={() => confirmDelete(member)}
                        className="flex flex-col items-center gap-1 text-destructive-foreground"
                      >
                        <Trash2 className="size-5" />
                        <span className="text-[10px]">Delete</span>
                      </button>
                    </div>

                    {/* Main card */}
                    <div
                      className={`relative bg-card border border-border/50 rounded-xl p-4 transition-transform ${
                        isSwiped ? "-translate-x-20" : "translate-x-0"
                      }`}
                      style={{
                        borderLeftColor: member.color,
                        borderLeftWidth: "3px",
                      }}
                    >
                      {isEditing ? (
                        // Edit mode
                        <div className="flex flex-col gap-3">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Name"
                            className="h-9"
                            autoFocus
                          />
                          <Select value={editRole} onValueChange={setEditRole}>
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLE_OPTIONS.map((r) => (
                                <SelectItem key={r} value={r}>
                                  {r}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex flex-wrap gap-1.5">
                            {COLOR_PRESETS.map((c) => (
                              <button
                                key={c}
                                onClick={() => setEditColor(c)}
                                className={`size-6 rounded-full transition-all ${
                                  editColor === c ? "ring-2 ring-white ring-offset-2 ring-offset-card" : ""
                                }`}
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                          <div className="flex gap-2 mt-1">
                            <Button size="sm" variant="ghost" onClick={cancelEditing} className="flex-1">
                              <X className="size-4 mr-1" /> Cancel
                            </Button>
                            <Button size="sm" onClick={saveEditing} className="flex-1">
                              <Check className="size-4 mr-1" /> Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <div className="flex items-center gap-3">
                          <Avatar className="size-14 ring-2 ring-border/50">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback
                              className="text-lg font-semibold"
                              style={{ backgroundColor: member.color + "30", color: member.color }}
                            >
                              {member.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold text-foreground truncate">
                              {member.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${ROLE_COLORS[member.role]}`}
                              >
                                {member.role}
                              </span>
                              <span
                                className="size-3 rounded-full ring-1 ring-white/20"
                                style={{ backgroundColor: member.color }}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => startEditing(member)}
                              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                            >
                              <Pencil className="size-4" />
                            </button>
                            <button
                              onClick={() => confirmDelete(member)}
                              className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Empty state */}
      {members.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted mb-4">
            <User className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No family members yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Add your first family member to start organizing your household calendar.
          </p>
          <Button onClick={() => setShowAddSheet(true)} className="mt-4 gap-2">
            <Plus className="size-4" />
            Add First Member
          </Button>
        </div>
      )}

      {/* Add Member Sheet */}
      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent side="right" className="w-96">
          <SheetHeader>
            <SheetTitle>Add Family Member</SheetTitle>
            <SheetDescription>
              Add a new member to your household. They will appear in calendars and can be assigned to events.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-5 py-6">
            {/* Avatar preview */}
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="size-24 ring-4 ring-border">
                  <AvatarFallback
                    className="text-2xl font-bold"
                    style={{ backgroundColor: newColor + "30", color: newColor }}
                  >
                    {newName ? newName[0].toUpperCase() : "?"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute -bottom-1 -right-1 size-6 rounded-full ring-2 ring-card"
                  style={{ backgroundColor: newColor }}
                />
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Enter name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Role</label>
              <div className="grid grid-cols-4 gap-2">
                {ROLE_OPTIONS.map((r) => {
                  const Icon = ROLE_ICONS[r] || User
                  const isSelected = newRole === r
                  return (
                    <button
                      key={r}
                      onClick={() => setNewRole(r)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-muted-foreground/50"
                      }`}
                    >
                      <Icon className="size-5" />
                      <span className="text-[10px] font-medium">{r}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Color */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium flex items-center gap-2">
                <Palette className="size-4" />
                Personal Color
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className={`size-8 rounded-full transition-all hover:scale-110 ${
                      newColor === c ? "ring-2 ring-white ring-offset-2 ring-offset-card scale-110" : ""
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button
              className="w-full"
              disabled={!newName.trim()}
              onClick={handleAddMember}
            >
              <Plus className="size-4 mr-2" />
              Add {newName || "Member"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {deleteConfirm?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {deleteConfirm?.name} from all calendars and events. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function UsersPage() {
  return (
    <CalendarProvider>
      <UsersInner />
    </CalendarProvider>
  )
}
