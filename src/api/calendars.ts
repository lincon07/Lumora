/**
 * Calendars API
 * CRUD operations for calendar groups
 */

import { apiFetch, mockResponse, type ApiResponse } from "./config"
import type { CalendarGroup } from "@/lib/calendar-types"

// Endpoints
const CALENDARS_ENDPOINT = "/calendars"

/**
 * Get all calendars
 */
export async function getCalendars(): Promise<ApiResponse<CalendarGroup[]>> {
  return apiFetch<CalendarGroup[]>(CALENDARS_ENDPOINT)
}

/**
 * Get a single calendar by ID
 */
export async function getCalendar(id: string): Promise<ApiResponse<CalendarGroup>> {
  return apiFetch<CalendarGroup>(`${CALENDARS_ENDPOINT}/${id}`)
}

/**
 * Create a new calendar
 */
export async function createCalendar(
  calendar: Omit<CalendarGroup, "id">
): Promise<ApiResponse<CalendarGroup>> {
  const newCalendar: CalendarGroup = {
    ...calendar,
    id: `cal-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  }
  
  // In production: return apiFetch<CalendarGroup>(CALENDARS_ENDPOINT, { method: "POST", body: JSON.stringify(calendar) })
  return mockResponse(newCalendar)
}

/**
 * Update an existing calendar
 */
export async function updateCalendar(
  id: string,
  patch: Partial<CalendarGroup>
): Promise<ApiResponse<CalendarGroup>> {
  // In production: return apiFetch<CalendarGroup>(`${CALENDARS_ENDPOINT}/${id}`, { method: "PATCH", body: JSON.stringify(patch) })
  return mockResponse({ id, ...patch } as CalendarGroup)
}

/**
 * Delete a calendar
 */
export async function deleteCalendar(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
  // In production: return apiFetch<{ deleted: boolean }>(`${CALENDARS_ENDPOINT}/${id}`, { method: "DELETE" })
  return mockResponse({ deleted: true })
}

/**
 * Toggle calendar visibility (local state, not persisted to server)
 */
export async function toggleCalendarVisibility(
  id: string,
  visible: boolean
): Promise<ApiResponse<CalendarGroup>> {
  return mockResponse({ id, visible } as CalendarGroup)
}
