import type * as Fastify from "fastify"
import type { Pool } from "pg"

type SessionCallback = (error?: Error | null) => void
type SessionReadCallback = (error?: Error | null, session?: Fastify.Session | null) => void

export class AdminSessionStore {
  constructor(
    private readonly pool: Pool,
    private readonly ttlMilliseconds: number
  ) {}

  set(sessionId: string, session: Fastify.Session, callback: SessionCallback) {
    const expiresAt = new Date(Date.now() + this.ttlMilliseconds)

    this.pool.query(
      `insert into admin_sessions (id, data, expires_at)
       values ($1, $2::jsonb, $3)
       on conflict (id) do update
       set data = excluded.data, expires_at = excluded.expires_at, updated_at = now()`,
      [sessionId, JSON.stringify(session), expiresAt]
    ).then(() => callback()).catch((error: Error) => callback(error))
  }

  get(sessionId: string, callback: SessionReadCallback) {
    this.pool.query("delete from admin_sessions where id = $1 and expires_at <= now()", [sessionId])
      .then(() => this.pool.query<{ data: Fastify.Session }>(
        "select data from admin_sessions where id = $1 and expires_at > now()",
        [sessionId]
      ))
      .then((result) => callback(null, result.rows[0]?.data ?? null))
      .catch((error: Error) => callback(error))
  }

  destroy(sessionId: string, callback: SessionCallback) {
    this.pool.query("delete from admin_sessions where id = $1", [sessionId])
      .then(() => callback())
      .catch((error: Error) => callback(error))
  }
}
