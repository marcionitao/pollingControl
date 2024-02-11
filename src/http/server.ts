import fastify from 'fastify'
import cookie from '@fastify/cookie' // para usar cookies no fastify
import { createPoll } from './routes/create-poll'
import { getPoll } from './routes/get-poll'
import { voteOnPoll } from './routes/vote-on-poll'

const app = fastify()
// para usar cookies no fastify
app.register(cookie, {
  secret: 'poll-app', // assinatura do cookie e não será alterada
  hook: 'onRequest', // para que o cookie seja enviado antes de qualquer requisição
})
// para cada requisição criamos um registo
app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running on http://localhost:3333')
})
