// definindo a nossa conexação com o banco de dados para ser usado em todas as requisicoes
import { PrismaClient } from '@prisma/client'

// conectar com o banco de dados e visualizando os logs
export const prisma = new PrismaClient({
  log: ['query'],
})
