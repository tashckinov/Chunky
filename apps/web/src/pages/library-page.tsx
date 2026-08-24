import { Filter, Plus } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const filters = ["Все", "B1", "B2", "Разговоры", "Работа", "Путешествия"]
const decks = [
  { id: "Deck 01", title: "Everyday reactions", copy: "No worries, for sure, I don’t mind, take your time.", count: 34, progress: 68 },
  { id: "Deck 02", title: "Work & deadlines", copy: "I’ll get back to you, keep me posted, running behind.", count: 41, progress: 24 },
  { id: "Deck 03", title: "Nuance & naturalness", copy: "I’ve been meaning to…, I ended up…, What’s the point?", count: 29, progress: 52 }
]

export function LibraryPage() {
  const [filter, setFilter] = useState("Все")

  return (
    <>
      <Card>
        <CardHeader>
          <div><CardTitle>Колоды</CardTitle><CardDescription>Фильтруй по уровню и ситуации.</CardDescription></div>
          <div className="flex gap-2"><Button variant="secondary"><Plus size={18} />Новая колода</Button><Button variant="outline"><Filter size={18} />Фильтры</Button></div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {filters.map((item) => <button key={item} className={cn("filter-chip", filter === item && "selected")} onClick={() => setFilter(item)}>{item}</button>)}
        </CardContent>
      </Card>

      <section className="deck-grid">
        {decks.map((deck) => (
          <Card className="deck-card" key={deck.id}>
            <CardContent className="p-5">
              <small>{deck.id}</small><h2>{deck.title}</h2><p>{deck.copy}</p>
              <Progress value={deck.progress} className="mt-5" />
              <span>{deck.count} chunks • {deck.progress}% learned</span>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="content-grid">
        <Card>
          <CardHeader><div><CardTitle>Последние чанки</CardTitle><CardDescription>Недавно добавленные и повторяемые.</CardDescription></div></CardHeader>
          <CardContent className="mode-list">
            {[['reaction', 'I don’t mind', 'Не возражаю, мне подходит.'], ['friendly phrase', 'Take your time', 'Не торопись, без спешки.'], ['certainty', 'For sure', 'Точно, конечно, без сомнений.']].map(([meta, title, copy]) => <article className="tonal-card" key={title}><small>{meta}</small><h3>{title}</h3><p>{copy}</p></article>)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div><CardTitle>AI Insight</CardTitle><CardDescription>После <strong>I don’t mind</strong> полезно сравнить оттенки с <strong>I’m fine with that</strong> и <strong>I don’t care</strong>.</CardDescription></div></CardHeader>
          <CardContent className="flex flex-wrap gap-2"><Badge>contrast pair</Badge><Badge>usage note</Badge><Badge>next</Badge></CardContent>
        </Card>
      </section>
    </>
  )
}
