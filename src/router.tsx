import { createBrowserRouter, Navigate } from "react-router-dom"
import { RootLayout } from "@/components/layout/root-layout"
import { AppLayout } from "@/components/layout/app-layout"
import DashboardPage from "@/pages/dashboard"
import CalendarPage from "@/pages/calendar"
import UsersPage from "@/pages/users"
import TodosPage from "@/pages/todos"
import MealPlanningPage from "@/pages/meal-planning"
import SettingsPage from "@/pages/settings"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "calendar",
            element: <CalendarPage />,
          },
          {
            path: "users",
            element: <UsersPage />,
          },
          {
            path: "todos",
            element: <TodosPage />,
          },
          {
            path: "meal-planning",
            element: <MealPlanningPage />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
])
