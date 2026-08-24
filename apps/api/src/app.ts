import cors from "@fastify/cors"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import Fastify from "fastify"

import { loadConfig, type AppConfig } from "./config.js"
import { postgresPlugin } from "./plugins/postgres.js"
import { evaluationRoutes } from "./routes/evaluations.js"
import { healthRoutes } from "./routes/health.js"

export async function buildApp(config: AppConfig = loadConfig()) {
  const app = Fastify({ logger: config.nodeEnv !== "test" }).withTypeProvider<TypeBoxTypeProvider>()

  await app.register(cors, { origin: config.webOrigin, credentials: true })
  await app.register(postgresPlugin, { config })
  await app.register(healthRoutes, { config })
  await app.register(evaluationRoutes, { config })

  return app
}
