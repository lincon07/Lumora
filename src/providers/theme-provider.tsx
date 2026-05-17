import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { colorThemes, type ColorTheme } from "@/lib/color-themes"

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
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  colorTheme: colorThemes[0],
  setColorTheme: () => null,
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

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    const savedId = localStorage.getItem(colorThemeStorageKey)
    return colorThemes.find((t) => t.id === savedId) ?? colorThemes[0]
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
      const found = colorThemes.find((t) => t.id === themeId)
      if (found) {
        localStorage.setItem(colorThemeStorageKey, themeId)
        setColorThemeState(found)
      }
    },
    [colorThemeStorageKey]
  )

  const value = {
    theme,
    setTheme,
    colorTheme,
    setColorTheme,
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
