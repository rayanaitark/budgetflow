<template>
  <section class="card">
    <h2>Inscription</h2>
    <form @submit.prevent="onSubmit">
      <label>
        Username
        <input v-model="username" required />
      </label>
      <label>
        Email
        <input v-model="email" type="email" required />
      </label>
      <label>
        Mot de passe
        <input v-model="password" type="password" minlength="8" required />
      </label>
      <button :disabled="auth.loading" type="submit">Créer mon compte</button>
    </form>
    <p v-if="auth.error" class="error">{{ auth.error }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')

const onSubmit = async () => {
  try {
    await auth.register({ username: username.value, email: email.value, password: password.value })
    await auth.login({ email: email.value, password: password.value })
    router.push('/dashboard')
  } catch {
    // géré dans le store
  }
}
</script>

<style scoped>
.card { max-width: 420px; }
label { display: flex; flex-direction: column; gap: 0.35rem; margin: 0.7rem 0; }
input { padding: 0.5rem; }
.error { color: #dc2626; }
</style>
