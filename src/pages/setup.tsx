import { useState } from "react"
import { useAuth } from "@/providers/auth-provider"
import { useCalendar } from "@/providers/calendar-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { QRCodeSVG } from "qrcode.react"
import { ALL_PHONE_PERMISSIONS, DEFAULT_PHONE_PERMISSIONS, type PhonePermission } from "@/lib/auth-types"
import {
  Sparkles,
  Mail,
  Lock,
  Monitor,
  Smartphone,
  KeyRound,
  Check,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  QrCode,
  Shield,
  Users,
  X,
} from "lucide-react"

export default function SetupWizard() {
  const { setupState, setAdmin, setDevice, setPin, setStep, completeSetup, createPairingCode, pendingPairing, cancelPairing } = useAuth()
  const { members } = useCalendar()
  const { currentStep } = setupState

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {["account", "device", "phone", "pin"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`flex size-8 items-center justify-center rounded-full text-xs font-medium transition-all ${
                  currentStep === step
                    ? "bg-primary text-primary-foreground scale-110"
                    : ["device", "phone", "pin", "complete"].indexOf(currentStep) > i
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {["device", "phone", "pin", "complete"].indexOf(currentStep) > i ? (
                  <Check className="size-4" />
                ) : (
                  i + 1
                )}
              </div>
              {i < 3 && (
                <div
                  className={`h-0.5 w-8 rounded ${
                    ["device", "phone", "pin", "complete"].indexOf(currentStep) > i
                      ? "bg-primary/50"
                      : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Steps */}
        {currentStep === "welcome" && <WelcomeStep onNext={() => setStep("account")} />}
        {currentStep === "account" && <AccountStep onSubmit={setAdmin} />}
        {currentStep === "device" && <DeviceStep onSubmit={setDevice} onBack={() => setStep("account")} />}
        {currentStep === "phone" && (
          <PhoneStep
            members={members}
            onCreateCode={createPairingCode}
            pendingPairing={pendingPairing}
            onCancelPairing={cancelPairing}
            onNext={() => setStep("pin")}
            onBack={() => setStep("device")}
          />
        )}
        {currentStep === "pin" && <PinStep onSubmit={setPin} onBack={() => setStep("phone")} />}
        {currentStep === "complete" && <CompleteStep onFinish={completeSetup} />}
      </div>
    </div>
  )
}

// Welcome step
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground">
        L
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome to Lumora</h1>
        <p className="mt-2 text-muted-foreground">
          Your family hub for calendars, tasks, meals, and more. Let&apos;s get you set up.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card p-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Shield className="size-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">Secure Setup</p>
            <p className="text-xs text-muted-foreground">Admin account + PIN protection</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card p-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="size-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">Family Members</p>
            <p className="text-xs text-muted-foreground">Link phones to family profiles</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card p-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">Ready in Minutes</p>
            <p className="text-xs text-muted-foreground">Quick 4-step setup process</p>
          </div>
        </div>
      </div>
      <Button size="lg" className="mt-4 gap-2" onClick={onNext}>
        Get Started <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}

// Account step
function AccountStep({ onSubmit }: { onSubmit: (email: string, password: string) => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    onSubmit(email, password)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Mail className="size-7" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Create Admin Account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This will be the primary account for managing your Lumora hub
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" className="mt-2 gap-2">
          Continue <ChevronRight className="size-4" />
        </Button>
      </form>
    </div>
  )
}

// Device step
function DeviceStep({
  onSubmit,
  onBack,
}: {
  onSubmit: (name: string) => void
  onBack: () => void
}) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Monitor className="size-7" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Name Your Device</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Give this hub a name to identify it in your home
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Device Name</label>
          <Input
            placeholder="e.g. Kitchen Hub, Living Room Display"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-3 mt-2">
          <Button type="button" variant="outline" className="flex-1 gap-2" onClick={onBack}>
            <ChevronLeft className="size-4" /> Back
          </Button>
          <Button type="submit" className="flex-1 gap-2" disabled={!name.trim()}>
            Continue <ChevronRight className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}

// Phone pairing step
function PhoneStep({
  members,
  onCreateCode,
  pendingPairing,
  onCancelPairing,
  onNext,
  onBack,
}: {
  members: { id: string; name: string; avatar: string; role: string }[]
  onCreateCode: (memberId: string, permissions?: PhonePermission[]) => string
  pendingPairing: { code: string; memberId: string } | null
  onCancelPairing: () => void
  onNext: () => void
  onBack: () => void
}) {
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<PhonePermission[]>(DEFAULT_PHONE_PERMISSIONS)
  const [showQR, setShowQR] = useState(false)

  const handleGenerateQR = () => {
    if (selectedMember) {
      onCreateCode(selectedMember, selectedPermissions)
      setShowQR(true)
    }
  }

  const handleCancel = () => {
    onCancelPairing()
    setShowQR(false)
    setSelectedMember(null)
  }

  const togglePermission = (perm: PhonePermission) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    )
  }

  if (showQR && pendingPairing) {
    const member = members.find((m) => m.id === pendingPairing.memberId)
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <QrCode className="size-7" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Scan to Pair</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Scan this QR code with {member?.name}&apos;s phone to link their account
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4">
          <QRCodeSVG
            value={JSON.stringify({
              type: "lumora-pairing",
              code: pendingPairing.code,
              deviceName: "Lumora Hub",
            })}
            size={200}
            level="M"
          />
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">Pairing code</p>
          <p className="font-mono text-lg font-bold text-foreground">{pendingPairing.code}</p>
          <p className="mt-1 text-xs text-muted-foreground">Expires in 10 minutes</p>
        </div>

        <div className="flex gap-3 w-full">
          <Button variant="outline" className="flex-1" onClick={handleCancel}>
            <X className="size-4 mr-2" /> Cancel
          </Button>
          <Button className="flex-1" onClick={() => { handleCancel(); }}>
            <Check className="size-4 mr-2" /> Done
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Smartphone className="size-7" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Link Phone (Optional)</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect a family member&apos;s phone to control certain features remotely
        </p>
      </div>

      {!selectedMember ? (
        <>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Select a family member</label>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-auto">
              {members.slice(0, 8).map((member) => (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member.id)}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-primary hover:bg-primary/5"
                >
                  <Avatar className="size-10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <Button type="button" variant="outline" className="flex-1 gap-2" onClick={onBack}>
              <ChevronLeft className="size-4" /> Back
            </Button>
            <Button type="button" variant="ghost" className="flex-1" onClick={onNext}>
              Skip for Now
            </Button>
          </div>
        </>
      ) : (
        <>
          {(() => {
            const member = members.find((m) => m.id === selectedMember)
            return (
              <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-3">
                <Avatar className="size-10">
                  <AvatarImage src={member?.avatar} alt={member?.name} />
                  <AvatarFallback>{member?.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{member?.name}</p>
                  <p className="text-xs text-muted-foreground">{member?.role}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedMember(null)}>
                  Change
                </Button>
              </div>
            )
          })()}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Permissions</label>
            <div className="grid gap-2">
              {ALL_PHONE_PERMISSIONS.map((perm) => (
                <button
                  key={perm.value}
                  onClick={() => togglePermission(perm.value)}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                    selectedPermissions.includes(perm.value)
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div
                    className={`flex size-5 items-center justify-center rounded border ${
                      selectedPermissions.includes(perm.value)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    }`}
                  >
                    {selectedPermissions.includes(perm.value) && <Check className="size-3" />}
                  </div>
                  <span className="text-sm">{perm.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setSelectedMember(null)}>
              Back
            </Button>
            <Button type="button" className="flex-1 gap-2" onClick={handleGenerateQR}>
              <QrCode className="size-4" /> Generate QR
            </Button>
          </div>

          <Button type="button" variant="ghost" className="w-full" onClick={onNext}>
            Skip for Now
          </Button>
        </>
      )}
    </div>
  )
}

// PIN step
function PinStep({
  onSubmit,
  onBack,
}: {
  onSubmit: (pin: string) => void
  onBack: () => void
}) {
  const [pin, setPin] = useState(["", "", "", ""])
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""])
  const [stage, setStage] = useState<"enter" | "confirm">("enter")
  const [error, setError] = useState("")

  const handlePinChange = (index: number, value: string, isConfirm = false) => {
    if (!/^\d*$/.test(value)) return

    const newPin = isConfirm ? [...confirmPin] : [...pin]
    newPin[index] = value.slice(-1)

    if (isConfirm) {
      setConfirmPin(newPin)
    } else {
      setPin(newPin)
    }
    setError("")

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`${isConfirm ? "confirm-" : ""}pin-${index + 1}`)
      nextInput?.focus()
    }

    // Auto-submit when all filled
    if (index === 3 && value) {
      if (!isConfirm) {
        setTimeout(() => {
          setStage("confirm")
          setTimeout(() => {
            document.getElementById("confirm-pin-0")?.focus()
          }, 50)
        }, 150)
      } else {
        const pinStr = pin.join("")
        const confirmStr = [...newPin].join("")
        if (pinStr === confirmStr) {
          onSubmit(pinStr)
        } else {
          setError("PINs do not match. Try again.")
          // Clear only the last digit and keep focus on 4th input
          const resetConfirm = [...newPin]
          resetConfirm[3] = ""
          setConfirmPin(resetConfirm)
          setTimeout(() => {
            document.getElementById("confirm-pin-3")?.focus()
          }, 50)
        }
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent, isConfirm = false) => {
    if (e.key === "Backspace") {
      const currentPin = isConfirm ? confirmPin : pin
      if (!currentPin[index] && index > 0) {
        const prevInput = document.getElementById(`${isConfirm ? "confirm-" : ""}pin-${index - 1}`)
        prevInput?.focus()
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <KeyRound className="size-7" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          {stage === "enter" ? "Create PIN" : "Confirm PIN"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {stage === "enter"
            ? "Set a 4-digit PIN for confirmations and quick access"
            : "Enter your PIN again to confirm"}
        </p>
      </div>

      <div className="flex justify-center gap-3">
        {(stage === "enter" ? pin : confirmPin).map((digit, i) => (
          <input
            key={i}
            id={`${stage === "confirm" ? "confirm-" : ""}pin-${i}`}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handlePinChange(i, e.target.value, stage === "confirm")}
            onKeyDown={(e) => handleKeyDown(i, e, stage === "confirm")}
            className="size-14 rounded-xl border border-border bg-card text-center text-2xl font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            autoFocus={i === 0}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-3 mt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => {
            if (stage === "confirm") {
              setStage("enter")
              setConfirmPin(["", "", "", ""])
              setError("")
            } else {
              onBack()
            }
          }}
        >
          <ChevronLeft className="size-4" /> Back
        </Button>
      </div>
    </div>
  )
}

// Complete step
function CompleteStep({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-green-500/10 text-green-500">
        <Check className="size-10" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground">All Set!</h2>
        <p className="mt-2 text-muted-foreground">
          Your Lumora hub is ready to use. You can add more family members and phones later in Settings.
        </p>
      </div>
      <Button size="lg" className="mt-4 gap-2" onClick={onFinish}>
        <Sparkles className="size-4" /> Enter Lumora
      </Button>
    </div>
  )
}
