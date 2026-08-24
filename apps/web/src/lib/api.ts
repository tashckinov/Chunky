export type EvaluationResult = {
  verdict: "correct" | "almost" | "incorrect"
  score: number
  criteria: {
    chunkUsed: boolean
    meaningPreserved: boolean
    grammarCorrect: boolean
    naturalness: number
  }
  feedbackRu: string
  naturalAnswer: string
  alternatives: string[]
}

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

export async function evaluateAnswer(payload: {
  targetChunk: string
  promptRu: string
  answer: string
}): Promise<EvaluationResult> {
  const response = await fetch(`${apiUrl}/v1/evaluations`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error("Не удалось получить проверку")
  }

  return response.json() as Promise<EvaluationResult>
}
