/**
 * Auth API
 * Authentication, setup, and device pairing operations
 */

import { apiFetch, mockResponse, type ApiResponse } from "./config"
import type { SetupState, PhonePairing, PhonePermission } from "@/lib/auth-types"

// Endpoints
const AUTH_ENDPOINT = "/auth"

/**
 * Get current setup/auth state
 */
export async function getSetupState(): Promise<ApiResponse<SetupState>> {
  return apiFetch<SetupState>(`${AUTH_ENDPOINT}/setup`)
}

/**
 * Save setup state
 */
export async function saveSetupState(state: SetupState): Promise<ApiResponse<SetupState>> {
  // In production: return apiFetch<SetupState>(`${AUTH_ENDPOINT}/setup`, { method: "POST", body: JSON.stringify(state) })
  return mockResponse(state)
}

/**
 * Create admin account
 */
export async function createAdminAccount(
  email: string,
  password: string
): Promise<ApiResponse<{ email: string }>> {
  // In production: return apiFetch<{ email: string }>(`${AUTH_ENDPOINT}/admin`, { method: "POST", body: JSON.stringify({ email, password }) })
  return mockResponse({ email })
}

/**
 * Verify admin credentials
 */
export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<ApiResponse<{ valid: boolean }>> {
  return apiFetch<{ valid: boolean }>(`${AUTH_ENDPOINT}/verify`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

/**
 * Set device name
 */
export async function setDeviceName(name: string): Promise<ApiResponse<{ name: string }>> {
  // In production: return apiFetch<{ name: string }>(`${AUTH_ENDPOINT}/device`, { method: "POST", body: JSON.stringify({ name }) })
  return mockResponse({ name })
}

/**
 * Set PIN code
 */
export async function setPin(pin: string): Promise<ApiResponse<{ set: boolean }>> {
  // In production: return apiFetch<{ set: boolean }>(`${AUTH_ENDPOINT}/pin`, { method: "POST", body: JSON.stringify({ pin }) })
  return mockResponse({ set: true })
}

/**
 * Verify PIN code
 */
export async function verifyPin(pin: string): Promise<ApiResponse<{ valid: boolean }>> {
  // In production: return apiFetch<{ valid: boolean }>(`${AUTH_ENDPOINT}/pin/verify`, { method: "POST", body: JSON.stringify({ pin }) })
  return mockResponse({ valid: true })
}

/**
 * Create phone pairing code
 */
export async function createPairingCode(
  memberId: string,
  permissions: PhonePermission[]
): Promise<ApiResponse<{ code: string; expiresAt: string }>> {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
  
  // In production: return apiFetch<{ code: string; expiresAt: string }>(`${AUTH_ENDPOINT}/pairing`, { method: "POST", body: JSON.stringify({ memberId, permissions }) })
  return mockResponse({ code, expiresAt })
}

/**
 * Complete phone pairing
 */
export async function completePairing(
  code: string,
  deviceName: string
): Promise<ApiResponse<PhonePairing>> {
  const pairing: PhonePairing = {
    id: `pairing-${Date.now()}`,
    memberId: "", // Would be looked up by code
    deviceName,
    pairedAt: new Date().toISOString(),
    permissions: [],
  }
  
  // In production: return apiFetch<PhonePairing>(`${AUTH_ENDPOINT}/pairing/complete`, { method: "POST", body: JSON.stringify({ code, deviceName }) })
  return mockResponse(pairing)
}

/**
 * Remove phone pairing
 */
export async function removePairing(pairingId: string): Promise<ApiResponse<{ deleted: boolean }>> {
  // In production: return apiFetch<{ deleted: boolean }>(`${AUTH_ENDPOINT}/pairing/${pairingId}`, { method: "DELETE" })
  return mockResponse({ deleted: true })
}

/**
 * Reset device (clear all setup data)
 */
export async function resetDevice(): Promise<ApiResponse<{ reset: boolean }>> {
  // In production: return apiFetch<{ reset: boolean }>(`${AUTH_ENDPOINT}/reset`, { method: "POST" })
  return mockResponse({ reset: true })
}
