import fastify from 'fastify'
import fastifyFormBody from '@fastify/formbody' // resolve o problema de multipart/form-data no fastify
import { createPoll } from './routes/create-poll'
const app = fastify()
app.register(createPoll)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running on http://localhost:3333')
})
