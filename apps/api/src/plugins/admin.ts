import { createHash, timingSafeEqual } from "node:crypto"

import AdminJS, { type ResourceOptions } from "adminjs"
import AdminJSFastify from "@adminjs/fastify"
import SqlAdapter, { Database, Resource } from "@adminjs/sql"
import type { FastifyInstance } from "fastify"

import type { AppConfig } from "../config.js"
import { AdminSessionStore } from "../services/admin-session-store.js"

const ADMIN_ROOT_PATH = "/admin"
const ADMIN_SESSION_TTL = 8 * 60 * 60 * 1000

AdminJS.registerAdapter({ Database, Resource })

const immutableId = {
  isVisible: { list: false, filter: false, show: true, edit: false }
}

const createdAt = {
  isVisible: { list: true, filter: true, show: true, edit: false }
}

const readOnlyActions: ResourceOptions["actions"] = {
  new: { isAccessible: false, isVisible: false },
  edit: { isAccessible: false, isVisible: false },
  delete: { isAccessible: false, isVisible: false },
  bulkDelete: { isAccessible: false, isVisible: false }
}

export async function registerAdmin(app: FastifyInstance, config: AppConfig) {
  if (!config.adminEnabled) return

  const databaseUrl = config.databaseUrl!
  const database = databaseName(databaseUrl)
  const metadata = await new SqlAdapter("postgresql", {
    connectionString: databaseUrl,
    database
  }).init()

  const admin = new AdminJS({
    rootPath: ADMIN_ROOT_PATH,
    branding: {
      companyName: "Chunky",
      withMadeWithLove: false,
      theme: {
        colors: {
          primary100: "#315da8",
          accent: "#315da8"
        }
      }
    },
    locale: {
      language: "ru",
      availableLanguages: ["ru"]
    },
    resources: [
      {
        resource: metadata.table("decks"),
        options: {
          navigation: { name: "Контент", icon: "BookOpen" },
          listProperties: ["title", "level", "slug", "created_at"],
          filterProperties: ["title", "level", "slug", "created_at"],
          showProperties: ["id", "title", "description", "level", "slug", "created_at"],
          editProperties: ["title", "description", "level", "slug"],
          properties: {
            id: immutableId,
            level: {
              availableValues: ["A2", "B1", "B2", "C1"].map((value) => ({ label: value, value }))
            },
            created_at: createdAt
          }
        }
      },
      {
        resource: metadata.table("chunks"),
        options: {
          navigation: { name: "Контент", icon: "BookOpen" },
          listProperties: ["phrase", "meaning_ru", "deck_id", "created_at"],
          filterProperties: ["phrase", "meaning_ru", "deck_id", "created_at"],
          showProperties: ["id", "deck_id", "phrase", "meaning_ru", "usage_note_ru", "examples", "created_at"],
          editProperties: ["deck_id", "phrase", "meaning_ru", "usage_note_ru", "examples"],
          properties: {
            id: immutableId,
            created_at: createdAt
          }
        }
      },
      {
        resource: metadata.table("users"),
        options: {
          navigation: { name: "Пользователи", icon: "User" },
          actions: readOnlyActions,
          listProperties: ["display_name", "email", "created_at", "updated_at"],
          filterProperties: ["display_name", "email", "created_at"],
          showProperties: ["id", "display_name", "email", "created_at", "updated_at"],
          properties: {
            id: immutableId,
            created_at: createdAt,
            updated_at: createdAt
          }
        }
      },
      {
        resource: metadata.table("reviews"),
        options: {
          navigation: { name: "Пользователи", icon: "Activity" },
          actions: readOnlyActions,
          listProperties: ["user_id", "chunk_id", "due_at", "repetitions", "last_score", "last_reviewed_at"],
          filterProperties: ["user_id", "chunk_id", "due_at", "last_score", "last_reviewed_at"],
          showProperties: [
            "id",
            "user_id",
            "chunk_id",
            "due_at",
            "interval_days",
            "ease_factor",
            "repetitions",
            "last_score",
            "last_reviewed_at"
          ],
          properties: { id: immutableId }
        }
      }
    ]
  })

  const adapterKnex = metadata.tables()[0]?.knex
  if (adapterKnex) app.addHook("onClose", () => adapterKnex.destroy())

  app.get(`${ADMIN_ROOT_PATH}/`, async (_request, reply) => reply.redirect(ADMIN_ROOT_PATH))

  await AdminJSFastify.buildAuthenticatedRouter(
    admin,
    {
      cookieName: "chunky-admin",
      cookiePassword: config.adminCookieSecret!,
      authenticate: async (email, password) => {
        if (!safeEqual(email, config.adminEmail!) || !safeEqual(password, config.adminPassword!)) return null
        return { email: config.adminEmail!, title: "Администратор" }
      }
    },
    app,
    {
      secret: config.adminCookieSecret!,
      cookie: {
        httpOnly: true,
        maxAge: ADMIN_SESSION_TTL,
        path: ADMIN_ROOT_PATH,
        sameSite: "lax",
        secure: config.nodeEnv === "production"
      },
      rolling: true,
      saveUninitialized: false,
      store: new AdminSessionStore(app.pg.pool, ADMIN_SESSION_TTL)
    }
  )
}

function databaseName(databaseUrl: string) {
  const name = decodeURIComponent(new URL(databaseUrl).pathname.slice(1))
  if (!name) throw new Error("DATABASE_URL must include a database name")
  return name
}

function safeEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest()
  const rightHash = createHash("sha256").update(right).digest()
  return timingSafeEqual(leftHash, rightHash)
}
