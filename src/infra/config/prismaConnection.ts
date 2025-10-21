import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { Prisma: PrismaClient }

export const Prisma =
  globalForPrisma.Prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.Prisma = Prisma
    
