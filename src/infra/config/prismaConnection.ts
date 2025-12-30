import { PrismaClient } from "@prisma/client";


export const Prisma = new PrismaClient()


async function testConnection() {
  try {
    await Prisma.$connect()
    console.log(" Conectado ao MongoDB Atlas com sucesso!");
  } catch (error: any) {
    console.error(" Falha ao conectar ao MongoDB:", error.message)
    throw new Error(`Erro ao conectar ao MongoDB: ${error.message}` )
  }
}
testConnection()
    
