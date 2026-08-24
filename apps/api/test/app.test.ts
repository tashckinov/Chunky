import assert from "node:assert/strict"
import test from "node:test"

import { buildApp } from "../src/app.js"
import type { AppConfig } from "../src/config.js"

const config: AppConfig = {
  nodeEnv: "test",
  port: 0,
  host: "127.0.0.1",
  webOrigin: "http://localhost:5173",
  aiProvider: "mock",
  openAiModel: "test",
  anthropicModel: "test",
  adminEnabled: false
}

test("health route reports ready", async () => {
  const app = await buildApp(config)
  const response = await app.inject({ method: "GET", url: "/health" })
  assert.equal(response.statusCode, 200)
  assert.deepEqual(response.json(), { status: "ok", database: "not-configured", aiProvider: "mock" })
  await app.close()
})

test("evaluation route returns structured JSON", async () => {
  const app = await buildApp(config)
  const response = await app.inject({
    method: "POST",
    url: "/v1/evaluations",
    payload: { targetChunk: "I didn't get", promptRu: "Я не понял конец фильма.", answer: "I didn't get the ending of the film." }
  })
  assert.equal(response.statusCode, 200)
  const result = response.json()
  assert.equal(result.verdict, "correct")
  assert.equal(result.criteria.chunkUsed, true)
  assert.equal(typeof result.naturalAnswer, "string")
  await app.close()
})

test("admin routes stay closed when AdminJS is disabled", async () => {
  const app = await buildApp(config)
  const response = await app.inject({ method: "GET", url: "/admin" })
  assert.equal(response.statusCode, 404)
  await app.close()
})
