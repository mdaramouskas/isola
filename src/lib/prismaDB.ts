import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

// if (!process.env.DATABASE_URL) {
if (!process.env.DIRECT_URL) {
  throw new Error("Missing DATABASE_URL")
}
console.log("DB host:", new URL(process.env.DIRECT_URL!).host)
const adapter = new PrismaPg({
  // connectionString: process.env.DATABASE_URL,
  connectionString: process.env.DIRECT_URL, 
})

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
