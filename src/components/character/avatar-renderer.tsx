import type { CharacterConfig } from "@/lib/character-types"

interface AvatarRendererProps {
  character: CharacterConfig
  size?: number
  className?: string
}

export function AvatarRenderer({ character, size = 200, className = "" }: AvatarRendererProps) {
  const {
    skinTone,
    faceShape,
    eyeStyle,
    eyeColor,
    noseStyle,
    mouthStyle,
    hairStyle,
    hairColor,
    facialHair,
    facialHairColor,
    clothingStyle,
    clothingColor,
    clothingPattern,
  } = character

  // Face shape paths
  const faceShapePaths: Record<string, string> = {
    round: "M100,40 C145,40 175,70 175,120 C175,170 145,195 100,195 C55,195 25,170 25,120 C25,70 55,40 100,40",
    oval: "M100,35 C150,35 170,75 170,120 C170,175 145,200 100,200 C55,200 30,175 30,120 C30,75 50,35 100,35",
    square: "M100,40 C155,40 175,60 175,115 C175,175 155,195 100,195 C45,195 25,175 25,115 C25,60 45,40 100,40",
    heart: "M100,40 C155,40 175,70 175,110 C175,165 140,195 100,195 C60,195 25,165 25,110 C25,70 45,40 100,40",
  }

  // Eyes based on style
  const renderEyes = () => {
    const eyeY = 105
    const leftEyeX = 70
    const rightEyeX = 130

    switch (eyeStyle) {
      case "wide":
        return (
          <>
            <ellipse cx={leftEyeX} cy={eyeY} rx="14" ry="12" fill="white" stroke="#333" strokeWidth="1.5" />
            <ellipse cx={rightEyeX} cy={eyeY} rx="14" ry="12" fill="white" stroke="#333" strokeWidth="1.5" />
            <circle cx={leftEyeX} cy={eyeY + 1} r="7" fill={eyeColor} />
            <circle cx={rightEyeX} cy={eyeY + 1} r="7" fill={eyeColor} />
            <circle cx={leftEyeX + 2} cy={eyeY - 1} r="2.5" fill="white" />
            <circle cx={rightEyeX + 2} cy={eyeY - 1} r="2.5" fill="white" />
          </>
        )
      case "narrow":
        return (
          <>
            <ellipse cx={leftEyeX} cy={eyeY} rx="12" ry="6" fill="white" stroke="#333" strokeWidth="1.5" />
            <ellipse cx={rightEyeX} cy={eyeY} rx="12" ry="6" fill="white" stroke="#333" strokeWidth="1.5" />
            <ellipse cx={leftEyeX} cy={eyeY} rx="5" ry="5" fill={eyeColor} />
            <ellipse cx={rightEyeX} cy={eyeY} rx="5" ry="5" fill={eyeColor} />
            <circle cx={leftEyeX + 1.5} cy={eyeY - 1} r="1.5" fill="white" />
            <circle cx={rightEyeX + 1.5} cy={eyeY - 1} r="1.5" fill="white" />
          </>
        )
      case "happy":
        return (
          <>
            <path d={`M${leftEyeX - 12},${eyeY + 3} Q${leftEyeX},${eyeY - 10} ${leftEyeX + 12},${eyeY + 3}`} fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
            <path d={`M${rightEyeX - 12},${eyeY + 3} Q${rightEyeX},${eyeY - 10} ${rightEyeX + 12},${eyeY + 3}`} fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          </>
        )
      default: // normal
        return (
          <>
            <ellipse cx={leftEyeX} cy={eyeY} rx="12" ry="10" fill="white" stroke="#333" strokeWidth="1.5" />
            <ellipse cx={rightEyeX} cy={eyeY} rx="12" ry="10" fill="white" stroke="#333" strokeWidth="1.5" />
            <circle cx={leftEyeX} cy={eyeY + 1} r="6" fill={eyeColor} />
            <circle cx={rightEyeX} cy={eyeY + 1} r="6" fill={eyeColor} />
            <circle cx={leftEyeX + 2} cy={eyeY - 1} r="2" fill="white" />
            <circle cx={rightEyeX + 2} cy={eyeY - 1} r="2" fill="white" />
          </>
        )
    }
  }

  // Eyebrows
  const renderEyebrows = () => (
    <>
      <path d="M55,85 Q70,78 85,85" fill="none" stroke={hairColor} strokeWidth="3" strokeLinecap="round" />
      <path d="M115,85 Q130,78 145,85" fill="none" stroke={hairColor} strokeWidth="3" strokeLinecap="round" />
    </>
  )

  // Nose based on style
  const renderNose = () => {
    const noseY = 130
    switch (noseStyle) {
      case "small":
        return <path d="M100,120 L97,132 Q100,136 103,132 Z" fill={adjustColor(skinTone, -15)} />
      case "large":
        return <path d="M100,115 L93,138 Q100,145 107,138 Z" fill={adjustColor(skinTone, -15)} />
      case "button":
        return <circle cx="100" cy={noseY} r="8" fill={adjustColor(skinTone, -15)} />
      default: // medium
        return <path d="M100,118 L95,135 Q100,140 105,135 Z" fill={adjustColor(skinTone, -15)} />
    }
  }

  // Mouth based on style
  const renderMouth = () => {
    const mouthY = 155
    switch (mouthStyle) {
      case "smile":
        return (
          <>
            <path d={`M75,${mouthY} Q100,${mouthY + 20} 125,${mouthY}`} fill="none" stroke="#B85450" strokeWidth="4" strokeLinecap="round" />
          </>
        )
      case "neutral":
        return <line x1="80" y1={mouthY + 5} x2="120" y2={mouthY + 5} stroke="#B85450" strokeWidth="4" strokeLinecap="round" />
      case "smirk":
        return <path d={`M80,${mouthY + 5} Q100,${mouthY + 8} 125,${mouthY - 2}`} fill="none" stroke="#B85450" strokeWidth="4" strokeLinecap="round" />
      case "open":
        return (
          <>
            <ellipse cx="100" cy={mouthY + 8} rx="18" ry="12" fill="#8B0000" />
            <ellipse cx="100" cy={mouthY + 14} rx="12" ry="6" fill="#FF6B6B" />
          </>
        )
      default:
        return <path d={`M75,${mouthY} Q100,${mouthY + 15} 125,${mouthY}`} fill="none" stroke="#B85450" strokeWidth="3" strokeLinecap="round" />
    }
  }

  // Hair styles
  const renderHair = () => {
    switch (hairStyle) {
      case "none":
        return null
      case "short":
        return (
          <path d="M35,100 Q35,45 100,40 Q165,45 165,100 Q160,65 100,55 Q40,65 35,100" fill={hairColor} />
        )
      case "medium":
        return (
          <>
            <path d="M30,110 Q25,45 100,35 Q175,45 170,110 Q165,60 100,50 Q35,60 30,110" fill={hairColor} />
            <path d="M30,110 Q25,130 35,150" fill={hairColor} stroke={hairColor} strokeWidth="8" />
            <path d="M170,110 Q175,130 165,150" fill={hairColor} stroke={hairColor} strokeWidth="8" />
          </>
        )
      case "long":
        return (
          <>
            <path d="M25,120 Q20,40 100,30 Q180,40 175,120 Q170,55 100,45 Q30,55 25,120" fill={hairColor} />
            <path d="M25,120 Q15,160 25,210 Q30,180 40,210 Q35,160 25,120" fill={hairColor} />
            <path d="M175,120 Q185,160 175,210 Q170,180 160,210 Q165,160 175,120" fill={hairColor} />
          </>
        )
      case "curly":
        return (
          <>
            <circle cx="50" cy="60" r="20" fill={hairColor} />
            <circle cx="80" cy="45" r="22" fill={hairColor} />
            <circle cx="120" cy="45" r="22" fill={hairColor} />
            <circle cx="150" cy="60" r="20" fill={hairColor} />
            <circle cx="35" cy="90" r="18" fill={hairColor} />
            <circle cx="165" cy="90" r="18" fill={hairColor} />
            <circle cx="100" cy="38" r="20" fill={hairColor} />
          </>
        )
      case "spiky":
        return (
          <>
            <polygon points="60,70 50,20 75,60" fill={hairColor} />
            <polygon points="80,60 75,10 95,50" fill={hairColor} />
            <polygon points="100,55 100,5 115,50" fill={hairColor} />
            <polygon points="120,60 125,10 140,60" fill={hairColor} />
            <polygon points="140,70 150,20 155,65" fill={hairColor} />
            <path d="M40,100 Q40,60 100,50 Q160,60 160,100" fill={hairColor} />
          </>
        )
      case "ponytail":
        return (
          <>
            <path d="M35,100 Q35,50 100,42 Q165,50 165,100 Q160,65 100,55 Q40,65 35,100" fill={hairColor} />
            <ellipse cx="100" cy="35" rx="25" ry="15" fill={hairColor} />
            <path d="M100,28 Q105,5 115,0 Q110,15 115,35" fill={hairColor} stroke={hairColor} strokeWidth="4" />
          </>
        )
      case "bun":
        return (
          <>
            <path d="M35,100 Q35,50 100,42 Q165,50 165,100 Q160,65 100,55 Q40,65 35,100" fill={hairColor} />
            <circle cx="100" cy="25" r="25" fill={hairColor} />
          </>
        )
      default:
        return null
    }
  }

  // Facial hair
  const renderFacialHair = () => {
    switch (facialHair) {
      case "none":
        return null
      case "stubble":
        return (
          <g opacity="0.4">
            {Array.from({ length: 30 }).map((_, i) => (
              <circle key={i} cx={70 + Math.random() * 60} cy={145 + Math.random() * 35} r="1" fill={facialHairColor} />
            ))}
          </g>
        )
      case "mustache":
        return (
          <path d="M70,148 Q85,155 100,150 Q115,155 130,148 Q120,160 100,158 Q80,160 70,148" fill={facialHairColor} />
        )
      case "goatee":
        return (
          <>
            <path d="M70,148 Q85,155 100,150 Q115,155 130,148 Q120,160 100,158 Q80,160 70,148" fill={facialHairColor} />
            <path d="M85,168 Q100,195 115,168 Q110,185 100,190 Q90,185 85,168" fill={facialHairColor} />
          </>
        )
      case "beard":
        return (
          <path d="M50,140 Q50,180 100,195 Q150,180 150,140 Q145,170 100,180 Q55,170 50,140" fill={facialHairColor} />
        )
      case "fullBeard":
        return (
          <>
            <path d="M40,120 Q35,170 100,200 Q165,170 160,120 Q155,165 100,190 Q45,165 40,120" fill={facialHairColor} />
            <path d="M70,148 Q85,155 100,150 Q115,155 130,148" fill={facialHairColor} stroke={facialHairColor} strokeWidth="3" />
          </>
        )
      default:
        return null
    }
  }

  // Clothing
  const renderClothing = () => {
    const patternId = `pattern-${character.id}`
    
    const renderPattern = () => {
      switch (clothingPattern) {
        case "stripes":
          return (
            <pattern id={patternId} patternUnits="userSpaceOnUse" width="10" height="10">
              <rect width="10" height="10" fill={clothingColor} />
              <line x1="0" y1="5" x2="10" y2="5" stroke={adjustColor(clothingColor, -30)} strokeWidth="2" />
            </pattern>
          )
        case "dots":
          return (
            <pattern id={patternId} patternUnits="userSpaceOnUse" width="12" height="12">
              <rect width="12" height="12" fill={clothingColor} />
              <circle cx="6" cy="6" r="2" fill={adjustColor(clothingColor, -30)} />
            </pattern>
          )
        default:
          return null
      }
    }

    const fillColor = clothingPattern === "solid" ? clothingColor : `url(#${patternId})`

    switch (clothingStyle) {
      case "tshirt":
        return (
          <>
            {renderPattern()}
            <path d="M45,195 L25,210 L25,250 L175,250 L175,210 L155,195 Q130,200 100,200 Q70,200 45,195" fill={fillColor} stroke={adjustColor(clothingColor, -20)} strokeWidth="2" />
            <path d="M65,195 Q100,210 135,195" fill="none" stroke={adjustColor(clothingColor, -20)} strokeWidth="2" />
          </>
        )
      case "sweater":
        return (
          <>
            {renderPattern()}
            <path d="M40,195 L15,215 L15,250 L185,250 L185,215 L160,195 Q130,200 100,200 Q70,200 40,195" fill={fillColor} stroke={adjustColor(clothingColor, -20)} strokeWidth="2" />
            <path d="M55,195 Q100,215 145,195" fill="none" stroke={adjustColor(clothingColor, -20)} strokeWidth="2" />
            <line x1="15" y1="235" x2="185" y2="235" stroke={adjustColor(clothingColor, -15)} strokeWidth="1.5" />
            <line x1="15" y1="245" x2="185" y2="245" stroke={adjustColor(clothingColor, -15)} strokeWidth="1.5" />
          </>
        )
      case "jacket":
        return (
          <>
            {renderPattern()}
            <path d="M35,195 L10,215 L10,250 L190,250 L190,215 L165,195 Q130,200 100,200 Q70,200 35,195" fill={fillColor} stroke={adjustColor(clothingColor, -20)} strokeWidth="2" />
            <line x1="100" y1="200" x2="100" y2="250" stroke={adjustColor(clothingColor, -30)} strokeWidth="3" />
            <rect x="85" y="225" width="12" height="8" rx="2" fill={adjustColor(clothingColor, -25)} />
            <rect x="103" y="225" width="12" height="8" rx="2" fill={adjustColor(clothingColor, -25)} />
          </>
        )
      case "hoodie":
        return (
          <>
            {renderPattern()}
            <path d="M35,195 L10,220 L10,250 L190,250 L190,220 L165,195 Q130,200 100,200 Q70,200 35,195" fill={fillColor} stroke={adjustColor(clothingColor, -20)} strokeWidth="2" />
            <path d="M55,195 Q100,220 145,195 Q125,200 100,200 Q75,200 55,195" fill={adjustColor(clothingColor, -10)} />
            <ellipse cx="100" cy="210" rx="12" ry="8" fill={adjustColor(clothingColor, -25)} />
            <line x1="90" y1="215" x2="85" y2="240" stroke={adjustColor(clothingColor, -25)} strokeWidth="3" />
            <line x1="110" y1="215" x2="115" y2="240" stroke={adjustColor(clothingColor, -25)} strokeWidth="3" />
          </>
        )
      case "polo":
        return (
          <>
            {renderPattern()}
            <path d="M45,195 L25,210 L25,250 L175,250 L175,210 L155,195 Q130,200 100,200 Q70,200 45,195" fill={fillColor} stroke={adjustColor(clothingColor, -20)} strokeWidth="2" />
            <path d="M80,195 L80,220 L100,225 L120,220 L120,195" fill={adjustColor(clothingColor, 15)} stroke={adjustColor(clothingColor, -20)} strokeWidth="1.5" />
            <circle cx="100" cy="215" r="3" fill={adjustColor(clothingColor, -30)} />
            <circle cx="100" cy="225" r="3" fill={adjustColor(clothingColor, -30)} />
          </>
        )
      case "tank":
        return (
          <>
            {renderPattern()}
            <path d="M55,195 L55,250 L145,250 L145,195 Q120,200 100,200 Q80,200 55,195" fill={fillColor} stroke={adjustColor(clothingColor, -20)} strokeWidth="2" />
            <path d="M70,195 Q100,210 130,195" fill="none" stroke={adjustColor(clothingColor, -20)} strokeWidth="2" />
          </>
        )
      default:
        return null
    }
  }

  // Ears
  const renderEars = () => (
    <>
      <ellipse cx="28" cy="115" rx="10" ry="15" fill={skinTone} stroke={adjustColor(skinTone, -15)} strokeWidth="1" />
      <ellipse cx="172" cy="115" rx="10" ry="15" fill={skinTone} stroke={adjustColor(skinTone, -15)} strokeWidth="1" />
    </>
  )

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 250"
      className={className}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={`skin-gradient-${character.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={adjustColor(skinTone, 10)} />
          <stop offset="100%" stopColor={adjustColor(skinTone, -10)} />
        </linearGradient>
      </defs>

      {/* Clothing (behind face) */}
      {renderClothing()}

      {/* Neck */}
      <rect x="80" y="185" width="40" height="20" fill={skinTone} />

      {/* Ears (behind face) */}
      {renderEars()}

      {/* Face */}
      <path
        d={faceShapePaths[faceShape]}
        fill={`url(#skin-gradient-${character.id})`}
        stroke={adjustColor(skinTone, -20)}
        strokeWidth="1.5"
      />

      {/* Cheeks */}
      <ellipse cx="55" cy="140" rx="12" ry="8" fill={adjustColor(skinTone, -5)} opacity="0.5" />
      <ellipse cx="145" cy="140" rx="12" ry="8" fill={adjustColor(skinTone, -5)} opacity="0.5" />

      {/* Eyebrows */}
      {renderEyebrows()}

      {/* Eyes */}
      {renderEyes()}

      {/* Nose */}
      {renderNose()}

      {/* Mouth */}
      {renderMouth()}

      {/* Facial Hair (on top of face) */}
      {renderFacialHair()}

      {/* Hair (on top of everything) */}
      {renderHair()}
    </svg>
  )
}

// Helper to lighten/darken a hex color
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount))
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`
}
