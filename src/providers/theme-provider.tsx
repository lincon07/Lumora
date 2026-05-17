import { createContext, useContext, useEffect, useState, useCallback } from "react"
import {
  colorThemes,
  loadCustomThemes,
  saveCustomThemes,
  type ColorTheme,
} from "@/lib/color-themes"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  colorThemeStorageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  colorTheme: ColorTheme
  setColorTheme: (themeId: string) => void
  customThemes: ColorTheme[]
  addCustomTheme: (theme: ColorTheme) => void
  updateCustomTheme: (theme: ColorTheme) => void
  deleteCustomTheme: (themeId: string) => void
  allThemes: ColorTheme[]
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  colorTheme: colorThemes[0],
  setColorTheme: () => null,
  customThemes: [],
  addCustomTheme: () => null,
  updateCustomTheme: () => null,
  deleteCustomTheme: () => null,
  allThemes: colorThemes,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

function getResolvedTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  }
  return theme
}

function applyColorTheme(colorTheme: ColorTheme, resolvedTheme: "light" | "dark") {
  const root = document.documentElement
  const vars = resolvedTheme === "dark" ? colorTheme.dark : colorTheme.light
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value)
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  colorThemeStorageKey = "lumora-color-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  const [customThemes, setCustomThemesState] = useState<ColorTheme[]>(() =>
    loadCustomThemes()
  )

  const allThemes = [...colorThemes, ...customThemes]

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    const savedId = localStorage.getItem(colorThemeStorageKey)
    const all = [...colorThemes, ...loadCustomThemes()]
    return all.find((t) => t.id === savedId) ?? colorThemes[0]
  })

  // Apply dark/light class
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    const resolved = getResolvedTheme(theme)
    root.classList.add(resolved)
  }, [theme])

  // Apply color theme variables whenever theme or colorTheme changes
  useEffect(() => {
    const resolved = getResolvedTheme(theme)
    applyColorTheme(colorTheme, resolved)
  }, [theme, colorTheme])

  const setTheme = useCallback(
    (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setThemeState(newTheme)
    },
    [storageKey]
  )

  const setColorTheme = useCallback(
    (themeId: string) => {
      const all = [...colorThemes, ...customThemes]
      const found = all.find((t) => t.id === themeId)
      if (found) {
        localStorage.setItem(colorThemeStorageKey, themeId)
        setColorThemeState(found)
      }
    },
    [colorThemeStorageKey, customThemes]
  )

  const addCustomTheme = useCallback((newTheme: ColorTheme) => {
    setCustomThemesState((prev) => {
      const updated = [...prev, newTheme]
      saveCustomThemes(updated)
      return updated
    })
  }, [])

  const updateCustomTheme = useCallback(
    (updatedTheme: ColorTheme) => {
      setCustomThemesState((prev) => {
        const updated = prev.map((t) =>
          t.id === updatedTheme.id ? updatedTheme : t
        )
        saveCustomThemes(updated)
        return updated
      })
      // If the currently active theme is being updated, reapply it
      if (colorTheme.id === updatedTheme.id) {
        setColorThemeState(updatedTheme)
      }
    },
    [colorTheme.id]
  )

  const deleteCustomTheme = useCallback(
    (themeId: string) => {
      setCustomThemesState((prev) => {
        const updated = prev.filter((t) => t.id !== themeId)
        saveCustomThemes(updated)
        return updated
      })
      // If deleting the active theme, switch back to default
      if (colorTheme.id === themeId) {
        localStorage.setItem(colorThemeStorageKey, "default")
        setColorThemeState(colorThemes[0])
      }
    },
    [colorTheme.id, colorThemeStorageKey]
  )

  const value = {
    theme,
    setTheme,
    colorTheme,
    setColorTheme,
    customThemes,
    addCustomTheme,
    updateCustomTheme,
    deleteCustomTheme,
    allThemes,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
