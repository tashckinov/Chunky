import { createBrowserRouter } from "react-router-dom"

import { AppShell } from "@/components/layout/app-shell"
import { AdminRedirectPage } from "@/pages/admin-redirect-page"
import { HomePage } from "@/pages/home-page"
import { LibraryPage } from "@/pages/library-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { PracticePage } from "@/pages/practice-page"

export const router = createBrowserRouter([
  { path: "/admin/*", element: <AdminRedirectPage /> },
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/library", element: <LibraryPage /> },
      { path: "/practice", element: <PracticePage /> },
      { path: "*", element: <NotFoundPage /> }
    ]
  }
])
