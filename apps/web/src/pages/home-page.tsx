import { Bell, BrainCircuit, Clock3, Gauge, Play, Target } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const metrics = [
  { label: "Уровень", value: "B1", meta: "по результатам опроса", icon: Gauge },
  { label: "Цель", value: "Речь", meta: "повседневные разговоры", icon: Target },
  { label: "Ритм", value: "5", meta: "минут в день", icon: Clock3 }
]

export function HomePage() {
  return (
    <>
      <Card className="hero-card">
        <div>
          <h2>Первая тренировка готова.</h2>
          <p>Пять заданий с конструкциями для повседневных разговоров.</p>
          <div className="action-row">
            <Button asChild><Link to="/practice"><Play size={18} fill="currentColor" />Начать</Link></Button>
            <Button variant="secondary"><Bell size={18} />Напоминание</Button>
          </div>
        </div>
        <span className="hero-badge"><BrainCircuit size={56} /></span>
      </Card>

      <section className="metric-grid" aria-label="Параметры плана">
        {metrics.map(({ label, value, meta, icon: Icon }) => (
          <Card className="metric-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small><Icon size={17} />{meta}</small>
          </Card>
        ))}
      </section>

      <section className="content-grid">
        <Card>
          <CardHeader>
            <div><CardTitle>Стартовая колода</CardTitle><CardDescription>12 конструкций · B1</CardDescription></div>
            <Button variant="outline" asChild><Link to="/library">Открыть</Link></Button>
          </CardHeader>
          <CardContent className="learning-grid">
            <LearningCard meta="Согласие" title="I don’t mind" copy="Не возражаю. Мне подходит." progress={0} />
            <LearningCard meta="Поддержка" title="Take your time" copy="Не торопись. Без спешки." progress={0} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div><CardTitle>Первая сессия</CardTitle><CardDescription>5 заданий · около 5 минут</CardDescription></div></CardHeader>
          <CardContent className="mode-list">
            <ModeCard meta="2 задания" title="RU → EN" />
            <ModeCard meta="2 задания" title="Контекст" />
            <ModeCard meta="1 задание" title="Произношение" />
          </CardContent>
        </Card>
      </section>
    </>
  )
}

function LearningCard({ meta, title, copy, progress }: { meta: string; title: string; copy: string; progress: number }) {
  return <article className="tonal-card"><small>{meta}</small><h3>{title}</h3><p>{copy}</p><Progress value={progress} className="mt-4" /></article>
}

function ModeCard({ meta, title }: { meta: string; title: string }) {
  return <article className="tonal-card"><small>{meta}</small><h3>{title}</h3></article>
}
