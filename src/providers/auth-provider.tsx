import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type {
  SetupState,
  SetupStep,
  AdminAccount,
  DeviceConfig,
  PhonePairing,
  PendingPairing,
  PhonePermission,
} from "@/lib/auth-types"
import { DEFAULT_PHONE_PERMISSIONS } from "@/lib/auth-types"

const STORAGE_KEY = "lumora-auth-state"

interface AuthStore {
  // State
  setupState: SetupState
  isLoading: boolean
  pendingPairing: PendingPairing | null

  // Setup flow
  setStep: (step: SetupStep) => void
  setAdmin: (email: string, password: string) => void
  setDevice: (name: string) => void
  setPin: (pin: string) => void
  completeSetup: () => void
  resetSetup: () => void

  // PIN verification
  verifyPin: (pin: string) => boolean

  // Phone pairing
  createPairingCode: (memberId: string, permissions?: PhonePermission[]) => string
  completePairing: (code: string, deviceName: string) => boolean
  cancelPairing: () => void
  removePairing: (id: string) => void
  getPairingsForMember: (memberId: string) => PhonePairing[]
}

const defaultSetupState: SetupState = {
  isActivated: false,
  currentStep: "welcome",
  admin: null,
  device: null,
  pin: null,
  phonePairings: [],
}

const AuthContext = createContext<AuthStore | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [setupState, setSetupState] = useState<SetupState>(defaultSetupState)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingPairing, setPendingPairing] = useState<PendingPairing | null>(null)

  // Load state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SetupState
        setSetupState(parsed)
      } catch {
        // Invalid stored state, use default
      }
    }
    setIsLoading(false)
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(setupState))
    }
  }, [setupState, isLoading])

  const setStep = useCallback((step: SetupStep) => {
    setSetupState((prev) => ({ ...prev, currentStep: step }))
  }, [])

  const setAdmin = useCallback((email: string, password: string) => {
    // In production, hash the password server-side
    const admin: AdminAccount = {
      email,
      passwordHash: btoa(password), // Base64 encoding for demo - use bcrypt in production
    }
    setSetupState((prev) => ({ ...prev, admin, currentStep: "device" }))
  }, [])

  const setDevice = useCallback((name: string) => {
    const device: DeviceConfig = {
      name,
      setupCompletedAt: new Date().toISOString(),
    }
    setSetupState((prev) => ({ ...prev, device, currentStep: "phone" }))
  }, [])

  const setPin = useCallback((pin: string) => {
    setSetupState((prev) => ({ ...prev, pin, currentStep: "complete" }))
  }, [])

  const completeSetup = useCallback(() => {
    setSetupState((prev) => ({ ...prev, isActivated: true }))
  }, [])

  const resetSetup = useCallback(() => {
    setSetupState(defaultSetupState)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const verifyPin = useCallback(
    (pin: string) => {
      return setupState.pin === pin
    },
    [setupState.pin]
  )

  const createPairingCode = useCallback(
    (memberId: string, permissions: PhonePermission[] = DEFAULT_PHONE_PERMISSIONS) => {
      // Generate a unique pairing code
      const code = `LUM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      
      const pending: PendingPairing = {
        code,
        memberId,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        permissions,
      }
      setPendingPairing(pending)
      return code
    },
    []
  )

  const completePairing = useCallback(
    (code: string, deviceName: string) => {
      if (!pendingPairing || pendingPairing.code !== code) return false
      if (new Date(pendingPairing.expiresAt) < new Date()) {
        setPendingPairing(null)
        return false
      }

      const newPairing: PhonePairing = {
        id: `pairing-${Date.now()}`,
        memberId: pendingPairing.memberId,
        deviceName,
        pairedAt: new Date().toISOString(),
        permissions: pendingPairing.permissions,
      }

      setSetupState((prev) => ({
        ...prev,
        phonePairings: [...prev.phonePairings, newPairing],
      }))
      setPendingPairing(null)
      return true
    },
    [pendingPairing]
  )

  const cancelPairing = useCallback(() => {
    setPendingPairing(null)
  }, [])

  const removePairing = useCallback((id: string) => {
    setSetupState((prev) => ({
      ...prev,
      phonePairings: prev.phonePairings.filter((p) => p.id !== id),
    }))
  }, [])

  const getPairingsForMember = useCallback(
    (memberId: string) => {
      return setupState.phonePairings.filter((p) => p.memberId === memberId)
    },
    [setupState.phonePairings]
  )

  return (
    <AuthContext.Provider
      value={{
        setupState,
        isLoading,
        pendingPairing,
        setStep,
        setAdmin,
        setDevice,
        setPin,
        completeSetup,
        resetSetup,
        verifyPin,
        createPairingCode,
        completePairing,
        cancelPairing,
        removePairing,
        getPairingsForMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
