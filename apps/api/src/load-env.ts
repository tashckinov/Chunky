import path from "node:path"
import dotenv from "dotenv"

// npm workspaces run package scripts with apps/api as the working directory,
// while local development keeps the shared .env in the repository root.
// Package-local values take precedence when both files exist.
dotenv.config({
  path: [path.resolve(process.cwd(), ".env"), path.resolve(process.cwd(), "../../.env")],
  quiet: true
})
