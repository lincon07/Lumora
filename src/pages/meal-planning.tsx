import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  UtensilsCrossed,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Sun,
  Moon,
  Check,
  X,
  Clock,
  Users,
  Flame,
  Eye,
  EyeOff,
} from "lucide-react"
import { toast } from "sonner"

// Types
interface MealPlan {
  id: string
  name: string
  color: string
  visible: boolean
}

interface Meal {
  id: string
  planId: string
  date: string // ISO date string YYYY-MM-DD
  type: "breakfast" | "lunch" | "dinner"
  title: string
  description?: string
  prepTime?: number // minutes
  servings?: number
  calories?: number
}

const MEAL_TYPES = [
  { value: "breakfast" as const, label: "Breakfast", icon: Coffee },
  { value: "lunch" as const, label: "Lunch", icon: Sun },
  { value: "dinner" as const, label: "Dinner", icon: Moon },
]

const PLAN_COLORS = [
  "#10B981", "#3B82F6", "#F59E0B", "#EF4444",
  "#8B5CF6", "#EC4899", "#14B8A6", "#F97316",
]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const FULL_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// Default data
const defaultPlans: MealPlan[] = [
  { id: "plan-1", name: "Family Meals", color: "#10B981", visible: true },
  { id: "plan-2", name: "Diet Plan", color: "#3B82F6", visible: true },
]

const defaultMeals: Meal[] = [
  {
    id: "meal-1",
    planId: "plan-1",
    date: new Date().toISOString().split("T")[0],
    type: "breakfast",
    title: "Pancakes & Eggs",
    description: "Fluffy pancakes with scrambled eggs",
    prepTime: 25,
    servings: 4,
    calories: 450,
  },
  {
    id: "meal-2",
    planId: "plan-1",
    date: new Date().toISOString().split("T")[0],
    type: "dinner",
    title: "Grilled Salmon",
    description: "With roasted vegetables and rice",
    prepTime: 40,
    servings: 4,
    calories: 620,
  },
]

export default function MealPlanningPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [plans, setPlans] = useState<MealPlan[]>(defaultPlans)
  const [meals, setMeals] = useState<Meal[]>(defaultMeals)

  // Plan CRUD state
  const [showPlanSheet, setShowPlanSheet] = useState(false)
  const [editingPlan, setEditingPlan] = useState<MealPlan | null>(null)
  const [planName, setPlanName] = useState("")
  const [planColor, setPlanColor] = useState("#10B981")
  const [deletePlanConfirm, setDeletePlanConfirm] = useState<MealPlan | null>(null)

  // Meal CRUD state
  const [showMealSheet, setShowMealSheet] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [mealPlanId, setMealPlanId] = useState("")
  const [mealDate, setMealDate] = useState("")
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner">("breakfast")
  const [mealTitle, setMealTitle] = useState("")
  const [mealDescription, setMealDescription] = useState("")
  const [mealPrepTime, setMealPrepTime] = useState("")
  const [mealServings, setMealServings] = useState("")
  const [mealCalories, setMealCalories] = useState("")
  const [deleteMealConfirm, setDeleteMealConfirm] = useState<Meal | null>(null)

  // Navigation
  const goToday = () => setCurrentDate(new Date())
  const goNext = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + 7)
    setCurrentDate(d)
  }
  const goPrev = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - 7)
    setCurrentDate(d)
  }

  // Get week days
  const getWeekDays = () => {
    const start = new Date(currentDate)
    start.setDate(start.getDate() - start.getDay())
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      return d
    })
  }

  const weekDays = getWeekDays()
  const today = new Date().toISOString().split("T")[0]

  // Plan CRUD
  function openAddPlan() {
    setEditingPlan(null)
    setPlanName("")
    setPlanColor("#10B981")
    setShowPlanSheet(true)
  }

  function openEditPlan(plan: MealPlan) {
    setEditingPlan(plan)
    setPlanName(plan.name)
    setPlanColor(plan.color)
    setShowPlanSheet(true)
  }

  function savePlan() {
    if (!planName.trim()) {
      toast.error("Please enter a plan name")
      return
    }
    if (editingPlan) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editingPlan.id ? { ...p, name: planName.trim(), color: planColor } : p
        )
      )
      toast.success("Plan updated")
    } else {
      const newPlan: MealPlan = {
        id: `plan-${Date.now()}`,
        name: planName.trim(),
        color: planColor,
        visible: true,
      }
      setPlans((prev) => [...prev, newPlan])
      toast.success("Plan created")
    }
    setShowPlanSheet(false)
  }

  function deletePlan() {
    if (!deletePlanConfirm) return
    setPlans((prev) => prev.filter((p) => p.id !== deletePlanConfirm.id))
    setMeals((prev) => prev.filter((m) => m.planId !== deletePlanConfirm.id))
    toast.success("Plan deleted")
    setDeletePlanConfirm(null)
  }

  function togglePlanVisibility(id: string) {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p))
    )
  }

  // Meal CRUD
  function openAddMeal(date: string, type: "breakfast" | "lunch" | "dinner") {
    setEditingMeal(null)
    setMealPlanId(plans[0]?.id || "")
    setMealDate(date)
    setMealType(type)
    setMealTitle("")
    setMealDescription("")
    setMealPrepTime("")
    setMealServings("")
    setMealCalories("")
    setShowMealSheet(true)
  }

  function openEditMeal(meal: Meal) {
    setEditingMeal(meal)
    setMealPlanId(meal.planId)
    setMealDate(meal.date)
    setMealType(meal.type)
    setMealTitle(meal.title)
    setMealDescription(meal.description || "")
    setMealPrepTime(meal.prepTime?.toString() || "")
    setMealServings(meal.servings?.toString() || "")
    setMealCalories(meal.calories?.toString() || "")
    setShowMealSheet(true)
  }

  function saveMeal() {
    if (!mealTitle.trim() || !mealPlanId) {
      toast.error("Please fill in required fields")
      return
    }
    const mealData: Meal = {
      id: editingMeal?.id || `meal-${Date.now()}`,
      planId: mealPlanId,
      date: mealDate,
      type: mealType,
      title: mealTitle.trim(),
      description: mealDescription.trim() || undefined,
      prepTime: mealPrepTime ? parseInt(mealPrepTime) : undefined,
      servings: mealServings ? parseInt(mealServings) : undefined,
      calories: mealCalories ? parseInt(mealCalories) : undefined,
    }
    if (editingMeal) {
      setMeals((prev) => prev.map((m) => (m.id === editingMeal.id ? mealData : m)))
      toast.success("Meal updated")
    } else {
      setMeals((prev) => [...prev, mealData])
      toast.success("Meal added")
    }
    setShowMealSheet(false)
  }

  function deleteMeal() {
    if (!deleteMealConfirm) return
    setMeals((prev) => prev.filter((m) => m.id !== deleteMealConfirm.id))
    toast.success("Meal deleted")
    setDeleteMealConfirm(null)
  }

  // Get meals for a specific day and type
  function getMealsForSlot(date: string, type: "breakfast" | "lunch" | "dinner") {
    const visiblePlanIds = new Set(plans.filter((p) => p.visible).map((p) => p.id))
    return meals.filter(
      (m) => m.date === date && m.type === type && visiblePlanIds.has(m.planId)
    )
  }

  // Week label
  const weekStart = weekDays[0]
  const weekEnd = weekDays[6]
  const weekLabel =
    weekStart.getMonth() === weekEnd.getMonth()
      ? `${weekStart.toLocaleDateString("en-US", { month: "long" })} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${weekStart.getFullYear()}`
      : `${weekStart.toLocaleDateString("en-US", { month: "short" })} ${weekStart.getDate()} - ${weekEnd.toLocaleDateString("en-US", { month: "short" })} ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header with navigation and plan chips */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={goToday}
              className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted"
              aria-label="Go to today"
            >
              <UtensilsCrossed className="size-5" />
            </button>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon-sm" onClick={goPrev}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={goNext}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
            <h2 className="text-base font-semibold text-foreground">{weekLabel}</h2>
          </div>
          <Button size="sm" onClick={() => openAddMeal(today, "dinner")}>
            <Plus className="size-4 mr-1" /> Add Meal
          </Button>
        </div>

        {/* Plan chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all shrink-0"
              style={{
                backgroundColor: plan.visible ? plan.color : "var(--muted)",
                color: plan.visible ? "#fff" : "var(--muted-foreground)",
                opacity: plan.visible ? 1 : 0.5,
              }}
            >
              <button
                onClick={() => togglePlanVisibility(plan.id)}
                className="flex items-center gap-1.5"
              >
                {plan.visible ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                <span className={plan.visible ? "" : "line-through"}>{plan.name}</span>
              </button>
              <button
                onClick={() => openEditPlan(plan)}
                className="ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-white/20 p-0.5"
              >
                <Pencil className="size-2.5" />
              </button>
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 shrink-0 gap-1 rounded-full px-2.5 text-xs text-muted-foreground"
            onClick={openAddPlan}
          >
            <Plus className="size-3" />
            Add Plan
          </Button>
        </div>
      </div>

      {/* Week grid */}
      <div className="flex-1 border border-border rounded-xl overflow-hidden bg-card">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {weekDays.map((day, i) => {
            const dateStr = day.toISOString().split("T")[0]
            const isToday = dateStr === today
            return (
              <div
                key={i}
                className={`flex flex-col items-center py-2 border-r border-border last:border-r-0 ${
                  isToday ? "bg-primary/5" : ""
                }`}
              >
                <span className="text-[10px] text-muted-foreground uppercase">{DAYS[i]}</span>
                <span
                  className={`text-sm font-medium ${
                    isToday
                      ? "bg-primary text-primary-foreground rounded-full size-6 flex items-center justify-center"
                      : "text-foreground"
                  }`}
                >
                  {day.getDate()}
                </span>
              </div>
            )
          })}
        </div>

        {/* Meal rows */}
        {MEAL_TYPES.map(({ value: mealType, label, icon: Icon }) => (
          <div key={mealType} className="grid grid-cols-7 border-b border-border last:border-b-0">
            {weekDays.map((day, dayIdx) => {
              const dateStr = day.toISOString().split("T")[0]
              const dayMeals = getMealsForSlot(dateStr, mealType)
              const isToday = dateStr === today

              return (
                <div
                  key={dayIdx}
                  className={`min-h-[80px] p-1.5 border-r border-border last:border-r-0 ${
                    isToday ? "bg-primary/5" : ""
                  }`}
                >
                  {dayIdx === 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
                      <Icon className="size-3" />
                      {label}
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    {dayMeals.map((meal) => {
                      const plan = plans.find((p) => p.id === meal.planId)
                      return (
                        <button
                          key={meal.id}
                          onClick={() => openEditMeal(meal)}
                          className="text-left rounded-md px-1.5 py-1 text-[10px] font-medium truncate transition-opacity hover:opacity-80"
                          style={{ backgroundColor: plan?.color || "#888", color: "#fff" }}
                        >
                          {meal.title}
                        </button>
                      )
                    })}
                    {dayMeals.length === 0 && (
                      <button
                        onClick={() => openAddMeal(dateStr, mealType)}
                        className="flex items-center justify-center rounded-md border border-dashed border-border/50 p-2 text-muted-foreground/50 hover:border-primary/50 hover:text-primary/50 transition-colors"
                      >
                        <Plus className="size-3" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Plan Sheet */}
      <Sheet open={showPlanSheet} onOpenChange={setShowPlanSheet}>
        <SheetContent side="right" className="w-80 p-6">
          <SheetHeader className="mb-6">
            <SheetTitle>{editingPlan ? "Edit Plan" : "New Meal Plan"}</SheetTitle>
            <SheetDescription>
              {editingPlan ? "Update plan details" : "Create a new meal plan to organize your meals"}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Plan name"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Color</label>
              <div className="flex flex-wrap gap-2">
                {PLAN_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setPlanColor(c)}
                    className={`size-8 rounded-full transition-all ${
                      planColor === c ? "ring-2 ring-white ring-offset-2 ring-offset-card scale-110" : ""
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="flex-col gap-2 mt-6">
            <Button className="w-full" onClick={savePlan} disabled={!planName.trim()}>
              <Check className="size-4 mr-2" />
              {editingPlan ? "Save Changes" : "Create Plan"}
            </Button>
            {editingPlan && (
              <Button
                variant="outline"
                className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => {
                  setDeletePlanConfirm(editingPlan)
                  setShowPlanSheet(false)
                }}
              >
                <Trash2 className="size-4 mr-2" /> Delete Plan
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Meal Sheet */}
      <Sheet open={showMealSheet} onOpenChange={setShowMealSheet}>
        <SheetContent side="right" className="w-96 p-6">
          <SheetHeader className="mb-6">
            <SheetTitle>{editingMeal ? "Edit Meal" : "Add Meal"}</SheetTitle>
            <SheetDescription>
              {editingMeal
                ? "Update meal details"
                : `${FULL_DAYS[new Date(mealDate).getDay()]} ${MEAL_TYPES.find((m) => m.value === mealType)?.label}`}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {/* Plan selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Meal Plan</label>
              <div className="flex flex-wrap gap-2">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setMealPlanId(plan.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      mealPlanId === plan.id
                        ? "ring-2 ring-white ring-offset-1 ring-offset-card"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: plan.color, color: "#fff" }}
                  >
                    {plan.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Meal Type</label>
              <div className="grid grid-cols-3 gap-2">
                {MEAL_TYPES.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setMealType(value)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                      mealType === value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-muted-foreground/50"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span className="text-[10px] font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Title *</label>
              <Input
                placeholder="What's for this meal?"
                value={mealTitle}
                onChange={(e) => setMealTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Notes or ingredients..."
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
                rows={2}
              />
            </div>

            {/* Meta fields */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-3" /> Prep
                </label>
                <Input
                  type="number"
                  placeholder="min"
                  value={mealPrepTime}
                  onChange={(e) => setMealPrepTime(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                  <Users className="size-3" /> Serves
                </label>
                <Input
                  type="number"
                  placeholder="#"
                  value={mealServings}
                  onChange={(e) => setMealServings(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                  <Flame className="size-3" /> Cal
                </label>
                <Input
                  type="number"
                  placeholder="kcal"
                  value={mealCalories}
                  onChange={(e) => setMealCalories(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>

          <SheetFooter className="flex-col gap-2 mt-6">
            <Button className="w-full" onClick={saveMeal} disabled={!mealTitle.trim() || !mealPlanId}>
              <Check className="size-4 mr-2" />
              {editingMeal ? "Save Changes" : "Add Meal"}
            </Button>
            {editingMeal && (
              <Button
                variant="outline"
                className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => {
                  setDeleteMealConfirm(editingMeal)
                  setShowMealSheet(false)
                }}
              >
                <Trash2 className="size-4 mr-2" /> Delete Meal
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Plan Confirmation */}
      <AlertDialog open={!!deletePlanConfirm} onOpenChange={(open) => !open && setDeletePlanConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deletePlanConfirm?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the plan and all meals in it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deletePlan} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Meal Confirmation */}
      <AlertDialog open={!!deleteMealConfirm} onOpenChange={(open) => !open && setDeleteMealConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteMealConfirm?.title}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the meal from your plan. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteMeal} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
