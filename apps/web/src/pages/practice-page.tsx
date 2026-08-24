import { Check, Mic, RefreshCw, Target } from "lucide-react"
import { FormEvent, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { evaluateAnswer, type EvaluationResult } from "@/lib/api"

const task = { targetChunk: "I didn’t get…", promptRu: "Я не понял конец этого фильма." }

export function PracticePage() {
  const [answer, setAnswer] = useState("I didn’t get the ending of the movie.")
  const [result, setResult] = useState<EvaluationResult | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError("")
    try {
      setResult(await evaluateAnswer({ ...task, answer }))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось проверить ответ")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="practice-grid">
      <Card>
        <CardHeader>
          <div><small className="eyebrow">Целевой chunk</small><CardTitle className="mt-1 text-3xl">{task.targetChunk}</CardTitle></div>
          <Badge className="border-transparent bg-secondary text-secondary-foreground"><Target size={15} />focus phrase</Badge>
        </CardHeader>
        <CardContent>
          <div className="practice-prompt"><small>Задание</small><h2>{task.promptRu}</h2><p>Используй целевой chunk, а не дословный перевод.</p></div>
          <form onSubmit={submit} className="mt-4">
            <label className="answer-label" htmlFor="answer">Твой ответ</label>
            <Textarea id="answer" value={answer} onChange={(event) => setAnswer(event.target.value)} autoFocus />
            <div className="action-row">
              <Button type="submit" disabled={loading || !answer.trim()}><Check size={18} />{loading ? "Проверяем…" : "Проверить"}</Button>
              <Button type="button" variant="secondary"><Mic size={18} />Сказать вслух</Button>
              <Button type="button" variant="outline"><RefreshCw size={18} />Другой пример</Button>
            </div>
            {error && <p className="error-message" role="alert">{error}. Проверь, запущен ли API.</p>}
          </form>
        </CardContent>
      </Card>

      <div className="practice-aside">
        <Card className={result ? "feedback-card success" : "feedback-card"} aria-live="polite">
          <CardHeader>
            <span className="feedback-icon"><Check size={20} /></span>
            <div><CardTitle className="text-lg">{result ? verdictLabel(result.verdict) : "AI-проверка"}</CardTitle><CardDescription>{result ? `${result.score}/100 • chunk ${result.criteria.chunkUsed ? "использован" : "не использован"}` : "Отправь ответ, чтобы увидеть разбор."}</CardDescription></div>
          </CardHeader>
          {result && <CardContent><p className="feedback-text">{result.feedbackRu}</p><strong className="natural-answer">{result.naturalAnswer}</strong></CardContent>}
        </Card>
        <Card>
          <CardHeader><div><CardTitle>Подсказки</CardTitle><CardDescription>Похожие способы выразить мысль.</CardDescription></div></CardHeader>
          <CardContent className="flex flex-wrap gap-2"><Badge>I didn’t catch…</Badge><Badge>I didn’t understand…</Badge><Badge>ending</Badge></CardContent>
        </Card>
      </div>
    </section>
  )
}

function verdictLabel(verdict: EvaluationResult["verdict"]) {
  return verdict === "correct" ? "Хорошо" : verdict === "almost" ? "Почти" : "Попробуй ещё раз"
}
