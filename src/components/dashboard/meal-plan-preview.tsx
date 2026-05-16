import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UtensilsCrossed } from "lucide-react"

const meals = [
  {
    day: "Monday",
    meal: "Grilled Chicken Salad",
    type: "Lunch",
  },
  {
    day: "Monday",
    meal: "Pasta Carbonara",
    type: "Dinner",
  },
  {
    day: "Tuesday",
    meal: "Avocado Toast",
    type: "Breakfast",
  },
  {
    day: "Tuesday",
    meal: "Beef Stir Fry",
    type: "Dinner",
  },
  {
    day: "Wednesday",
    meal: "Salmon Bowl",
    type: "Lunch",
  },
]

export function MealPlanPreview() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Meal Plan
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            This Week
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Upcoming meals for the household
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-3">
          {meals.map((meal, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border/40 p-3 transition-colors hover:bg-muted/30"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-chart-3/10">
                <UtensilsCrossed className="size-5 text-chart-3" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {meal.meal}
                </p>
                <p className="text-xs text-muted-foreground">
                  {meal.day}
                </p>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">
                {meal.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
