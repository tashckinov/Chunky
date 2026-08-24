import postgres from "@fastify/postgres"
import fp from "fastify-plugin"

import type { AppConfig } from "../config.js"

export const postgresPlugin = fp<{ config: AppConfig }>(async (app, options) => {
  if (!options.config.databaseUrl) return
  await app.register(postgres, { connectionString: options.config.databaseUrl })
})
