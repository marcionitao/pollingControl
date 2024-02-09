import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import fastifyFormBody from '@fastify/formbody' // resolve o problema de multipart/form-data no fastify
import { z } from 'zod'

const app = fastify()
app.register(fastifyFormBody)

// conectar com o banco de dados
const prisma = new PrismaClient()

app.post('/polls', async (request, reply) => {
  // definir a estrutura do request body com o zod
  const createPollBody = z.object({
    title: z.string(),
  })
  const { title } = createPollBody.parse(request.body)
  // criar o registo no banco de dados e informar os dados inseridos
  const poll = await prisma.poll.create({
    data: {
      title,
    },
  })
  // 201 - significa que o registo foi criado com sucesso
  return reply.status(201).send({ pollId: poll.id })
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running on http://localhost:3333')
})
