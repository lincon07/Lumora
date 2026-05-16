import { useLocation } from "react-router-dom"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  SquareCheckBig,
  UtensilsCrossed,
  Settings,
} from "lucide-react"

const routeMeta: Record<string, { title: string; icon: React.ElementType }> = {
  "/dashboard": { title: "Dashboard", icon: LayoutDashboard },
  "/calendar": { title: "Calendar", icon: CalendarDays },
  "/users": { title: "Users", icon: Users },
  "/todos": { title: "Todos", icon: SquareCheckBig },
  "/meal-planning": { title: "Meal Planning", icon: UtensilsCrossed },
  "/settings": { title: "Settings", icon: Settings },
}

export function AppHeader() {
  const { pathname } = useLocation()
  const meta = routeMeta[pathname] ?? { title: "Lumora", icon: LayoutDashboard }
  const Icon = meta.icon

  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border/50 px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="size-9 text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Icon className="size-5 text-primary" />
        <h1 className="text-lg font-semibold text-foreground">{meta.title}</h1>
      </div>
    </header>
  )
}
