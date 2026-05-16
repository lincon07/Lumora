import { StatsGrid } from "@/components/dashboard/stats-grid"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { TasksOverview } from "@/components/dashboard/tasks-overview"
import { MealPlanPreview } from "@/components/dashboard/meal-plan-preview"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          Welcome back, Poncho
        </h2>
        <p className="text-muted-foreground mt-1">
          {"Here's what's happening in your home hub today."}
        </p>
      </div>

      <StatsGrid />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ActivityChart />
        </div>
        <div className="lg:col-span-3">
          <TasksOverview />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MealPlanPreview />
        <RecentActivity />
      </div>
    </div>
  )
}
