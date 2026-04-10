export function buildSummary({ transactions, monthlyBudget }) {
  const summary = {
    incomeTotal: 0,
    expenseTotal: 0,
    balance: 0,
    monthlyBudget,
    budgetExceeded: false,
    byCategory: {}
  }

  for (const transaction of transactions) {
    if (transaction.type === 'income') {
      summary.incomeTotal += transaction.amount
      continue
    }

    summary.expenseTotal += transaction.amount
    const category = transaction.category || 'Other'
    summary.byCategory[category] = (summary.byCategory[category] || 0) + transaction.amount
  }

  summary.balance = summary.incomeTotal - summary.expenseTotal
  summary.budgetExceeded = monthlyBudget > 0 && summary.expenseTotal > monthlyBudget

  return summary
}
