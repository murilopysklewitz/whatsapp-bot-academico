import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { Prisma: PrismaClient }

export const Prisma =
  globalForPrisma.Prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.Prisma = Prisma

async function testConnection() {
  try {
    await Prisma.$connect()
    console.log("✅ Conectado ao MongoDB Atlas com sucesso!");
  } catch (error: any) {
    console.error("❌ Falha ao conectar ao MongoDB:", error.message)
    throw new Error(`Erro ao conectar ao MongoDB: ${error.message}` )
  }
}
testConnection()
    
