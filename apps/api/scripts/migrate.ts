import "../src/load-env.js"

import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import pg from "pg"

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error("DATABASE_URL is required")

const migrationsDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../migrations")
const files = (await readdir(migrationsDirectory)).filter((file) => file.endsWith(".sql")).sort()
const client = new pg.Client({ connectionString: databaseUrl })

await client.connect()
try {
  await client.query("create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())")
  for (const file of files) {
    const applied = await client.query("select 1 from schema_migrations where name = $1", [file])
    if (applied.rowCount) continue
    await client.query("begin")
    try {
      await client.query(await readFile(path.join(migrationsDirectory, file), "utf8"))
      await client.query("insert into schema_migrations(name) values ($1)", [file])
      await client.query("commit")
      console.log(`Applied ${file}`)
    } catch (error) {
      await client.query("rollback")
      throw error
    }
  }
} finally {
  await client.end()
}
