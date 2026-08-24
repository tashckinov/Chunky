import { BookMarked, Home, MessageCircleMore, Search, Settings } from "lucide-react"
import { NavLink, Outlet, useLocation } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { to: "/", label: "Главная", icon: Home },
  { to: "/library", label: "Библиотека", icon: BookMarked },
  { to: "/practice", label: "Практика", icon: MessageCircleMore }
]

const pageTitles: Record<string, string> = {
  "/": "Главная",
  "/library": "Библиотека",
  "/practice": "Практика"
}

export function AppShell() {
  const { pathname } = useLocation()
  const currentTitle = pageTitles[pathname] ?? pageTitles["/"]

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Основная навигация">
        <div className="brand">
          <img className="brand-logo" src="/chunky-logo.png" alt="" width="40" height="40" />
          <strong>Chunky</strong>
        </div>
        <nav className="nav-list">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => cn("nav-item", isActive && "active")}>
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main">
        <header className="top-app-bar">
          <h1>{currentTitle}</h1>
          <div className="top-actions">
            <Button variant="ghost" size="icon" aria-label="Поиск"><Search size={20} /></Button>
            <Button variant="ghost" size="icon" aria-label="Настройки"><Settings size={20} /></Button>
            <span className="avatar" aria-label="Профиль Максима">M</span>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
