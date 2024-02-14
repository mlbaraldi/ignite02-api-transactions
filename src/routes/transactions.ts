import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../../db/database'
import { checkSessionId } from '../middlewares/check-session-id'

export async function transactionRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (req) => {
    console.log(`[${req.method}] ${req.url}`)
  })
  app.post('/', async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['debit', 'credit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      res.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return res.status(201).send('Transaction created')
  })

  app.get('/', { preHandler: [checkSessionId] }, async (req) => {
    const transactions = await knex('transactions')
      .where('session_id', req.cookies.sessionId)
      .select()
    return { transactions }
  })

  app.get('/:id', { preHandler: [checkSessionId] }, async (req) => {
    const getTransactionParamSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamSchema.parse(req.params)
    const transaction = await knex('transactions')
      .where({ id, session_id: req.cookies.sessionId })
      .first()
    return { transaction }
  })

  app.get('/summary', { preHandler: [checkSessionId] }, async (req) => {
    const summary = await knex('transactions')
      .where('session_id', req.cookies.sessionId)
      .sum('amount', { as: 'amount' })
      .first()

    return { summary }
  })
}
