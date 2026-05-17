// Auth types for the Lumora home hub

export interface AdminAccount {
  email: string
  passwordHash: string // In production, hash with bcrypt on the backend
}

export interface DeviceConfig {
  name: string
  setupCompletedAt: string // ISO date string
}

export interface PhonePairing {
  id: string
  memberId: string // linked family member
  deviceName: string
  pairedAt: string
  permissions: PhonePermission[]
}

export type PhonePermission = 
  | "view_calendar"
  | "edit_calendar"
  | "view_todos"
  | "edit_todos"
  | "view_meals"
  | "edit_meals"
  | "control_device"

export interface PendingPairing {
  code: string // QR code payload - unique pairing code
  memberId: string
  expiresAt: string
  permissions: PhonePermission[]
}

export interface SetupState {
  isActivated: boolean
  currentStep: SetupStep
  admin: AdminAccount | null
  device: DeviceConfig | null
  pin: string | null // 4-digit PIN for confirmations
  phonePairings: PhonePairing[]
}

export type SetupStep = 
  | "welcome"
  | "account" 
  | "device"
  | "phone"
  | "pin"
  | "complete"

export const DEFAULT_PHONE_PERMISSIONS: PhonePermission[] = [
  "view_calendar",
  "view_todos",
  "view_meals",
]

export const ALL_PHONE_PERMISSIONS: { value: PhonePermission; label: string }[] = [
  { value: "view_calendar", label: "View Calendar" },
  { value: "edit_calendar", label: "Edit Calendar" },
  { value: "view_todos", label: "View Todos" },
  { value: "edit_todos", label: "Edit Todos" },
  { value: "view_meals", label: "View Meal Plans" },
  { value: "edit_meals", label: "Edit Meal Plans" },
  { value: "control_device", label: "Control Device" },
]
