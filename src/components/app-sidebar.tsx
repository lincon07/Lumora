import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"

import {
    CalendarDays,
    ChevronDown,
    LayoutDashboard,
    Settings,
    SquareCheckBig,
    User2,
    Users,
    UtensilsCrossed,
} from "lucide-react"

const navItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Calendar",
        icon: CalendarDays,
    },
    {
        title: "Users",
        icon: Users,
    },
    {
        title: "Todos",
        icon: SquareCheckBig,
    },
    {
        title: "Meal Planning",
        icon: UtensilsCrossed,
    },
    {
        title: "Settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    return (
        <Sidebar className="border-r border-border/50">
            {/* Header */}
            <SidebarHeader className="border-b border-border/50 px-4 py-5">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    className="
                                        h-16
                                        rounded-2xl
                                        bg-muted/40
                                        px-4
                                        hover:bg-muted/70
                                        transition
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-11
                                            w-11
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-primary
                                            text-lg
                                            font-bold
                                            text-primary-foreground
                                        "
                                    >
                                        H
                                    </div>

                                    <div className="flex flex-col text-left">
                                        <span className="text-base font-semibold">
                                            Home Hub
                                        </span>

                                        <span className="text-sm text-muted-foreground">
                                            Main Workspace
                                        </span>
                                    </div>

                                    <ChevronDown className="ml-auto size-5 opacity-70" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="start"
                                className="w-64 rounded-2xl"
                            >
                                <DropdownMenuItem className="py-3 text-base">
                                    Main Workspace
                                </DropdownMenuItem>

                                <DropdownMenuItem className="py-3 text-base">
                                    Family Hub
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Main Content */}
            <SidebarContent className="px-3 py-5">
                <SidebarGroup>
                    <SidebarGroupLabel
                        className="
                            px-3
                            pb-3
                            text-sm
                            uppercase
                            tracking-widest
                            text-muted-foreground
                        "
                    >
                        Navigation
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-3">
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        className="
                                            h-16
                                            rounded-2xl
                                            px-4
                                            text-base
                                            font-medium
                                            transition-all
                                            hover:bg-muted/60
                                            hover:translate-x-1
                                            data-[active=true]:bg-primary
                                            data-[active=true]:text-primary-foreground
                                        "
                                    >
                                        <item.icon className="size-7 shrink-0" />

                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="border-t border-border/50 p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className="
                                h-16
                                rounded-2xl
                                px-4
                                hover:bg-muted/50
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-muted
                                "
                            >
                                <User2 className="size-6" />
                            </div>

                            <div className="flex flex-col text-left">
                                <span className="text-base font-semibold">
                                    Poncho
                                </span>

                                <span className="text-sm text-muted-foreground">
                                    Administrator
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}