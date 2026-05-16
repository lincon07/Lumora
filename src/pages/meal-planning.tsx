import { UtensilsCrossed } from "lucide-react"

export default function MealPlanningPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-chart-3/10">
        <UtensilsCrossed className="size-8 text-chart-3" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">Meal Planning</h2>
      <p className="text-muted-foreground text-center max-w-sm">
        Plan your weekly meals, manage recipes, and create shopping lists for the household.
      </p>
    </div>
  )
}
