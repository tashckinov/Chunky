import { BookMarked, Home, MessageCircleMore, Search, Settings, Sparkles } from "lucide-react"
import { NavLink, Outlet, useLocation } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { to: "/", label: "Главная", icon: Home },
  { to: "/library", label: "Библиотека", icon: BookMarked },
  { to: "/practice", label: "Практика", icon: MessageCircleMore }
]

const pageMeta: Record<string, { eyebrow: string; title: string }> = {
  "/": { eyebrow: "Понедельник, 24 августа", title: "Главная" },
  "/library": { eyebrow: "Твои коллекции", title: "Библиотека" },
  "/practice": { eyebrow: "Сессия 1 из 5", title: "Практика" }
}

export function AppShell() {
  const { pathname } = useLocation()
  const current = pageMeta[pathname] ?? pageMeta["/"]

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Основная навигация">
        <div className="brand">
          <span className="brand-mark"><Sparkles size={20} /></span>
          <span>
            <small>English chunks</small>
            <strong>Chunky</strong>
          </span>
        </div>
        <p className="nav-label">Навигация</p>
        <nav className="nav-list">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => cn("nav-item", isActive && "active")}>
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p className="nav-label">Сегодня</p>
          <div><span>Серия</span><strong>14 дней</strong></div>
          <div><span>Учёба</span><strong>18 мин</strong></div>
        </div>
      </aside>

      <main className="main">
        <header className="top-app-bar">
          <div>
            <p>{current.eyebrow}</p>
            <h1>{current.title}</h1>
          </div>
          <div className="top-actions">
            <Button variant="ghost" size="icon" aria-label="Поиск"><Search size={20} /></Button>
            <Button variant="ghost" size="icon" aria-label="Настройки"><Settings size={20} /></Button>
            <span className="avatar" aria-label="Профиль Максима">M</span>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  )
}
