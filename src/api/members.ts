/**
 * Family Members API
 * CRUD operations for family members
 */

import { apiFetch, mockResponse, type ApiResponse } from "./config"
import type { FamilyMember } from "@/lib/calendar-types"

// Endpoints
const MEMBERS_ENDPOINT = "/members"

/**
 * Get all family members
 */
export async function getMembers(): Promise<ApiResponse<FamilyMember[]>> {
  return apiFetch<FamilyMember[]>(MEMBERS_ENDPOINT)
}

/**
 * Get a single member by ID
 */
export async function getMember(id: string): Promise<ApiResponse<FamilyMember>> {
  return apiFetch<FamilyMember>(`${MEMBERS_ENDPOINT}/${id}`)
}

/**
 * Create a new family member
 */
export async function createMember(
  member: Omit<FamilyMember, "id">
): Promise<ApiResponse<FamilyMember>> {
  const newMember: FamilyMember = {
    ...member,
    id: `member-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  }
  
  // In production: return apiFetch<FamilyMember>(MEMBERS_ENDPOINT, { method: "POST", body: JSON.stringify(member) })
  return mockResponse(newMember)
}

/**
 * Update an existing family member
 */
export async function updateMember(
  id: string,
  patch: Partial<FamilyMember>
): Promise<ApiResponse<FamilyMember>> {
  // In production: return apiFetch<FamilyMember>(`${MEMBERS_ENDPOINT}/${id}`, { method: "PATCH", body: JSON.stringify(patch) })
  return mockResponse({ id, ...patch } as FamilyMember)
}

/**
 * Delete a family member
 */
export async function deleteMember(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
  // In production: return apiFetch<{ deleted: boolean }>(`${MEMBERS_ENDPOINT}/${id}`, { method: "DELETE" })
  return mockResponse({ deleted: true })
}

/**
 * Get members by role
 */
export async function getMembersByRole(role: string): Promise<ApiResponse<FamilyMember[]>> {
  return apiFetch<FamilyMember[]>(`${MEMBERS_ENDPOINT}?role=${role}`)
}
