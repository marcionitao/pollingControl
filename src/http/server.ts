import fastify from 'fastify'
import fastifyFormBody from '@fastify/formbody' // resolve o problema de multipart/form-data no fastify
import { createPoll } from './routes/create-poll'
import { getPoll } from './routes/get-poll'

const app = fastify()
// para cada requisição criamos um registo
app.register(createPoll)
app.register(getPoll)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running on http://localhost:3333')
})
