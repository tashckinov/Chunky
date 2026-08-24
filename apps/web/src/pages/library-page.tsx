import { Play, Plus } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const decks = [
  { level: "B1", title: "Everyday reactions", copy: "I don’t mind, take your time, no worries, for sure.", count: 12, progress: 0 }
]

const starterChunks = [
  ["Согласие", "I don’t mind", "Не возражаю, мне подходит."],
  ["Поддержка", "Take your time", "Не торопись, без спешки."],
  ["Уверенность", "For sure", "Точно, конечно, без сомнений."]
]

export function LibraryPage() {
  return (
    <>
      <Card>
        <CardHeader>
          <div><CardTitle>Стартовая подборка</CardTitle><CardDescription>B1 · повседневные разговоры</CardDescription></div>
          <Button variant="secondary"><Plus size={18} />Новая колода</Button>
        </CardHeader>
      </Card>

      <section className="deck-grid">
        {decks.map((deck) => (
          <Card className="deck-card" key={deck.title}>
            <CardContent className="p-5">
              <small>{deck.level}</small><h2>{deck.title}</h2><p>{deck.copy}</p>
              <Progress value={deck.progress} className="mt-5" />
              <span>0 из {deck.count} освоено</span>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="content-grid">
        <Card>
          <CardHeader><div><CardTitle>В колоде</CardTitle><CardDescription>Первые конструкции</CardDescription></div></CardHeader>
          <CardContent className="mode-list">
            {starterChunks.map(([meta, title, copy]) => <article className="tonal-card" key={title}><small>{meta}</small><h3>{title}</h3><p>{copy}</p></article>)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div><CardTitle>Первая сессия</CardTitle><CardDescription>5 заданий · около 5 минут</CardDescription></div></CardHeader>
          <CardContent><Button asChild><Link to="/practice"><Play size={18} fill="currentColor" />Начать</Link></Button></CardContent>
        </Card>
      </section>
    </>
  )
}
