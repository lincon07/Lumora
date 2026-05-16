import { SquareCheckBig } from "lucide-react"

export default function TodosPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-chart-1/10">
        <SquareCheckBig className="size-8 text-chart-1" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">Todos</h2>
      <p className="text-muted-foreground text-center max-w-sm">
        Track and manage household tasks. Create checklists and assign tasks to family members.
      </p>
    </div>
  )
}
