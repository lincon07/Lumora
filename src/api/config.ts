/**
 * API Configuration
 * Base URL and common settings for all API calls
 */

// In production, this would point to your actual API server
// For Tauri, this could be a local server or invoke Tauri commands
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api"

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  pageSize: number
}

/**
 * Generic fetch wrapper with error handling
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }))
      return { success: false, error: error.message || `HTTP ${response.status}` }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    // For development/demo mode, return mock success
    // In production, you'd want to handle this differently
    console.warn(`[API] Request to ${endpoint} failed, using offline mode`)
    return { success: false, error: "Network error - working offline" }
  }
}

/**
 * Helper for mock/offline responses during development
 */
export function mockResponse<T>(data: T, delay = 100): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, data }), delay)
  })
}
