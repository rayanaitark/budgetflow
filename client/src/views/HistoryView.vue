<template>
  <section>
    <h2>Historique</h2>

    <form class="filters" @submit.prevent="loadData">
      <label>
        Type
        <select v-model="filters.type">
          <option value="">Tous</option>
          <option value="income">Revenus</option>
          <option value="expense">Dépenses</option>
        </select>
      </label>
      <label>
        De
        <input v-model="filters.from" type="date" />
      </label>
      <label>
        À
        <input v-model="filters.to" type="date" />
      </label>
      <label>
        Catégorie
        <input v-model="filters.category" placeholder="Ex: Food" />
      </label>
      <button type="submit">Filtrer</button>
    </form>

    <p v-if="txStore.error" class="error">{{ txStore.error }}</p>
    <p v-if="txStore.loading">Chargement…</p>
    <p v-else-if="!txStore.items.length">Aucune transaction trouvée.</p>

    <table v-else>
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Catégorie</th>
          <th>Montant</th>
          <th>Note</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tx in txStore.items" :key="tx.id">
          <td>{{ formatDate(tx.date) }}</td>
          <td>{{ tx.type }}</td>
          <td>{{ tx.category }}</td>
          <td>{{ formatAmount(tx.amount) }}</td>
          <td>{{ tx.note || '-' }}</td>
          <td><button @click="onDelete(tx.id)">Supprimer</button></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useTransactionsStore } from '../stores/transactions'

const txStore = useTransactionsStore()
const filters = reactive({
  type: '',
  from: '',
  to: '',
  category: ''
})

const formatAmount = (value) => `${Number(value || 0).toFixed(2)} €`
const formatDate = (value) => new Date(value).toLocaleDateString('fr-FR')

const loadData = async () => {
  await txStore.fetchTransactions(filters)
}

const onDelete = async (id) => {
  try {
    await txStore.deleteTransaction(id)
    await loadData()
  } catch {
    // erreur déjà gérée
  }
}

onMounted(loadData)
</script>

<style scoped>
.filters { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; margin-bottom: 1rem; }
label { display: flex; flex-direction: column; gap: 0.3rem; }
input, select { padding: 0.4rem; }
table { width: 100%; border-collapse: collapse; }
th, td { border-bottom: 1px solid #e2e8f0; padding: 0.5rem; text-align: left; }
.error { color: #dc2626; }
</style>
