import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
        <Settings className="size-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">Settings</h2>
      <p className="text-muted-foreground text-center max-w-sm">
        Configure your household preferences, manage notifications, and customize your Lumora experience.
      </p>
    </div>
  )
}
