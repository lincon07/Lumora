/**
 * Meal Planning API
 * CRUD operations for meal plans
 */

import { apiFetch, mockResponse, type ApiResponse } from "./config"

// Types
export interface MealPlan {
  id: string
  name: string
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack"
  description: string
  memberIds: string[]
  color: string
  scheduledDays?: string[] // ISO date strings
}

// Endpoints
const MEALS_ENDPOINT = "/meals"

/**
 * Get all meal plans
 */
export async function getMealPlans(): Promise<ApiResponse<MealPlan[]>> {
  return apiFetch<MealPlan[]>(MEALS_ENDPOINT)
}

/**
 * Get a single meal plan by ID
 */
export async function getMealPlan(id: string): Promise<ApiResponse<MealPlan>> {
  return apiFetch<MealPlan>(`${MEALS_ENDPOINT}/${id}`)
}

/**
 * Create a new meal plan
 */
export async function createMealPlan(
  meal: Omit<MealPlan, "id">
): Promise<ApiResponse<MealPlan>> {
  const newMeal: MealPlan = {
    ...meal,
    id: `meal-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  }
  
  // In production: return apiFetch<MealPlan>(MEALS_ENDPOINT, { method: "POST", body: JSON.stringify(meal) })
  return mockResponse(newMeal)
}

/**
 * Update an existing meal plan
 */
export async function updateMealPlan(
  id: string,
  patch: Partial<MealPlan>
): Promise<ApiResponse<MealPlan>> {
  // In production: return apiFetch<MealPlan>(`${MEALS_ENDPOINT}/${id}`, { method: "PATCH", body: JSON.stringify(patch) })
  return mockResponse({ id, ...patch } as MealPlan)
}

/**
 * Delete a meal plan
 */
export async function deleteMealPlan(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
  // In production: return apiFetch<{ deleted: boolean }>(`${MEALS_ENDPOINT}/${id}`, { method: "DELETE" })
  return mockResponse({ deleted: true })
}

/**
 * Get meal plans by type
 */
export async function getMealPlansByType(type: MealPlan["type"]): Promise<ApiResponse<MealPlan[]>> {
  return apiFetch<MealPlan[]>(`${MEALS_ENDPOINT}?type=${type}`)
}

/**
 * Get meal plans for a specific date
 */
export async function getMealPlansForDate(date: Date): Promise<ApiResponse<MealPlan[]>> {
  return apiFetch<MealPlan[]>(`${MEALS_ENDPOINT}?date=${date.toISOString().split("T")[0]}`)
}
