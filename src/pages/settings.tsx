import { useState } from "react"
import { useTheme } from "@/providers/theme-provider"
import { useBrightness } from "@/hooks/use-brightness"
import { colorThemes } from "@/lib/color-themes"
import type { ColorTheme } from "@/lib/color-themes"
import { createBlankCustomTheme } from "@/lib/color-themes"
import { ThemeEditor } from "@/components/settings/theme-editor"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import {
  Check,
  Palette,
  Sun,
  Moon,
  Monitor,
  Plus,
  Pencil,
  Trash2,
  Lightbulb,
} from "lucide-react"

export default function SettingsPage() {
  const {
    theme,
    setTheme,
    colorTheme,
    setColorTheme,
    allThemes,
    deleteCustomTheme,
  } = useTheme()
  const { brightness, setBrightness } = useBrightness()

  const [editingTheme, setEditingTheme] = useState<ColorTheme | null>(null)

  const handleCreateNew = () => {
    const base = colorTheme ?? colorThemes[0]
    setEditingTheme(createBlankCustomTheme(base))
  }

  const handleEditCustom = (ct: ColorTheme) => {
    setEditingTheme(ct)
  }

  const handleDeleteCustom = (ct: ColorTheme) => {
    deleteCustomTheme(ct.id)
    toast.success(`"${ct.name}" deleted`)
  }

  const handleSelectTheme = (ct: ColorTheme) => {
    setColorTheme(ct.id)
    toast.success(`Switched to "${ct.name}"`)
  }

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
              onClick={() => {
                setTheme(value)
                toast.success(`Switched to ${label} mode`)
              }}
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

      {/* Brightness Control */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Lightbulb className="size-5 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Display Brightness</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Adjust your display brightness level
        </p>
        <div className="flex items-center gap-4">
          <Slider
            value={[brightness]}
            onValueChange={(value) => setBrightness(value[0])}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-sm font-medium text-foreground min-w-12 text-right">
            {brightness}%
          </span>
        </div>
      </section>

      {/* Color Theme Picker */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-foreground">Color Theme</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pick a color palette or create your own custom theme.
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="size-3.5" />
            Create Custom
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {allThemes.map((ct) => {
            const isActive = colorTheme.id === ct.id
            return (
              <button
                key={ct.id}
                onClick={() => handleSelectTheme(ct)}
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
                    {ct.isCustom && (
                      <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">
                        (custom)
                      </span>
                    )}
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

                {/* Custom theme actions */}
                {ct.isCustom && (
                  <div className="absolute right-3 bottom-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditCustom(ct)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.stopPropagation()
                          handleEditCustom(ct)
                        }
                      }}
                      className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`Edit ${ct.name}`}
                    >
                      <Pencil className="size-3" />
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCustom(ct)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.stopPropagation()
                          handleDeleteCustom(ct)
                        }
                      }}
                      className="flex size-7 items-center justify-center rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      aria-label={`Delete ${ct.name}`}
                    >
                      <Trash2 className="size-3" />
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* Theme Editor */}
      {editingTheme && (
        <section className="flex flex-col gap-3">
          <ThemeEditor
            editingTheme={editingTheme}
            onClose={() => setEditingTheme(null)}
          />
        </section>
      )}
    </div>
  )
}
