import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  editableColorKeys,
  fontOptions,
  radiusOptions,
  createBlankCustomTheme,
  colorThemes,
  type ColorTheme,
} from "@/lib/color-themes"
import { useTheme } from "@/providers/theme-provider"
import { toast } from "sonner"
import { X, Save, RotateCcw } from "lucide-react"

/** Convert oklch(...) to a hex string for the color picker */
function oklchToHex(oklchStr: string): string {
  try {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext("2d")
    if (!ctx) return "#000000"
    ctx.fillStyle = oklchStr
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  } catch {
    return "#000000"
  }
}

interface ThemeEditorProps {
  editingTheme: ColorTheme
  onClose: () => void
}

export function ThemeEditor({ editingTheme, onClose }: ThemeEditorProps) {
  const { addCustomTheme, updateCustomTheme, setColorTheme, theme } = useTheme()
  const [draft, setDraft] = useState<ColorTheme>(() => ({
    ...editingTheme,
    light: { ...editingTheme.light },
    dark: { ...editingTheme.dark },
    preview: { ...editingTheme.preview },
  }))

  const resolvedMode =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme

  const currentVars = resolvedMode === "dark" ? draft.dark : draft.light

  const updateColor = useCallback(
    (key: string, hex: string) => {
      setDraft((prev) => {
        const next = { ...prev }
        next.light = { ...prev.light, [key]: hex }
        next.dark = { ...prev.dark, [key]: hex }

        // Update preview swatches
        if (key === "--primary") next.preview = { ...next.preview, primary: hex }
        if (key === "--secondary") next.preview = { ...next.preview, secondary: hex }
        if (key === "--accent") next.preview = { ...next.preview, accent: hex }
        if (key === "--background") next.preview = { ...next.preview, background: hex }

        return next
      })
    },
    []
  )

  const updateFont = useCallback((fontVar: string, value: string) => {
    setDraft((prev) => ({
      ...prev,
      light: { ...prev.light, [fontVar]: value },
      dark: { ...prev.dark, [fontVar]: value },
    }))
  }, [])

  const updateRadius = useCallback((value: string) => {
    setDraft((prev) => ({
      ...prev,
      light: { ...prev.light, "--radius": value },
      dark: { ...prev.dark, "--radius": value },
    }))
  }, [])

  const handleSave = () => {
    if (!draft.name.trim()) {
      toast.error("Theme name is required")
      return
    }

    if (editingTheme.isCustom) {
      updateCustomTheme(draft)
      setColorTheme(draft.id)
      toast.success(`"${draft.name}" updated`)
    } else {
      const newTheme = {
        ...draft,
        id: `custom-${Date.now()}`,
        isCustom: true,
      }
      addCustomTheme(newTheme)
      setColorTheme(newTheme.id)
      toast.success(`"${newTheme.name}" saved`)
    }
    onClose()
  }

  const handleReset = () => {
    const base = editingTheme.isCustom ? colorThemes[0] : editingTheme
    setDraft({
      ...draft,
      light: { ...base.light },
      dark: { ...base.dark },
      preview: { ...base.preview },
    })
    toast("Reset to base theme colors")
  }

  return (
    <Card className="border-primary/30 bg-card">
      <CardContent className="flex flex-col gap-5 p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            {editingTheme.isCustom ? "Edit Theme" : "Create Custom Theme"}
          </h3>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close editor"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Name + Description */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-medium text-muted-foreground">
              Theme Name
            </label>
            <Input
              value={draft.name}
              onChange={(e) =>
                setDraft((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="My Theme"
              className="h-9"
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-medium text-muted-foreground">
              Description
            </label>
            <Input
              value={draft.description}
              onChange={(e) =>
                setDraft((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="A short description"
              className="h-9"
            />
          </div>
        </div>

        {/* Colors Section */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-medium text-foreground">Colors</h4>
          <p className="text-xs text-muted-foreground">
            {"Pick colors for your theme. Changes apply to both light and dark modes."}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {editableColorKeys.map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center gap-2 rounded-lg border border-border/50 p-2"
              >
                <div className="relative">
                  <input
                    type="color"
                    value={oklchToHex(currentVars[key] || "#000000")}
                    onChange={(e) => updateColor(key, e.target.value)}
                    className="size-8 cursor-pointer rounded-md border border-border/50 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-none"
                  />
                </div>
                <span className="text-xs text-muted-foreground truncate">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Typography Section */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-medium text-foreground">Typography</h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Sans Font
              </label>
              <select
                value={currentVars["--font-sans"] || "Open Sans, sans-serif"}
                onChange={(e) => updateFont("--font-sans", e.target.value)}
                className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {fontOptions.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Mono Font
              </label>
              <select
                value={currentVars["--font-mono"] || "Menlo, monospace"}
                onChange={(e) => updateFont("--font-mono", e.target.value)}
                className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {fontOptions.filter((f) => f.label.includes("Mono") || f.label === "System").map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
                <option value="'Fira Code', monospace">Fira Code</option>
                <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                <option value="Menlo, monospace">Menlo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Radius Section */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-medium text-foreground">Border Radius</h4>
          <div className="flex flex-wrap gap-2">
            {radiusOptions.map((r) => (
              <button
                key={r.value}
                onClick={() => updateRadius(r.value)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  (currentVars["--radius"] || "1.3rem") === r.value
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span
                  className="size-4 border-2 border-current"
                  style={{ borderRadius: r.value }}
                />
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-medium text-foreground">Preview</h4>
          <div
            className="flex items-center gap-3 rounded-xl border p-4"
            style={{ background: currentVars["--background"] || undefined }}
          >
            {[
              { key: "--primary", label: "P" },
              { key: "--secondary", label: "S" },
              { key: "--accent", label: "A" },
              { key: "--muted", label: "M" },
              { key: "--destructive", label: "D" },
            ].map(({ key, label }) => (
              <div key={key} className="flex flex-col items-center gap-1">
                <span
                  className="size-10 rounded-lg border border-border/30"
                  style={{ background: currentVars[key] || undefined }}
                />
                <span className="text-[10px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Save className="size-3.5" />
            {editingTheme.isCustom ? "Update Theme" : "Save as Custom"}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
