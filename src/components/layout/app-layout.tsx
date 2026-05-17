import { Outlet, useLocation } from "react-router-dom"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"

export function AppLayout() {
  const { pathname } = useLocation()
  const isFullHeight = pathname === "/calendar"

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col overflow-hidden">
        <AppHeader />
        <div className={`flex flex-1 flex-col overflow-hidden ${isFullHeight ? "" : "overflow-auto p-6"}`}>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
