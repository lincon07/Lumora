/**
 * API Layer Index
 * Re-exports all API modules for convenient imports
 * 
 * Usage:
 *   import { createEvent, getMembers, createMealPlan } from "@/api"
 *   
 *   // Or import specific modules:
 *   import * as eventsApi from "@/api/events"
 */

// Config and types
export { API_BASE_URL, apiFetch, mockResponse } from "./config"
export type { ApiResponse, PaginatedResponse } from "./config"

// Events API
export {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsInRange,
} from "./events"

// Calendars API
export {
  getCalendars,
  getCalendar,
  createCalendar,
  updateCalendar,
  deleteCalendar,
  toggleCalendarVisibility,
} from "./calendars"

// Members API
export {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  getMembersByRole,
} from "./members"

// Meals API
export {
  getMealPlans,
  getMealPlan,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
  getMealPlansByType,
  getMealPlansForDate,
} from "./meals"
export type { MealPlan } from "./meals"

// Auth API
export {
  getSetupState,
  saveSetupState,
  createAdminAccount,
  verifyAdminCredentials,
  setDeviceName,
  setPin,
  verifyPin,
  createPairingCode,
  completePairing,
  removePairing,
  resetDevice,
} from "./auth"
