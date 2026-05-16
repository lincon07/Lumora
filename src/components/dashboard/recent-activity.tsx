import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SquareCheckBig,
  CalendarDays,
  Users,
  UtensilsCrossed,
} from "lucide-react"

const activities = [
  {
    text: "Poncho completed \"Grocery Shopping\"",
    time: "2 hours ago",
    icon: SquareCheckBig,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    text: "New event: \"Doctor Appointment\" added",
    time: "4 hours ago",
    icon: CalendarDays,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
  {
    text: "Maria joined the household",
    time: "Yesterday",
    icon: Users,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    text: "Meal plan updated for the week",
    time: "Yesterday",
    icon: UtensilsCrossed,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    text: "Poncho completed \"Fix leaky faucet\"",
    time: "2 days ago",
    icon: SquareCheckBig,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
]

export function RecentActivity() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Recent Activity
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Latest updates from your household
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-3">
          {activities.map((activity, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border/40 p-3 transition-colors hover:bg-muted/30"
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${activity.bgColor}`}
              >
                <activity.icon className={`size-5 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {activity.text}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
