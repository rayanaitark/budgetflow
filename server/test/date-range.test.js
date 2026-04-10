import test from 'node:test'
import assert from 'node:assert/strict'
import { getMonthDateRange } from '../src/utils/date-range.js'

test('getMonthDateRange returns UTC boundaries', () => {
  const result = getMonthDateRange('2026-03')
  assert.ok(result)
  assert.equal(result.from.toISOString(), '2026-03-01T00:00:00.000Z')
  assert.equal(result.to.toISOString(), '2026-04-01T00:00:00.000Z')
})

test('getMonthDateRange returns null on invalid input', () => {
  assert.equal(getMonthDateRange('2026-13'), null)
  assert.equal(getMonthDateRange('abcd-ef'), null)
})
