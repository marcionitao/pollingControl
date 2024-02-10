import z from 'zod'
import { prisma } from '../../lib/prisma'
import { FastifyInstance } from 'fastify'

export async function createPoll(app: FastifyInstance) {
  app.post('/polls', async (request, reply) => {
    // definir a estrutura do request body com o zod
    const createPollBody = z.object({
      title: z.string(),
      options: z.array(z.string()),
    })
    const { title, options } = createPollBody.parse(request.body)
    // criar o registo no banco de dados e informar os dados inseridos
    const poll = await prisma.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map((option) => {
              return { title: option }
            }),
          },
        },
      },
    })

    // 201 - significa que o registo foi criado com sucesso
    return reply.status(201).send({ pollId: poll.id })
  })
}
