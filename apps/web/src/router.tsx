import { createBrowserRouter } from "react-router-dom"

import { AppShell } from "@/components/layout/app-shell"
import { HomePage } from "@/pages/home-page"
import { LibraryPage } from "@/pages/library-page"
import { PracticePage } from "@/pages/practice-page"

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/library", element: <LibraryPage /> },
      { path: "/practice", element: <PracticePage /> }
    ]
  }
])
