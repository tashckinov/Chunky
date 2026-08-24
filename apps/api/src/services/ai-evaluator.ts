import { Value } from "@sinclair/typebox/value"

import type { AppConfig } from "../config.js"
import { evaluationJsonSchema, EvaluationResultSchema, type EvaluationRequest, type EvaluationResult } from "../schemas/evaluation.js"

const systemPrompt = `You evaluate English answers written by Russian-speaking B1-B2 learners. Judge whether the target lexical chunk is used correctly, whether the Russian meaning is preserved, grammar, and naturalness. Be accepting of valid English variants. Keep feedbackRu concise, specific, and in Russian. Write feedbackRu with direct affirmative statements. State the successful parts and the learner's next action. Avoid antithesis, contrastive phrasing, and explanations framed around what something is not. Return only the required structured result.`

export async function evaluateAnswer(input: EvaluationRequest, config: AppConfig): Promise<EvaluationResult> {
  if (config.aiProvider === "mock") return mockEvaluation(input)
  const result = config.aiProvider === "openai"
    ? await evaluateWithOpenAi(input, config)
    : await evaluateWithAnthropic(input, config)

  if (!Value.Check(EvaluationResultSchema, result)) throw new Error("AI provider returned an invalid evaluation")
  return result
}

function userPrompt(input: EvaluationRequest) {
  return `Target chunk: ${input.targetChunk}\nRussian task: ${input.promptRu}\nLearner answer: ${input.answer}`
}

async function evaluateWithOpenAi(input: EvaluationRequest, config: AppConfig): Promise<EvaluationResult> {
  if (!config.openAiApiKey) throw new Error("OPENAI_API_KEY is not configured")
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { authorization: `Bearer ${config.openAiApiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: config.openAiModel,
      input: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt(input) }],
      text: { format: { type: "json_schema", name: "chunk_evaluation", strict: true, schema: evaluationJsonSchema } }
    })
  })
  if (!response.ok) throw new Error(`OpenAI request failed (${response.status})`)
  const payload = await response.json() as { output?: Array<{ content?: Array<{ type?: string; text?: string }> }> }
  const text = payload.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text
  if (!text) throw new Error("OpenAI response did not contain structured output")
  return JSON.parse(text) as EvaluationResult
}

async function evaluateWithAnthropic(input: EvaluationRequest, config: AppConfig): Promise<EvaluationResult> {
  if (!config.anthropicApiKey) throw new Error("ANTHROPIC_API_KEY is not configured")
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": config.anthropicApiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: config.anthropicModel,
      max_tokens: 700,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt(input) }],
      tools: [{ name: "submit_evaluation", description: "Submit the structured learner evaluation", input_schema: evaluationJsonSchema }],
      tool_choice: { type: "tool", name: "submit_evaluation" }
    })
  })
  if (!response.ok) throw new Error(`Anthropic request failed (${response.status})`)
  const payload = await response.json() as { content?: Array<{ type?: string; name?: string; input?: unknown }> }
  const result = payload.content?.find((item) => item.type === "tool_use" && item.name === "submit_evaluation")?.input
  if (!result) throw new Error("Anthropic response did not contain structured output")
  return result as EvaluationResult
}

function mockEvaluation(input: EvaluationRequest): EvaluationResult {
  const normalizedAnswer = input.answer.toLowerCase().replace(/[’']/g, "'")
  const normalizedChunk = input.targetChunk.toLowerCase().replace(/[’']/g, "'").replace("…", "").trim()
  const chunkUsed = normalizedAnswer.includes(normalizedChunk)
  return {
    verdict: chunkUsed ? "correct" : "almost",
    score: chunkUsed ? 92 : 72,
    criteria: { chunkUsed, meaningPreserved: true, grammarCorrect: true, naturalness: chunkUsed ? 90 : 78 },
    feedbackRu: chunkUsed ? "Смысл передан правильно. Целевой chunk использован уместно." : "Сохрани исходный смысл и добавь целевой chunk в ответ.",
    naturalAnswer: "I didn’t get the ending of the film.",
    alternatives: ["I didn’t understand the ending of the film.", "I didn’t quite get how the film ended."]
  }
}
