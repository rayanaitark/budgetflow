import { defineStore } from 'pinia'
import { api } from '../services/api'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    items: [],
    summary: null,
    loading: false,
    error: null
  }),
  actions: {
    async fetchTransactions(filters = {}) {
      this.loading = true
      this.error = null
      try {
        const result = await api.get('/transactions', filters)
        this.items = result.transactions
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async createTransaction(payload) {
      this.error = null
      try {
        await api.post('/transactions', payload)
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    async deleteTransaction(id) {
      this.error = null
      try {
        await api.delete(`/transactions/${id}`)
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    async fetchSummary(month) {
      this.loading = true
      this.error = null
      try {
        const result = await api.get('/transactions/summary', { month })
        this.summary = result.summary
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})
