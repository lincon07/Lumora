import { Card, CardContent } from "@/components/ui/card"
import {
  Users,
  SquareCheckBig,
  UtensilsCrossed,
  CalendarDays,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

const stats = [
  {
    title: "Family Members",
    value: "6",
    change: "+1 this month",
    trend: "up" as const,
    icon: Users,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    title: "Active Tasks",
    value: "12",
    change: "3 due today",
    trend: "up" as const,
    icon: SquareCheckBig,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    title: "Meals Planned",
    value: "21",
    change: "Full week",
    trend: "up" as const,
    icon: UtensilsCrossed,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    title: "Events This Week",
    value: "8",
    change: "-2 from last week",
    trend: "down" as const,
    icon: CalendarDays,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
]

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div
                className={`flex size-12 items-center justify-center rounded-xl ${stat.bgColor}`}
              >
                <stat.icon className={`size-6 ${stat.color}`} />
              </div>
              {stat.trend === "up" ? (
                <TrendingUp className="size-4 text-chart-4" />
              ) : (
                <TrendingDown className="size-4 text-muted-foreground" />
              )}
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm font-medium text-muted-foreground mt-0.5">
                {stat.title}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
