import { NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  CalendarDays,
  LayoutDashboard,
  Settings,
  SquareCheckBig,
  Users,
  UtensilsCrossed,
  User2,
} from "lucide-react"

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Calendar", icon: CalendarDays, href: "/calendar" },
  { title: "Users", icon: Users, href: "/users" },
  { title: "Todos", icon: SquareCheckBig, href: "/todos" },
  { title: "Meal Planning", icon: UtensilsCrossed, href: "/meal-planning" },
  { title: "Settings", icon: Settings, href: "/settings" },
]

export function AppSidebar() {
  const { pathname } = useLocation()

  return (
    <Sidebar
      collapsible="none"
      className="!w-16 !h-full border-r border-border/50"
    >
      {/* Header - Logo */}
      <SidebarHeader className="flex items-center justify-center border-b border-border/50 py-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
          L
        </div>
      </SidebarHeader>

      {/* Navigation Icons */}
      <SidebarContent className="py-4">
        <SidebarMenu className="gap-1 items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <SidebarMenuItem key={item.title} className="w-full flex justify-center">
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`
                    flex size-11 items-center justify-center rounded-xl p-0
                    transition-all mx-auto
                    ${isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <NavLink to={item.href}>
                    <item.icon className="!size-5" />
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer - User */}
      <SidebarFooter className="flex items-center justify-center border-t border-border/50 py-4">
        <button className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20">
          <User2 className="size-5" />
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
