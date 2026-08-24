import { Static, Type } from "@sinclair/typebox"

export const EvaluationRequestSchema = Type.Object({
  targetChunk: Type.String({ minLength: 1, maxLength: 160 }),
  promptRu: Type.String({ minLength: 1, maxLength: 500 }),
  answer: Type.String({ minLength: 1, maxLength: 1000 })
}, { additionalProperties: false })

export const EvaluationResultSchema = Type.Object({
  verdict: Type.Union([Type.Literal("correct"), Type.Literal("almost"), Type.Literal("incorrect")]),
  score: Type.Integer({ minimum: 0, maximum: 100 }),
  criteria: Type.Object({
    chunkUsed: Type.Boolean(),
    meaningPreserved: Type.Boolean(),
    grammarCorrect: Type.Boolean(),
    naturalness: Type.Integer({ minimum: 0, maximum: 100 })
  }, { additionalProperties: false }),
  feedbackRu: Type.String(),
  naturalAnswer: Type.String(),
  alternatives: Type.Array(Type.String(), { maxItems: 3 })
}, { additionalProperties: false })

export type EvaluationRequest = Static<typeof EvaluationRequestSchema>
export type EvaluationResult = Static<typeof EvaluationResultSchema>

export const evaluationJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["verdict", "score", "criteria", "feedbackRu", "naturalAnswer", "alternatives"],
  properties: {
    verdict: { type: "string", enum: ["correct", "almost", "incorrect"] },
    score: { type: "integer", minimum: 0, maximum: 100 },
    criteria: {
      type: "object",
      additionalProperties: false,
      required: ["chunkUsed", "meaningPreserved", "grammarCorrect", "naturalness"],
      properties: {
        chunkUsed: { type: "boolean" },
        meaningPreserved: { type: "boolean" },
        grammarCorrect: { type: "boolean" },
        naturalness: { type: "integer", minimum: 0, maximum: 100 }
      }
    },
    feedbackRu: { type: "string" },
    naturalAnswer: { type: "string" },
    alternatives: { type: "array", maxItems: 3, items: { type: "string" } }
  }
} as const
