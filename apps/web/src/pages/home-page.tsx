import { Bell, BrainCircuit, Flame, Play, RefreshCw, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const metrics = [
  { label: "Серия", value: "14", meta: "дней подряд", icon: Flame },
  { label: "Повторить сегодня", value: "23", meta: "chunks", icon: RefreshCw },
  { label: "Naturalness", value: "86%", meta: "хороший результат", icon: Sparkles }
]

export function HomePage() {
  return (
    <>
      <Card className="hero-card">
        <div>
          <h2>Осваивай готовые конструкции для живой речи.</h2>
          <p>Сегодня у тебя 23 чанка на повторение. Начни с короткой сессии. Закрепи их через перевод и контекст.</p>
          <div className="action-row">
            <Button asChild><Link to="/practice"><Play size={18} fill="currentColor" />Продолжить урок</Link></Button>
            <Button variant="secondary"><Bell size={18} />Напоминания</Button>
          </div>
        </div>
        <span className="hero-badge"><BrainCircuit size={56} /></span>
      </Card>

      <section className="metric-grid" aria-label="Статистика за сегодня">
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
            <div><CardTitle>Продолжить</CardTitle><CardDescription>Последние активные чанки.</CardDescription></div>
            <Button variant="outline" asChild><Link to="/library">Открыть</Link></Button>
          </CardHeader>
          <CardContent className="learning-grid">
            <LearningCard meta="B1 • Everyday conversations" title="I don’t mind" copy="Не возражаю. Мне подходит." progress={48} />
            <LearningCard meta="Useful reaction" title="Take your time" copy="Не торопись. Без спешки." progress={76} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div><CardTitle>Быстрый старт</CardTitle><CardDescription>Выбери режим тренировки.</CardDescription></div></CardHeader>
          <CardContent className="mode-list">
            <ModeCard meta="Активное воспроизведение" title="RU → EN" copy="Перевод с фокусом на целевой chunk." />
            <ModeCard meta="Произношение" title="Shadowing" copy="Повтори фразу за диктором." />
            <ModeCard meta="Проверка" title="AI feedback" copy="Naturalness, grammar и альтернативы." />
          </CardContent>
        </Card>
      </section>
    </>
  )
}

function LearningCard({ meta, title, copy, progress }: { meta: string; title: string; copy: string; progress: number }) {
  return <article className="tonal-card"><small>{meta}</small><h3>{title}</h3><p>{copy}</p><Progress value={progress} className="mt-4" /></article>
}

function ModeCard({ meta, title, copy }: { meta: string; title: string; copy: string }) {
  return <article className="tonal-card"><small>{meta}</small><h3>{title}</h3><p>{copy}</p></article>
}
