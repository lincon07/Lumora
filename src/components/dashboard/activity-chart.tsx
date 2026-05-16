import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { day: "Mon", tasks: 4, events: 2, meals: 3 },
  { day: "Tue", tasks: 7, events: 1, meals: 3 },
  { day: "Wed", tasks: 5, events: 3, meals: 3 },
  { day: "Thu", tasks: 8, events: 2, meals: 3 },
  { day: "Fri", tasks: 6, events: 4, meals: 3 },
  { day: "Sat", tasks: 3, events: 5, meals: 2 },
  { day: "Sun", tasks: 2, events: 3, meals: 2 },
]

export function ActivityChart() {
  return (
    <Card className="border-border/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Weekly Activity
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tasks, events, and meals over the past week
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="oklch(0.57 0.23 264)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="oklch(0.57 0.23 264)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="fillEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="oklch(0.77 0.13 194)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="oklch(0.77 0.13 194)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border/40"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                className="text-xs"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "oklch(0.6 0.02 276)", fontSize: 12 }}
              />
              <YAxis
                className="text-xs"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "oklch(0.6 0.02 276)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.17 0 0)",
                  border: "1px solid oklch(0.27 0.01 279)",
                  borderRadius: "12px",
                  color: "oklch(0.89 0 0)",
                  fontSize: "13px",
                }}
              />
              <Area
                type="monotone"
                dataKey="tasks"
                stroke="oklch(0.57 0.23 264)"
                strokeWidth={2}
                fill="url(#fillTasks)"
              />
              <Area
                type="monotone"
                dataKey="events"
                stroke="oklch(0.77 0.13 194)"
                strokeWidth={2}
                fill="url(#fillEvents)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
