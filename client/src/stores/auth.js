import { defineStore } from 'pinia'
import { api } from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    initialized: false
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user)
  },
  actions: {
    async register(payload) {
      this.loading = true
      this.error = null
      try {
        await api.post('/auth/register', payload)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    async login(payload) {
      this.loading = true
      this.error = null
      try {
        const result = await api.post('/auth/login', payload)
        this.user = result.user
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    async fetchCurrentUser() {
      this.loading = true
      try {
        const result = await api.get('/users/me')
        this.user = result.user
      } catch {
        this.user = null
      } finally {
        this.loading = false
        this.initialized = true
      }
    },
    async updateBudget(monthlyBudget) {
      this.error = null
      try {
        const result = await api.patch('/users/me/budget', { monthlyBudget })
        this.user = result.user
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    async logout() {
      await api.post('/auth/logout', {})
      this.user = null
    }
  }
})
