// Character customization types

export interface CharacterConfig {
  id: string
  name: string
  // Face
  skinTone: string
  faceShape: "round" | "oval" | "square" | "heart"
  eyeStyle: "normal" | "wide" | "narrow" | "happy"
  eyeColor: string
  noseStyle: "small" | "medium" | "large" | "button"
  mouthStyle: "smile" | "neutral" | "smirk" | "open"
  // Hair
  hairStyle: "none" | "short" | "medium" | "long" | "curly" | "spiky" | "ponytail" | "bun"
  hairColor: string
  // Facial hair
  facialHair: "none" | "stubble" | "mustache" | "goatee" | "beard" | "fullBeard"
  facialHairColor: string
  // Clothes
  clothingStyle: "tshirt" | "sweater" | "jacket" | "hoodie" | "polo" | "tank"
  clothingColor: string
  clothingPattern: "solid" | "stripes" | "dots"
}

export const defaultCharacter: CharacterConfig = {
  id: "default",
  name: "My Character",
  skinTone: "#F5D0B0",
  faceShape: "round",
  eyeStyle: "normal",
  eyeColor: "#4A3728",
  noseStyle: "medium",
  mouthStyle: "smile",
  hairStyle: "short",
  hairColor: "#3D2314",
  facialHair: "none",
  facialHairColor: "#3D2314",
  clothingStyle: "tshirt",
  clothingColor: "#3B82F6",
  clothingPattern: "solid",
}

// Color palettes
export const skinTones = [
  { value: "#FFDFC4", label: "Light" },
  { value: "#F5D0B0", label: "Fair" },
  { value: "#D4A574", label: "Medium" },
  { value: "#C68642", label: "Tan" },
  { value: "#8D5524", label: "Brown" },
  { value: "#5C3A21", label: "Dark" },
]

export const eyeColors = [
  { value: "#4A3728", label: "Brown" },
  { value: "#1E90FF", label: "Blue" },
  { value: "#228B22", label: "Green" },
  { value: "#808080", label: "Gray" },
  { value: "#8B4513", label: "Hazel" },
  { value: "#000000", label: "Black" },
]

export const hairColors = [
  { value: "#3D2314", label: "Dark Brown" },
  { value: "#1A1A1A", label: "Black" },
  { value: "#6B4423", label: "Brown" },
  { value: "#B8860B", label: "Golden" },
  { value: "#FFD700", label: "Blonde" },
  { value: "#C04000", label: "Auburn" },
  { value: "#FF4500", label: "Red" },
  { value: "#808080", label: "Gray" },
  { value: "#FFFFFF", label: "White" },
  { value: "#FF69B4", label: "Pink" },
  { value: "#8A2BE2", label: "Purple" },
  { value: "#00CED1", label: "Teal" },
]

export const clothingColors = [
  { value: "#3B82F6", label: "Blue" },
  { value: "#EF4444", label: "Red" },
  { value: "#22C55E", label: "Green" },
  { value: "#F59E0B", label: "Orange" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#EC4899", label: "Pink" },
  { value: "#1A1A1A", label: "Black" },
  { value: "#FFFFFF", label: "White" },
  { value: "#6B7280", label: "Gray" },
  { value: "#92400E", label: "Brown" },
  { value: "#0891B2", label: "Cyan" },
  { value: "#84CC16", label: "Lime" },
]

export const hairStyles = [
  { value: "none", label: "Bald" },
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
  { value: "curly", label: "Curly" },
  { value: "spiky", label: "Spiky" },
  { value: "ponytail", label: "Ponytail" },
  { value: "bun", label: "Bun" },
] as const

export const facialHairStyles = [
  { value: "none", label: "None" },
  { value: "stubble", label: "Stubble" },
  { value: "mustache", label: "Mustache" },
  { value: "goatee", label: "Goatee" },
  { value: "beard", label: "Beard" },
  { value: "fullBeard", label: "Full Beard" },
] as const

export const clothingStyles = [
  { value: "tshirt", label: "T-Shirt" },
  { value: "sweater", label: "Sweater" },
  { value: "jacket", label: "Jacket" },
  { value: "hoodie", label: "Hoodie" },
  { value: "polo", label: "Polo" },
  { value: "tank", label: "Tank Top" },
] as const

export const faceShapes = [
  { value: "round", label: "Round" },
  { value: "oval", label: "Oval" },
  { value: "square", label: "Square" },
  { value: "heart", label: "Heart" },
] as const

export const eyeStyles = [
  { value: "normal", label: "Normal" },
  { value: "wide", label: "Wide" },
  { value: "narrow", label: "Narrow" },
  { value: "happy", label: "Happy" },
] as const

export const noseStyles = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "button", label: "Button" },
] as const

export const mouthStyles = [
  { value: "smile", label: "Smile" },
  { value: "neutral", label: "Neutral" },
  { value: "smirk", label: "Smirk" },
  { value: "open", label: "Open" },
] as const

export const clothingPatterns = [
  { value: "solid", label: "Solid" },
  { value: "stripes", label: "Stripes" },
  { value: "dots", label: "Dots" },
] as const

const CHARACTERS_KEY = "lumora-custom-characters"

export function loadSavedCharacters(): CharacterConfig[] {
  try {
    const stored = localStorage.getItem(CHARACTERS_KEY)
    if (!stored) return []
    return JSON.parse(stored) as CharacterConfig[]
  } catch {
    return []
  }
}

export function saveCharacters(characters: CharacterConfig[]) {
  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters))
}
