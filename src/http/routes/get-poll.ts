import z from 'zod'
import { prisma } from '../../lib/prisma'
import { FastifyInstance } from 'fastify'

export async function getPoll(app: FastifyInstance) {
  app.get('/polls/:pollId', async (request, reply) => {
    // definir a estrutura do request body com o zod
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    })
    const { pollId } = getPollParams.parse(request.params)
    // encontrar o registo no banco de dados
    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
    // informar os dados encontrados
    return reply.send({ poll })
  })
}
