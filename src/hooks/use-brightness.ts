import { useState, useEffect } from "react"
import { invoke } from "@tauri-apps/api/core"
import { toast } from "sonner"

export function useBrightness() {
  const [brightness, setBrightness] = useState<number>(50)
  const [isLoading, setIsLoading] = useState(false)

  // Load brightness on mount
  useEffect(() => {
    loadBrightness()
  }, [])

  const loadBrightness = async () => {
    try {
      setIsLoading(true)
      const value = await invoke<number>("get_brightness")
      setBrightness(value)
    } catch (error) {
      console.error("[v0] Failed to get brightness:", error)
      toast.error("Failed to get brightness")
    } finally {
      setIsLoading(false)
    }
  }

  const setBrightnessLevel = async (level: number) => {
    const clamped = Math.max(0, Math.min(100, level))
    setBrightness(clamped)

    try {
      await invoke("set_brightness", { level: clamped })
      toast.success(`Brightness set to ${clamped}%`)
    } catch (error) {
      console.error("[v0] Failed to set brightness:", error)
      toast.error("Failed to set brightness")
      // Revert on error
      await loadBrightness()
    }
  }

  return {
    brightness,
    setBrightness: setBrightnessLevel,
    isLoading,
    loadBrightness,
  }
}
