import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox"

import type { AppConfig } from "../config.js"
import { EvaluationRequestSchema, EvaluationResultSchema } from "../schemas/evaluation.js"
import { evaluateAnswer } from "../services/ai-evaluator.js"

const EvaluationErrorSchema = {
  type: "object",
  additionalProperties: false,
  required: ["error", "message"],
  properties: {
    error: { type: "string" },
    message: { type: "string" }
  }
} as const

export const evaluationRoutes: FastifyPluginAsyncTypebox<{ config: AppConfig }> = async (app, options) => {
  app.post("/v1/evaluations", {
    schema: {
      body: EvaluationRequestSchema,
      response: { 200: EvaluationResultSchema, 503: EvaluationErrorSchema }
    }
  }, async (request, reply) => {
    try {
      return await evaluateAnswer(request.body, options.config)
    } catch (error) {
      request.log.error({ error }, "evaluation failed")
      return reply.code(503).send({
        error: "evaluation_unavailable",
        message: "AI evaluation is temporarily unavailable"
      })
    }
  })
}
