import { useTheme } from "@/providers/theme-provider"
import { colorThemes } from "@/lib/color-themes"
import { Check, Palette, Sun, Moon, Monitor } from "lucide-react"

export default function SettingsPage() {
  const { theme, setTheme, colorTheme, setColorTheme } = useTheme()

  return (
    <div className="flex flex-col gap-8 p-6 max-w-3xl">
      {/* Appearance Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Palette className="size-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Customize how Lumora looks. Choose your preferred mode and color theme.
        </p>
      </section>

      {/* Light / Dark / System Toggle */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-foreground">Mode</h3>
        <div className="flex gap-2">
          {([
            { value: "light" as const, label: "Light", icon: Sun },
            { value: "dark" as const, label: "Dark", icon: Moon },
            { value: "system" as const, label: "System", icon: Monitor },
          ]).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                theme === value
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Color Theme Picker */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-foreground">Color Theme</h3>
        <p className="text-xs text-muted-foreground">
          Pick a color palette. Themes adapt to your light/dark mode choice.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {colorThemes.map((ct) => {
            const isActive = colorTheme.id === ct.id
            return (
              <button
                key={ct.id}
                onClick={() => setColorTheme(ct.id)}
                className={`group relative flex flex-col gap-3 rounded-xl border p-4 text-left transition-all ${
                  isActive
                    ? "border-primary ring-2 ring-primary/20 bg-card"
                    : "border-border bg-card hover:border-muted-foreground/30"
                }`}
              >
                {/* Color preview swatches */}
                <div className="flex gap-1.5">
                  <span
                    className="size-6 rounded-full border border-border/50"
                    style={{ background: ct.preview.primary }}
                  />
                  <span
                    className="size-6 rounded-full border border-border/50"
                    style={{ background: ct.preview.secondary }}
                  />
                  <span
                    className="size-6 rounded-full border border-border/50"
                    style={{ background: ct.preview.accent }}
                  />
                  <span
                    className="size-6 rounded-full border border-border/50"
                    style={{ background: ct.preview.background }}
                  />
                </div>

                {/* Theme info */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">
                    {ct.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {ct.description}
                  </span>
                </div>

                {/* Check indicator */}
                {isActive && (
                  <div className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary">
                    <Check className="size-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
