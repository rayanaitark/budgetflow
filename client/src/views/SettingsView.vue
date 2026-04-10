<template>
  <section class="card">
    <h2>Budget mensuel</h2>
    <form @submit.prevent="onSubmit">
      <label>
        Budget (€)
        <input v-model.number="monthlyBudget" type="number" min="0" step="0.01" required />
      </label>
      <button type="submit" :disabled="auth.loading">Enregistrer</button>
    </form>
    <p v-if="success" class="success">Budget mis à jour.</p>
    <p v-if="auth.error" class="error">{{ auth.error }}</p>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const monthlyBudget = ref(auth.user?.monthlyBudget || 0)
const success = ref(false)

watch(
  () => auth.user,
  (user) => {
    monthlyBudget.value = user?.monthlyBudget || 0
  },
  { immediate: true }
)

const onSubmit = async () => {
  success.value = false
  try {
    await auth.updateBudget(Number(monthlyBudget.value))
    success.value = true
  } catch {
    // géré dans le store
  }
}
</script>

<style scoped>
.card { max-width: 420px; }
label { display: flex; flex-direction: column; gap: 0.35rem; margin: 0.7rem 0; }
input { padding: 0.5rem; }
.success { color: #15803d; }
.error { color: #dc2626; }
</style>
