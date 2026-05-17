import {
  Users,
  SquareCheckBig,
  UtensilsCrossed,
  CalendarDays,
} from "lucide-react"

const stats = [
  {
    title: "Members",
    value: "6",
    icon: Users,
    color: "bg-blue-500/15 text-blue-400",
  },
  {
    title: "Tasks",
    value: "12",
    icon: SquareCheckBig,
    color: "bg-amber-500/15 text-amber-400",
  },
  {
    title: "Meals",
    value: "21",
    icon: UtensilsCrossed,
    color: "bg-emerald-500/15 text-emerald-400",
  },
  {
    title: "Events",
    value: "8",
    icon: CalendarDays,
    color: "bg-violet-500/15 text-violet-400",
  },
]

export function StatsGrid() {
  return (
    <div className="flex flex-wrap gap-2">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${stat.color}`}
        >
          <stat.icon className="size-4" />
          <span className="text-sm font-semibold">{stat.value}</span>
          <span className="text-xs opacity-80">{stat.title}</span>
        </div>
      ))}
    </div>
  )
}
