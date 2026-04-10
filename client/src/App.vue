<template>
  <div class="container">
    <header>
      <div>
        <h1>BudgetFlow</h1>
        <p class="subtitle">Gestion de budget personnel</p>
      </div>
      <nav>
        <RouterLink v-if="auth.isAuthenticated" to="/dashboard">Dashboard</RouterLink>
        <RouterLink v-if="auth.isAuthenticated" to="/history">Historique</RouterLink>
        <RouterLink v-if="auth.isAuthenticated" to="/settings">Budget</RouterLink>
        <RouterLink v-if="!auth.isAuthenticated" to="/login">Login</RouterLink>
        <RouterLink v-if="!auth.isAuthenticated" to="/register">Register</RouterLink>
        <button v-if="auth.isAuthenticated" @click="onLogout">Logout</button>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
const router = useRouter()

const onLogout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.container {
  max-width: 920px;
  margin: 0 auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.8rem;
}
.subtitle {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}
nav {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
a {
  text-decoration: none;
  color: #2563eb;
}
button {
  padding: 0.35rem 0.8rem;
}
main {
  margin-top: 1rem;
}
</style>
