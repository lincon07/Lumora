import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

const data = [
  { name: "Completed", value: 18, color: "oklch(0.57 0.23 264)" },
  { name: "In Progress", value: 8, color: "oklch(0.77 0.13 194)" },
  { name: "Overdue", value: 3, color: "oklch(0.64 0.24 29)" },
  { name: "Upcoming", value: 5, color: "oklch(0.84 0.17 170)" },
]

const total = data.reduce((s, d) => s + d.value, 0)

export function TasksOverview() {
  return (
    <Card className="border-border/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Tasks Overview
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {total} total tasks this month
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.17 0 0)",
                  border: "1px solid oklch(0.27 0.01 279)",
                  borderRadius: "12px",
                  color: "oklch(0.89 0 0)",
                  fontSize: "13px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 justify-center">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.name}</span>
              <span className="font-semibold text-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
