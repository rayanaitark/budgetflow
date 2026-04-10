import test from 'node:test'
import assert from 'node:assert/strict'
import { buildSummary } from '../src/transactions/summary.js'

test('buildSummary computes totals and budget exceeded flag', () => {
  const result = buildSummary({
    monthlyBudget: 100,
    transactions: [
      { type: 'income', amount: 1800, category: 'Salary' },
      { type: 'expense', amount: 60, category: 'Food' },
      { type: 'expense', amount: 70, category: 'Food' },
      { type: 'expense', amount: 40, category: 'Transport' }
    ]
  })

  assert.equal(result.incomeTotal, 1800)
  assert.equal(result.expenseTotal, 170)
  assert.equal(result.balance, 1630)
  assert.equal(result.budgetExceeded, true)
  assert.deepEqual(result.byCategory, {
    Food: 130,
    Transport: 40
  })
})
