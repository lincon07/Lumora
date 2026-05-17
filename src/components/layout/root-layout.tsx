import { Outlet } from "react-router-dom"
import { useAuth } from "@/providers/auth-provider"
import SetupWizard from "@/pages/setup"

/**
 * Root layout that checks if the app is activated.
 * Shows setup wizard if not activated, otherwise renders the main app.
 */
export function RootLayout() {
  const { setupState, isLoading } = useAuth()

  // Show loading state while checking localStorage
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground animate-pulse">
            L
          </div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show setup wizard if not activated
  if (!setupState.isActivated) {
    return <SetupWizard />
  }

  // Show main app
  return <Outlet />
}
