import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AvatarRenderer } from "./avatar-renderer"
import {
  type CharacterConfig,
  defaultCharacter,
  skinTones,
  eyeColors,
  hairColors,
  clothingColors,
  hairStyles,
  facialHairStyles,
  clothingStyles,
  faceShapes,
  eyeStyles,
  noseStyles,
  mouthStyles,
  clothingPatterns,
  loadSavedCharacters,
  saveCharacters,
} from "@/lib/character-types"
import { toast } from "sonner"
import {
  Save,
  RotateCcw,
  Trash2,
  User,
  Scissors,
  Shirt,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react"

interface CharacterEditorProps {
  onCharacterSaved?: (character: CharacterConfig) => void
}

export function CharacterEditor({ onCharacterSaved }: CharacterEditorProps) {
  const [savedCharacters, setSavedCharacters] = useState<CharacterConfig[]>(() => loadSavedCharacters())
  const [character, setCharacter] = useState<CharacterConfig>(() => {
    const saved = loadSavedCharacters()
    return saved[0] ?? { ...defaultCharacter, id: `char-${Date.now()}` }
  })
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    face: true,
    hair: true,
    clothing: true,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const updateCharacter = useCallback(<K extends keyof CharacterConfig>(key: K, value: CharacterConfig[K]) => {
    setCharacter((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleSave = () => {
    if (!character.name.trim()) {
      toast.error("Please enter a name for your character")
      return
    }

    const existing = savedCharacters.findIndex((c) => c.id === character.id)
    let updated: CharacterConfig[]
    if (existing >= 0) {
      updated = [...savedCharacters]
      updated[existing] = character
    } else {
      updated = [...savedCharacters, character]
    }
    saveCharacters(updated)
    setSavedCharacters(updated)
    toast.success(`"${character.name}" saved!`)
    onCharacterSaved?.(character)
  }

  const handleReset = () => {
    setCharacter({ ...defaultCharacter, id: character.id, name: character.name })
    toast("Reset to default appearance")
  }

  const handleDelete = (charToDelete: CharacterConfig) => {
    const updated = savedCharacters.filter((c) => c.id !== charToDelete.id)
    saveCharacters(updated)
    setSavedCharacters(updated)
    if (character.id === charToDelete.id && updated.length > 0) {
      setCharacter(updated[0])
    } else if (updated.length === 0) {
      setCharacter({ ...defaultCharacter, id: `char-${Date.now()}` })
    }
    toast.success(`"${charToDelete.name}" deleted`)
  }

  const handleNewCharacter = () => {
    setCharacter({ ...defaultCharacter, id: `char-${Date.now()}`, name: "New Character" })
  }

  const handleSelectCharacter = (char: CharacterConfig) => {
    setCharacter(char)
  }

  // Color picker component
  const ColorPicker = ({
    label,
    colors,
    value,
    onChange,
  }: {
    label: string
    colors: { value: string; label: string }[]
    value: string
    onChange: (color: string) => void
  }) => (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {colors.map((c) => (
          <button
            key={c.value}
            onClick={() => onChange(c.value)}
            className={`size-7 rounded-full border-2 transition-all ${
              value === c.value ? "border-primary scale-110" : "border-transparent hover:scale-105"
            }`}
            style={{ backgroundColor: c.value }}
            title={c.label}
          />
        ))}
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 size-7 cursor-pointer opacity-0"
          />
          <div
            className="flex size-7 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/50 text-muted-foreground hover:border-primary"
            title="Custom color"
          >
            <Plus className="size-3" />
          </div>
        </div>
      </div>
    </div>
  )

  // Option selector component
  const OptionSelector = <T extends string>({
    label,
    options,
    value,
    onChange,
  }: {
    label: string
    options: readonly { value: T; label: string }[]
    value: T
    onChange: (value: T) => void
  }) => (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              value === opt.value
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )

  // Section header component
  const SectionHeader = ({
    title,
    icon: Icon,
    section,
  }: {
    title: string
    icon: React.ElementType
    section: string
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex w-full items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
    >
      <Icon className="size-4" />
      {title}
      {expandedSections[section] ? (
        <ChevronDown className="ml-auto size-4" />
      ) : (
        <ChevronRight className="ml-auto size-4" />
      )}
    </button>
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Saved Characters Strip */}
      {savedCharacters.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Saved Characters</span>
            <button
              onClick={handleNewCharacter}
              className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              <Plus className="size-3" />
              New
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {savedCharacters.map((char) => (
              <button
                key={char.id}
                onClick={() => handleSelectCharacter(char)}
                className={`group relative flex-shrink-0 rounded-xl border p-2 transition-all ${
                  character.id === char.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/50"
                }`}
              >
                <AvatarRenderer character={char} size={60} />
                <span className="mt-1 block text-center text-[10px] text-muted-foreground truncate max-w-16">
                  {char.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(char)
                  }}
                  className="absolute -right-1 -top-1 hidden size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground group-hover:flex"
                >
                  <Trash2 className="size-3" />
                </button>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Preview */}
        <Card className="flex-shrink-0 lg:sticky lg:top-6 lg:self-start">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <div className="rounded-2xl bg-gradient-to-br from-muted/50 to-muted p-6">
              <AvatarRenderer character={character} size={180} />
            </div>
            <Input
              value={character.name}
              onChange={(e) => updateCharacter("name", e.target.value)}
              placeholder="Character name"
              className="text-center font-medium"
            />
            <div className="flex gap-2 w-full">
              <button
                onClick={handleReset}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
                Reset
              </button>
              <button
                onClick={handleSave}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Save className="size-3.5" />
                Save
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex flex-1 flex-col gap-4">
          {/* Face Section */}
          <Card>
            <CardContent className="flex flex-col gap-4 p-4">
              <SectionHeader title="Face" icon={User} section="face" />
              {expandedSections.face && (
                <div className="flex flex-col gap-4 pt-2">
                  <ColorPicker
                    label="Skin Tone"
                    colors={skinTones}
                    value={character.skinTone}
                    onChange={(c) => updateCharacter("skinTone", c)}
                  />
                  <OptionSelector
                    label="Face Shape"
                    options={faceShapes}
                    value={character.faceShape}
                    onChange={(v) => updateCharacter("faceShape", v)}
                  />
                  <OptionSelector
                    label="Eye Style"
                    options={eyeStyles}
                    value={character.eyeStyle}
                    onChange={(v) => updateCharacter("eyeStyle", v)}
                  />
                  <ColorPicker
                    label="Eye Color"
                    colors={eyeColors}
                    value={character.eyeColor}
                    onChange={(c) => updateCharacter("eyeColor", c)}
                  />
                  <OptionSelector
                    label="Nose"
                    options={noseStyles}
                    value={character.noseStyle}
                    onChange={(v) => updateCharacter("noseStyle", v)}
                  />
                  <OptionSelector
                    label="Mouth"
                    options={mouthStyles}
                    value={character.mouthStyle}
                    onChange={(v) => updateCharacter("mouthStyle", v)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hair Section */}
          <Card>
            <CardContent className="flex flex-col gap-4 p-4">
              <SectionHeader title="Hair" icon={Scissors} section="hair" />
              {expandedSections.hair && (
                <div className="flex flex-col gap-4 pt-2">
                  <OptionSelector
                    label="Hair Style"
                    options={hairStyles}
                    value={character.hairStyle}
                    onChange={(v) => updateCharacter("hairStyle", v)}
                  />
                  <ColorPicker
                    label="Hair Color"
                    colors={hairColors}
                    value={character.hairColor}
                    onChange={(c) => updateCharacter("hairColor", c)}
                  />
                  <OptionSelector
                    label="Facial Hair"
                    options={facialHairStyles}
                    value={character.facialHair}
                    onChange={(v) => updateCharacter("facialHair", v)}
                  />
                  {character.facialHair !== "none" && (
                    <ColorPicker
                      label="Facial Hair Color"
                      colors={hairColors}
                      value={character.facialHairColor}
                      onChange={(c) => updateCharacter("facialHairColor", c)}
                    />
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clothing Section */}
          <Card>
            <CardContent className="flex flex-col gap-4 p-4">
              <SectionHeader title="Clothing" icon={Shirt} section="clothing" />
              {expandedSections.clothing && (
                <div className="flex flex-col gap-4 pt-2">
                  <OptionSelector
                    label="Top Style"
                    options={clothingStyles}
                    value={character.clothingStyle}
                    onChange={(v) => updateCharacter("clothingStyle", v)}
                  />
                  <ColorPicker
                    label="Clothing Color"
                    colors={clothingColors}
                    value={character.clothingColor}
                    onChange={(c) => updateCharacter("clothingColor", c)}
                  />
                  <OptionSelector
                    label="Pattern"
                    options={clothingPatterns}
                    value={character.clothingPattern}
                    onChange={(v) => updateCharacter("clothingPattern", v)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
