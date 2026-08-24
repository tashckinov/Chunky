export type AiProvider = "mock" | "openai" | "anthropic"

export type AppConfig = {
  nodeEnv: string
  port: number
  host: string
  webOrigin: string
  databaseUrl?: string
  aiProvider: AiProvider
  openAiApiKey?: string
  openAiModel: string
  anthropicApiKey?: string
  anthropicModel: string
  adminEnabled: boolean
  adminEmail?: string
  adminPassword?: string
  adminCookieSecret?: string
}

export function loadConfig(env = process.env): AppConfig {
  const aiProvider = env.AI_PROVIDER ?? "mock"
  if (!["mock", "openai", "anthropic"].includes(aiProvider)) throw new Error(`Unsupported AI_PROVIDER: ${aiProvider}`)

  const adminEnabled = env.ADMIN_ENABLED === "true"
  if (adminEnabled && !env.DATABASE_URL) throw new Error("DATABASE_URL is required when ADMIN_ENABLED=true")
  if (adminEnabled && !env.ADMIN_EMAIL) throw new Error("ADMIN_EMAIL is required when ADMIN_ENABLED=true")
  if (adminEnabled && !env.ADMIN_PASSWORD) throw new Error("ADMIN_PASSWORD is required when ADMIN_ENABLED=true")
  if (adminEnabled && (env.ADMIN_COOKIE_SECRET?.length ?? 0) < 32) {
    throw new Error("ADMIN_COOKIE_SECRET must contain at least 32 characters when ADMIN_ENABLED=true")
  }

  return {
    nodeEnv: env.NODE_ENV ?? "development",
    port: Number(env.PORT ?? 3000),
    host: env.HOST ?? "0.0.0.0",
    webOrigin: env.WEB_ORIGIN ?? "http://localhost:5173",
    databaseUrl: env.DATABASE_URL,
    aiProvider: aiProvider as AiProvider,
    openAiApiKey: env.OPENAI_API_KEY,
    openAiModel: env.OPENAI_MODEL ?? "gpt-5-mini",
    anthropicApiKey: env.ANTHROPIC_API_KEY,
    anthropicModel: env.ANTHROPIC_MODEL ?? "claude-haiku-4-5",
    adminEnabled,
    adminEmail: env.ADMIN_EMAIL,
    adminPassword: env.ADMIN_PASSWORD,
    adminCookieSecret: env.ADMIN_COOKIE_SECRET
  }
}
