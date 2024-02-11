import z from 'zod'
import { randomUUID } from 'node:crypto' // para gerar um UUID aleatório e unico
import { FastifyInstance } from 'fastify'

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

    // 201 - significa que o registo foi criado com sucesso
    return reply.status(201).send()
  })
}
