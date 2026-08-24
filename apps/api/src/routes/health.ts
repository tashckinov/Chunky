import type { FastifyPluginAsync } from "fastify"

import type { AppConfig } from "../config.js"

export const healthRoutes: FastifyPluginAsync<{ config: AppConfig }> = async (app, options) => {
  app.get("/health", {
    schema: {
      response: {
        200: {
          type: "object",
          additionalProperties: false,
          required: ["status", "database", "aiProvider"],
          properties: {
            status: { type: "string" },
            database: { type: "string" },
            aiProvider: { type: "string" }
          }
        }
      }
    }
  }, async () => ({ status: "ok", database: options.config.databaseUrl ? "configured" : "not-configured", aiProvider: options.config.aiProvider }))
}
