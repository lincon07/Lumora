import { useLocation } from "react-router-dom"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { useTheme } from "@/providers/theme-provider"
import { useBrightness } from "@/hooks/use-brightness"
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  SquareCheckBig,
  UtensilsCrossed,
  Settings,
  Sun,
  Moon,
  Lightbulb,
} from "lucide-react"

const routeMeta: Record<string, { title: string; icon: React.ElementType }> = {
  "/dashboard": { title: "Dashboard", icon: LayoutDashboard },
  "/calendar": { title: "Calendar", icon: CalendarDays },
  "/users": { title: "Users", icon: Users },
  "/todos": { title: "Todos", icon: SquareCheckBig },
  "/meal-planning": { title: "Meal Planning", icon: UtensilsCrossed },
  "/settings": { title: "Settings", icon: Settings },
}

export function AppHeader() {
  const { pathname } = useLocation()
  const { theme, setTheme } = useTheme()
  const { brightness, setBrightness } = useBrightness()
  const meta = routeMeta[pathname] ?? { title: "Lumora", icon: LayoutDashboard }
  const Icon = meta.icon

  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/50 px-6">
      <div className="flex items-center gap-3">
        <Icon className="size-5 text-muted-foreground" />
        <h1 className="text-lg font-semibold text-foreground">{meta.title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Brightness Control */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Brightness control"
            >
              <Lightbulb className="size-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-4" align="end">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Brightness</label>
                <span className="text-xs text-muted-foreground">{brightness}%</span>
              </div>
              <Slider
                value={[brightness]}
                onValueChange={(value) => setBrightness(value[0])}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </PopoverContent>
        </Popover>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        >
          {resolvedTheme === "dark" ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
        </button>
      </div>
    </header>
  )
}
