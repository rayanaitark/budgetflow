export function getMonthDateRange(monthParam) {
  const now = new Date()
  const [year, month] = (monthParam || `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`)
    .split('-')
    .map(Number)

  if (!year || !month || month < 1 || month > 12) {
    return null
  }

  const from = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0))
  const to = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0))

  return { from, to }
}
