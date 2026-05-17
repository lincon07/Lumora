import { StatsGrid } from "@/components/dashboard/stats-grid"
import { TodayCalendar } from "@/components/dashboard/today-calendar"
import { TasksOverview } from "@/components/dashboard/tasks-overview"
import { MealPlanPreview } from "@/components/dashboard/meal-plan-preview"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Welcome back, Poncho
          </h2>
          <p className="text-sm text-muted-foreground">
            {"Here's what's happening today."}
          </p>
        </div>
        <StatsGrid />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TodayCalendar />
        <TasksOverview />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MealPlanPreview />
        <RecentActivity />
      </div>
    </div>
  )
}
