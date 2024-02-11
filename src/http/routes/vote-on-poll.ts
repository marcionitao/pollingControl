import z from 'zod'
import { randomUUID } from 'node:crypto' // para gerar um UUID aleatório e unico
import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/prisma'

export async function voteOnPoll(app: FastifyInstance) {
  // usuario irá votar em uma enquete especifica
  app.post('/polls/:pollId/votes', async (request, reply) => {
    // definindo qual é a opção que o usuario irá votar
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid(),
    })
    // definindo qual a enquete que o usuario irá votar
    const voteOnPollParams = z.object({
      pollId: z.string().uuid(),
    })
    const { pollId } = voteOnPollParams.parse(request.params)
    const { pollOptionId } = voteOnPollBody.parse(request.body)

    // verificar se dentro da minha sessionId existe o cookie
    let { sessionId } = request.cookies

    // caso o cookie exista, verificar se o usuario já votou nesta enquete
    if (sessionId) {
      const userPreviousVoteOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId,
          },
        },
      })
      if (
        userPreviousVoteOnPoll &&
        userPreviousVoteOnPoll.pollOptionId !== pollOptionId
      ) {
        // apagar o voto anterior
        await prisma.vote.delete({
          where: {
            id: userPreviousVoteOnPoll.id,
          },
        })
      } else if (userPreviousVoteOnPoll) {
        return reply
          .status(408)
          .send({ message: 'You already voted on this poll' })
      }
    }
    // caso o cookie nao exista, criar um novo
    if (!sessionId) {
      // resolvendo a fiabilidade da opção que o usuario irá votar(usando cookies)
      sessionId = randomUUID()
      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
        signed: true, // para assinar o cookie
        httpOnly: true, // para que o cookie seja acessível somente pelo servidor
      })
    }

    // criando o voto no banco de dados
    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId,
      },
    })

    // 201 - significa que o registo foi criado com sucesso
    return reply.status(201).send()
  })
}
