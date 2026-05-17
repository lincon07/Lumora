/**
 * Calendar Events API
 * CRUD operations for calendar events
 */

import { apiFetch, mockResponse, type ApiResponse } from "./config"
import type { CalendarEvent } from "@/lib/calendar-types"

// Endpoints
const EVENTS_ENDPOINT = "/events"

/**
 * Get all events
 */
export async function getEvents(): Promise<ApiResponse<CalendarEvent[]>> {
  return apiFetch<CalendarEvent[]>(EVENTS_ENDPOINT)
}

/**
 * Get a single event by ID
 */
export async function getEvent(id: string): Promise<ApiResponse<CalendarEvent>> {
  return apiFetch<CalendarEvent>(`${EVENTS_ENDPOINT}/${id}`)
}

/**
 * Create a new event
 */
export async function createEvent(
  event: Omit<CalendarEvent, "id">
): Promise<ApiResponse<CalendarEvent>> {
  const newEvent: CalendarEvent = {
    ...event,
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  }
  
  // In production: return apiFetch<CalendarEvent>(EVENTS_ENDPOINT, { method: "POST", body: JSON.stringify(event) })
  return mockResponse(newEvent)
}

/**
 * Update an existing event
 */
export async function updateEvent(
  id: string,
  patch: Partial<CalendarEvent>
): Promise<ApiResponse<CalendarEvent>> {
  // In production: return apiFetch<CalendarEvent>(`${EVENTS_ENDPOINT}/${id}`, { method: "PATCH", body: JSON.stringify(patch) })
  return mockResponse({ id, ...patch } as CalendarEvent)
}

/**
 * Delete an event
 */
export async function deleteEvent(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
  // In production: return apiFetch<{ deleted: boolean }>(`${EVENTS_ENDPOINT}/${id}`, { method: "DELETE" })
  return mockResponse({ deleted: true })
}

/**
 * Get events for a specific date range
 */
export async function getEventsInRange(
  startDate: Date,
  endDate: Date
): Promise<ApiResponse<CalendarEvent[]>> {
  const params = new URLSearchParams({
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  })
  return apiFetch<CalendarEvent[]>(`${EVENTS_ENDPOINT}?${params}`)
}
