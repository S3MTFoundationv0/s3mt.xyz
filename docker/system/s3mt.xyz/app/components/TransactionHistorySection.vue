<template>
  <div class="transaction-history-section">
    <div class="header">
      <h2>Transaction History</h2>
      <TransactionRefreshButton 
        :loading="loading" 
        @refresh="handleManualRefresh" 
      />
    </div>
    
    <div v-if="loading" class="loading">
      Loading transactions...
    </div>
    
    <div v-else-if="errorMsg" class="error">
      {{ errorMsg }}
    </div>
    
    <div v-else-if="transactions.length === 0" class="empty">
      No transactions found.
    </div>
    
    <div v-else class="transactions-container">
      <!-- Transaction stats -->
      <div class="stats-section">
        <div class="stat-item">
          <div class="stat-label">Total Transactions</div>
          <div class="stat-value">{{ statsMetrics.totalTransactions }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Total S3MT Purchased</div>
          <div class="stat-value">{{ statsMetrics.totalS3mtPurchased }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Total SOL Spent</div>
          <div class="stat-value">{{ statsMetrics.totalSolSpent }} SOL</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Total USDC Spent</div>
          <div class="stat-value">{{ statsMetrics.totalUsdcSpent }} USDC</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Avg Purchase Size</div>
          <div class="stat-value">{{ statsMetrics.avgPurchaseSize }} S3MT</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Last 24h Transactions</div>
          <div class="stat-value">{{ statsMetrics.last24HoursCount }}</div>
        </div>
      </div>
      
      <!-- Transactions list -->
      <div class="transactions-list">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Buyer</th>
              <th>Amount</th>
              <th>Cost</th>
              <th>Currency</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in transactions" :key="tx.signature">
              <td>{{ formatDate(tx.blockTime) }}</td>
              <td class="address">{{ shortenAddress(tx.buyer) }}</td>
              <td>{{ formatAmount(tx.s3mtAmount) }} S3MT</td>
              <td>{{ tx.cost }}</td>
              <td>{{ tx.currency }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTransactionHistory } from '~/composables/useTransactionHistory'
import TransactionRefreshButton from '~/components/TransactionRefreshButton.vue'

const {
  transactions,
  loading,
  errorMsg,
  fetchTransactionHistory,
  statsMetrics
} = useTransactionHistory()

// Initial data load is handled by the composable's auto-refresh
// Manual refresh handler for the refresh button
const handleManualRefresh = async () => {
  await fetchTransactionHistory()
}

// Format date from UNIX timestamp
function formatDate(timestamp: number | null | undefined) {
  if (!timestamp) return 'Unknown'
  return new Date(timestamp * 1000).toLocaleString()
}

// Shorten address for display
function shortenAddress(address: string | null) {
  if (!address) return 'Unknown'
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

// Format S3MT amount
function formatAmount(amount: string) {
  if (amount === 'N/A') return '0'
  try {
    return parseInt(amount).toLocaleString()
  } catch (e) {
    return amount
  }
}
</script>

<style scoped>
.transaction-history-section {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.loading, .error, .empty {
  text-align: center;
  padding: 2rem;
  background-color: #f7fafc;
  border-radius: 0.5rem;
}

.error {
  color: #e53e3e;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-item {
  background-color: #f7fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.transactions-list {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f7fafc;
}

th, td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  font-weight: 600;
  color: #4a5568;
}

.address {
  font-family: monospace;
}
</style> 