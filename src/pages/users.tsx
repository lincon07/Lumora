import { Users } from "lucide-react"

export default function UsersPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-chart-2/10">
        <Users className="size-8 text-chart-2" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">Users</h2>
      <p className="text-muted-foreground text-center max-w-sm">
        Manage your household members. Add, edit, and assign roles to family members.
      </p>
    </div>
  )
}
