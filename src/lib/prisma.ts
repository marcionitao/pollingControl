// definindo a nossa conexação com o banco de dados para ser usado em todas as requisicoes
import { PrismaClient } from '@prisma/client'
import fastifyFormBody from '@fastify/formbody' // resolve o problema de multipart/form-data no fastify

// conectar com o banco de dados e visualizando os logs
export const prisma = new PrismaClient({
  log: ['query'],
})
