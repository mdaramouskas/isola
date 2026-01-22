import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

// DEV: allow self-signed certificates in development to avoid TLS errors
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}
// Prefer DATABASE_URL (pooler) then DIRECT_URL (direct DB host)
const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL
const which = process.env.DATABASE_URL ? "DATABASE_URL" : process.env.DIRECT_URL ? "DIRECT_URL" : null
if (!connectionString || !which) {
  throw new Error("Missing DATABASE_URL or DIRECT_URL environment variable. Set DATABASE_URL (preferred) or DIRECT_URL.")
}

try {
  console.log(`Using DB env: ${which} ->`, new URL(connectionString).host)
} catch (e) {
  console.warn("Unable to parse DB host from connection string")
}

const sslMode = process.env.PGSSLMODE ?? process.env.PG_SSLMODE
const ssl =
  sslMode === "require" ||
  sslMode === "verify-ca" ||
  sslMode === "verify-full" ||
  sslMode === "no-verify"
    ? { rejectUnauthorized: sslMode !== "no-verify" }
    : undefined
const adapter = new PrismaPg({
  connectionString,
  ssl,
})

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
