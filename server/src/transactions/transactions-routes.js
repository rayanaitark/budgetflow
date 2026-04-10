import { TransactionModel } from '../models/transaction-model.js'
import { UserModel } from '../models/user-model.js'
import { getMonthDateRange } from '../utils/date-range.js'
import { buildSummary } from './summary.js'

function serializeTransaction(transaction) {
  return {
    id: transaction._id,
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    date: transaction.date,
    note: transaction.note
  }
}

export async function transactionsRoutes(fastify) {
  fastify.post('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { type, amount, category, date, note } = request.body || {}

    if (!['income', 'expense'].includes(type)) {
      return reply.code(400).send({ message: 'type must be income or expense' })
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return reply.code(400).send({ message: 'amount must be greater than 0' })
    }

    if (!category || !date) {
      return reply.code(400).send({ message: 'category and date are required' })
    }

    const transaction = await TransactionModel.create({
      userId: request.currentUser?.sub,
      type,
      amount,
      category,
      date,
      note: note || ''
    })

    return reply.code(201).send({ transaction: serializeTransaction(transaction) })
  })

  fastify.get('/', { preHandler: [fastify.authenticate] }, async (request) => {
    const { type, from, to, category } = request.query || {}

    const filter = { userId: request.currentUser?.sub }

    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type
    }

    if (category) {
      filter.category = category
    }

    if (from || to) {
      filter.date = {}
      if (from) filter.date.$gte = new Date(from)
      if (to) filter.date.$lte = new Date(to)
    }

    const transactions = await TransactionModel.find(filter).sort({ date: -1, createdAt: -1 })

    return {
      transactions: transactions.map(serializeTransaction)
    }
  })

  fastify.delete('/:transactionId', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { transactionId } = request.params

    const transaction = await TransactionModel.findOneAndDelete({
      _id: transactionId,
      userId: request.currentUser?.sub
    })

    if (!transaction) {
      return reply.code(404).send({ message: 'transaction not found' })
    }

    return reply.send({ message: 'transaction deleted' })
  })

  fastify.get('/summary', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const range = getMonthDateRange(request.query?.month)

    if (!range) {
      return reply.code(400).send({ message: 'month must use YYYY-MM format' })
    }

    const [transactions, user] = await Promise.all([
      TransactionModel.find({
        userId: request.currentUser?.sub,
        date: { $gte: range.from, $lt: range.to }
      }),
      UserModel.findById(request.currentUser?.sub)
    ])

    const summary = buildSummary({
      transactions,
      monthlyBudget: user?.monthlyBudget || 0
    })

    return { summary }
  })
}
