import { useState } from "react"
import { useTheme } from "@/providers/theme-provider"
import { useAuth } from "@/providers/auth-provider"
import { useCalendar } from "@/providers/calendar-provider"
import { useBrightness } from "@/hooks/use-brightness"
import { colorThemes } from "@/lib/color-themes"
import type { ColorTheme } from "@/lib/color-themes"
import { createBlankCustomTheme } from "@/lib/color-themes"
import { ThemeEditor } from "@/components/settings/theme-editor"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
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
import { QRCodeSVG } from "qrcode.react"
import { ALL_PHONE_PERMISSIONS, DEFAULT_PHONE_PERMISSIONS, type PhonePermission } from "@/lib/auth-types"
import { toast } from "sonner"
import {
  Check,
  Palette,
  Sun,
  Moon,
  Monitor,
  Plus,
  Pencil,
  Trash2,
  Lightbulb,
  Shield,
  Smartphone,
  QrCode,
  X,
  RefreshCw,
} from "lucide-react"

export default function SettingsPage() {
  const {
    theme,
    setTheme,
    colorTheme,
    setColorTheme,
    allThemes,
    deleteCustomTheme,
  } = useTheme()
  const {
    setupState,
    resetSetup,
    createPairingCode,
    pendingPairing,
    cancelPairing,
    removePairing,
  } = useAuth()
  const { members } = useCalendar()
  const { brightness, setBrightness } = useBrightness()

  const [editingTheme, setEditingTheme] = useState<ColorTheme | null>(null)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [showPairingSheet, setShowPairingSheet] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<PhonePermission[]>(DEFAULT_PHONE_PERMISSIONS)

  const handleCreateNew = () => {
    const base = colorTheme ?? colorThemes[0]
    setEditingTheme(createBlankCustomTheme(base))
  }

  const handleEditCustom = (ct: ColorTheme) => {
    setEditingTheme(ct)
  }

  const handleDeleteCustom = (ct: ColorTheme) => {
    deleteCustomTheme(ct.id)
    toast.success(`"${ct.name}" deleted`)
  }

  const handleSelectTheme = (ct: ColorTheme) => {
    setColorTheme(ct.id)
    toast.success(`Switched to "${ct.name}"`)
  }

  const handleGenerateQR = () => {
    if (selectedMemberId) {
      createPairingCode(selectedMemberId, selectedPermissions)
    }
  }

  const togglePermission = (perm: PhonePermission) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    )
  }

  const handleResetDevice = () => {
    resetSetup()
    setShowResetDialog(false)
    toast.success("Device has been reset. Reloading...")
    setTimeout(() => window.location.reload(), 1000)
  }

  return (
    <div className="flex flex-col gap-8 p-6 max-w-3xl">
      {/* Appearance Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Palette className="size-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Customize how Lumora looks. Choose your preferred mode and color theme.
        </p>
      </section>

      {/* Light / Dark / System Toggle */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-foreground">Mode</h3>
        <div className="flex gap-2">
          {([
            { value: "light" as const, label: "Light", icon: Sun },
            { value: "dark" as const, label: "Dark", icon: Moon },
            { value: "system" as const, label: "System", icon: Monitor },
          ]).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => {
                setTheme(value)
                toast.success(`Switched to ${label} mode`)
              }}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                theme === value
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Brightness Control */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Lightbulb className="size-5 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Display Brightness</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Adjust your display brightness level
        </p>
        <div className="flex items-center gap-4">
          <Slider
            value={[brightness]}
            onValueChange={(value) => setBrightness(value[0])}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-sm font-medium text-foreground min-w-12 text-right">
            {brightness}%
          </span>
        </div>
      </section>

      {/* Color Theme Picker */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-foreground">Color Theme</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pick a color palette or create your own custom theme.
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="size-3.5" />
            Create Custom
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {allThemes.map((ct) => {
            const isActive = colorTheme.id === ct.id
            return (
              <button
                key={ct.id}
                onClick={() => handleSelectTheme(ct)}
                className={`group relative flex flex-col gap-3 rounded-xl border p-4 text-left transition-all ${
                  isActive
                    ? "border-primary ring-2 ring-primary/20 bg-card"
                    : "border-border bg-card hover:border-muted-foreground/30"
                }`}
              >
                {/* Color preview swatches */}
                <div className="flex gap-1.5">
                  <span
                    className="size-6 rounded-full border border-border/50"
                    style={{ background: ct.preview.primary }}
                  />
                  <span
                    className="size-6 rounded-full border border-border/50"
                    style={{ background: ct.preview.secondary }}
                  />
                  <span
                    className="size-6 rounded-full border border-border/50"
                    style={{ background: ct.preview.accent }}
                  />
                  <span
                    className="size-6 rounded-full border border-border/50"
                    style={{ background: ct.preview.background }}
                  />
                </div>

                {/* Theme info */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">
                    {ct.name}
                    {ct.isCustom && (
                      <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">
                        (custom)
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {ct.description}
                  </span>
                </div>

                {/* Check indicator */}
                {isActive && (
                  <div className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary">
                    <Check className="size-3 text-primary-foreground" />
                  </div>
                )}

                {/* Custom theme actions */}
                {ct.isCustom && (
                  <div className="absolute right-3 bottom-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditCustom(ct)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.stopPropagation()
                          handleEditCustom(ct)
                        }
                      }}
                      className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`Edit ${ct.name}`}
                    >
                      <Pencil className="size-3" />
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCustom(ct)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.stopPropagation()
                          handleDeleteCustom(ct)
                        }
                      }}
                      className="flex size-7 items-center justify-center rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      aria-label={`Delete ${ct.name}`}
                    >
                      <Trash2 className="size-3" />
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* Theme Editor */}
      {editingTheme && (
        <section className="flex flex-col gap-3">
          <ThemeEditor
            editingTheme={editingTheme}
            onClose={() => setEditingTheme(null)}
          />
        </section>
      )}

      {/* Device Info Section */}
      <section className="flex flex-col gap-4 border-t border-border pt-8">
        <div className="flex items-center gap-3">
          <Monitor className="size-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Device</h2>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                {setupState.device?.name || "Unnamed Device"}
              </p>
              <p className="text-xs text-muted-foreground">
                Set up {setupState.device?.setupCompletedAt
                  ? new Date(setupState.device.setupCompletedAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
            <p className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              Admin: {setupState.admin?.email || "Unknown"}
            </p>
          </div>
        </div>
      </section>

      {/* Phone Pairings Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Linked Phones</h2>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setShowPairingSheet(true)}>
            <Plus className="size-4" /> Link Phone
          </Button>
        </div>
        
        {setupState.phonePairings.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center">
            <Smartphone className="mx-auto size-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              No phones linked yet. Link a family member&apos;s phone to give them remote access.
            </p>
          </div>
        ) : (
          <div className="grid gap-2">
            {setupState.phonePairings.map((pairing) => {
              const member = members.find((m) => m.id === pairing.memberId)
              return (
                <div
                  key={pairing.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={member?.avatar} alt={member?.name} />
                      <AvatarFallback>{member?.name?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member?.name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">
                        {pairing.deviceName} - {new Date(pairing.pairedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      removePairing(pairing.id)
                      toast.success("Phone unlinked")
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Security Section */}
      <section className="flex flex-col gap-4 border-t border-border pt-8">
        <div className="flex items-center gap-3">
          <Shield className="size-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Security</h2>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Confirmation PIN</p>
              <p className="text-xs text-muted-foreground">
                4-digit PIN is set and active
              </p>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <span key={i} className="size-2 rounded-full bg-primary" />
              ))}
            </div>
          </div>
        </div>
        <Button
          variant="destructive"
          className="w-fit gap-2"
          onClick={() => setShowResetDialog(true)}
        >
          <RefreshCw className="size-4" /> Reset Device
        </Button>
        <p className="text-xs text-muted-foreground">
          This will erase all setup data and return the device to initial setup mode.
        </p>
      </section>

      {/* Phone Pairing Sheet */}
      <Sheet open={showPairingSheet} onOpenChange={setShowPairingSheet}>
        <SheetContent side="right" className="w-96">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <QrCode className="size-5" />
              Link Phone
            </SheetTitle>
            <SheetDescription>
              Generate a QR code for a family member to scan with their phone.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-5 px-4 py-4">
            {pendingPairing ? (
              <>
                {(() => {
                  const member = members.find((m) => m.id === pendingPairing.memberId)
                  return (
                    <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-3">
                      <Avatar className="size-10">
                        <AvatarImage src={member?.avatar} alt={member?.name} />
                        <AvatarFallback>{member?.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member?.name}</p>
                        <p className="text-xs text-muted-foreground">{member?.role}</p>
                      </div>
                    </div>
                  )
                })()}

                <div className="flex justify-center rounded-2xl bg-white p-4">
                  <QRCodeSVG
                    value={JSON.stringify({
                      type: "lumora-pairing",
                      code: pendingPairing.code,
                      deviceName: setupState.device?.name || "Lumora Hub",
                    })}
                    size={180}
                    level="M"
                  />
                </div>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Pairing code</p>
                  <p className="font-mono text-lg font-bold">{pendingPairing.code}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Expires in 10 minutes</p>
                </div>

                <Button variant="outline" className="w-full" onClick={() => { cancelPairing(); setSelectedMemberId(null); }}>
                  <X className="size-4 mr-2" /> Cancel
                </Button>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Select family member</label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-auto">
                    {members.slice(0, 8).map((member) => (
                      <button
                        key={member.id}
                        onClick={() => setSelectedMemberId(member.id)}
                        className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-all ${
                          selectedMemberId === member.id
                            ? "border-primary bg-primary/5"
                            : "border-border bg-card hover:border-primary/50"
                        }`}
                      >
                        <Avatar className="size-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate">{member.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedMemberId && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Permissions</label>
                    <div className="grid gap-1.5 max-h-40 overflow-auto">
                      {ALL_PHONE_PERMISSIONS.map((perm) => (
                        <button
                          key={perm.value}
                          onClick={() => togglePermission(perm.value)}
                          className={`flex items-center gap-2 rounded-lg border p-2 text-left text-xs transition-all ${
                            selectedPermissions.includes(perm.value)
                              ? "border-primary bg-primary/5"
                              : "border-border bg-card"
                          }`}
                        >
                          <div
                            className={`flex size-4 items-center justify-center rounded border ${
                              selectedPermissions.includes(perm.value)
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border"
                            }`}
                          >
                            {selectedPermissions.includes(perm.value) && <Check className="size-2.5" />}
                          </div>
                          {perm.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {!pendingPairing && (
            <SheetFooter className="px-4">
              <Button
                className="w-full gap-2"
                disabled={!selectedMemberId}
                onClick={handleGenerateQR}
              >
                <QrCode className="size-4" /> Generate QR Code
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Device?</AlertDialogTitle>
            <AlertDialogDescription>
              This will erase all setup data including your admin account, PIN, and phone pairings.
              The device will return to the initial setup wizard. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleResetDevice}
            >
              Reset Device
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
