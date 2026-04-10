<template>
  <section>
    <h2>Dashboard</h2>

    <form class="transaction-form" @submit.prevent="onCreateTransaction">
      <h3>Nouvelle transaction</h3>
      <div class="grid">
        <label>
          Type
          <select v-model="form.type" required>
            <option value="income">Revenu</option>
            <option value="expense">Dépense</option>
          </select>
        </label>
        <label>
          Montant
          <input v-model.number="form.amount" type="number" min="0.01" step="0.01" required />
        </label>
        <label>
          Catégorie
          <input v-model="form.category" required />
        </label>
        <label>
          Date
          <input v-model="form.date" type="date" required />
        </label>
      </div>
      <label>
        Note
        <input v-model="form.note" />
      </label>
      <button :disabled="txStore.loading" type="submit">Ajouter</button>
      <p v-if="createSuccess" class="success">Transaction ajoutée.</p>
      <p v-if="txStore.error" class="error">{{ txStore.error }}</p>
    </form>

    <div v-if="txStore.loading">Chargement du summary…</div>
    <div v-else-if="txStore.summary" class="summary-grid">
      <article class="card">
        <h4>Revenus mois</h4>
        <p>{{ formatAmount(txStore.summary.incomeTotal) }}</p>
      </article>
      <article class="card">
        <h4>Dépenses mois</h4>
        <p>{{ formatAmount(txStore.summary.expenseTotal) }}</p>
      </article>
      <article class="card">
        <h4>Solde</h4>
        <p>{{ formatAmount(txStore.summary.balance) }}</p>
      </article>
      <article class="card" :class="{ alert: txStore.summary.budgetExceeded }">
        <h4>Budget mensuel</h4>
        <p>{{ formatAmount(txStore.summary.monthlyBudget) }}</p>
        <p v-if="txStore.summary.budgetExceeded" class="error">Budget dépassé ce mois-ci.</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useTransactionsStore } from '../stores/transactions'

const txStore = useTransactionsStore()
const createSuccess = ref(false)

const today = new Date().toISOString().slice(0, 10)
const form = reactive({
  type: 'expense',
  amount: null,
  category: '',
  date: today,
  note: ''
})

const month = `${new Date().getUTCFullYear()}-${String(new Date().getUTCMonth() + 1).padStart(2, '0')}`

const formatAmount = (value) => `${Number(value || 0).toFixed(2)} €`

const refreshSummary = () => txStore.fetchSummary(month)

const onCreateTransaction = async () => {
  createSuccess.value = false
  try {
    await txStore.createTransaction({
      type: form.type,
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      note: form.note
    })
    form.amount = null
    form.category = ''
    form.note = ''
    createSuccess.value = true
    await refreshSummary()
  } catch {
    // erreur déjà gérée
  }
}

onMounted(async () => {
  await refreshSummary()
})
</script>

<style scoped>
.transaction-form { border: 1px solid #e2e8f0; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; }
.grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; }
label { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 0.7rem; }
input, select { padding: 0.4rem; }
.summary-grid { display: grid; gap: 0.75rem; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.card { border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.8rem; }
.alert { border-color: #ef4444; }
.error { color: #dc2626; }
.success { color: #15803d; }
</style>
