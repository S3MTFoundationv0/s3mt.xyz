<script setup lang="ts">
import { useWallet } from 'solana-wallets-vue'
import { PublicKey } from '@solana/web3.js'
import { useTransactionHistory, type ParsedTransaction } from '~/composables/useTransactionHistory'

useHead({
  title: 'Transaction History',
  meta: [{ name: 'description', content: 'View presale transaction history.' }]
})

const { connected, publicKey } = useWallet()
const { transactions, loading, errorMsg, statsMetrics, fetchTransactionHistory } = useTransactionHistory()

const displayTransactions = computed(() => {
  const currentUserKey = publicKey.value;
  return transactions.value.map((tx: ParsedTransaction) => ({
    ...tx,
    isUserTransaction: !!(currentUserKey && tx.buyer && new PublicKey(tx.buyer).equals(currentUserKey))
  }));
});

function formatTimestamp(unixTimestamp: number | null | undefined): string {
  if (unixTimestamp === null || typeof unixTimestamp === 'undefined') return 'N/A'
  return new Date(unixTimestamp * 1000).toLocaleString()
}

function truncateKey(key: string | null | undefined): string {
  if (!key) return 'N/A'
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`
}
</script>

<template>
  <div class="mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
    <!-- Enhanced Header with Gradient -->
    <div class="mb-12 text-center">
      <h1 class="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600">
        Transaction History
      </h1>
      <p class="text-gray-400 max-w-2xl mx-auto">
        Transparent, immutable record of all S3MT presale transactions on the Solana blockchain.
      </p>
    </div>

    <!-- Stats Dashboard -->
    <div v-if="!loading && displayTransactions.length > 0" class="mb-10 animate__animated animate__fadeIn">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Total Transactions Card -->
        <div class="bg-gray-800/70 rounded-xl p-5 border border-gray-700/50 shadow-lg backdrop-blur-sm overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 opacity-50 transition-opacity duration-200 group-hover:opacity-70"></div>
          <div class="relative z-10">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-gray-400 text-sm font-medium mb-1">Total Transactions</h3>
                <p class="text-3xl font-bold text-white">{{ statsMetrics.totalTransactions }}</p>
              </div>
              <div class="bg-indigo-500/20 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div class="mt-2 text-xs text-gray-500">
              <span class="text-green-400">{{ statsMetrics.last24HoursCount }}</span> in the last 24 hours
            </div>
          </div>
        </div>

        <!-- Total S3MT Purchased Card -->
        <div class="bg-gray-800/70 rounded-xl p-5 border border-gray-700/50 shadow-lg backdrop-blur-sm overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-green-600/10 to-blue-600/10 opacity-50 transition-opacity duration-200 group-hover:opacity-70"></div>
          <div class="relative z-10">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-gray-400 text-sm font-medium mb-1">Total S3MT Purchased</h3>
                <p class="text-3xl font-bold text-white">{{ statsMetrics.totalS3mtPurchased }}</p>
              </div>
              <div class="bg-green-500/20 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="mt-2 text-xs text-gray-500">
              <span class="text-green-400">{{ statsMetrics.avgPurchaseSize }}</span> tokens average per transaction
            </div>
          </div>
        </div>

        <!-- Total Value Card -->
        <div class="bg-gray-800/70 rounded-xl p-5 border border-gray-700/50 shadow-lg backdrop-blur-sm overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-50 transition-opacity duration-200 group-hover:opacity-70"></div>
          <div class="relative z-10">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-gray-400 text-sm font-medium mb-1">Total Investment</h3>
                <div class="flex items-baseline">
                  <p class="text-3xl font-bold text-white mr-3">{{ statsMetrics.totalSolSpent }} SOL</p>
                  <p class="text-lg font-medium text-gray-400">{{ statsMetrics.totalUsdcSpent }} USDC</p>
                </div>
              </div>
              <div class="bg-purple-500/20 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="mt-2 text-xs text-gray-500 flex items-center">
              <span class="bg-purple-900/50 px-2 py-1 rounded text-purple-300 mr-2">SOL</span>
              <span class="bg-blue-900/50 px-2 py-1 rounded text-blue-300">USDC</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center text-gray-400 my-16">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-12 w-12 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <div class="relative px-8 py-6 backdrop-blur-sm bg-gray-800/70 rounded-xl border border-gray-700/50 shadow-lg max-w-lg">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 opacity-50 rounded-xl"></div>
          <div class="relative z-10">
            <span class="text-xl text-indigo-300 block mb-2">Loading Transaction History...</span>
            <p class="text-gray-500 animate-pulse">Fetching from Solana blockchain</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="errorMsg" class="text-center my-16">
      <div class="flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div class="relative px-8 py-6 backdrop-blur-sm bg-gray-800/70 rounded-xl border border-red-700/50 shadow-lg max-w-lg overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-900/10 opacity-50 rounded-xl"></div>
          <div class="relative z-10">
            <h3 class="text-xl font-semibold text-red-400 mb-2">Error Loading Transactions</h3>
            <p class="text-red-300/90">{{ errorMsg }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="displayTransactions.length > 0" class="relative">
      <!-- Glass-like container with subtle gradient border -->
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-xl blur-xl opacity-30"></div>
      <div class="relative bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-xl">
        <!-- Table Header Stats -->
        <div class="p-4 border-b border-gray-700/70 bg-gray-800/90">
          <div class="flex flex-wrap justify-between items-center gap-4">
            <div class="flex items-center gap-4 text-gray-300">
              <div>
                <span class="text-sm font-medium">Total Transactions:</span>
                <span class="text-xl ml-2 font-bold text-white">{{ displayTransactions.length }}</span>
              </div>
              <button
                @click="fetchTransactionHistory"
                :disabled="loading"
                :class="['relative overflow-hidden group h-9 w-9 flex items-center justify-center rounded-lg bg-gray-800/90 border border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed', loading ? 'btn-loading' : '']"
                title="Refresh History"
              >
                <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <svg v-if="loading" class="relative z-10 animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="relative z-10 h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.357-2a8.001 8.001 0 0015.357-2m0 0H15" />
                </svg>
              </button>
            </div>
            <div v-if="connected" class="text-sm text-indigo-300">
              <span class="mr-2 text-gray-400">Connected:</span>
              <span class="font-mono bg-indigo-900/50 py-1 px-2 rounded-md">{{ truncateKey(publicKey?.toBase58()) }}</span>
            </div>
          </div>
        </div>

        <!-- Enhanced Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-700/70">
            <thead class="bg-gray-800/90">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Buyer</th>
                <th scope="col" class="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Amount (S3MT)</th>
                <th scope="col" class="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Cost</th>
                <th scope="col" class="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Transaction</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700/50">
              <tr
                v-for="tx in displayTransactions"
                :key="tx.signature"
                :class="{'bg-indigo-900/40 hover:bg-indigo-800/50': tx.isUserTransaction, 'hover:bg-gray-700/40': !tx.isUserTransaction}"
                class="transition-colors duration-200"
              >
                <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-300">
                  {{ formatTimestamp(tx.blockTime) }}
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                  <div class="flex items-center">
                    <div v-if="tx.isUserTransaction" class="h-2 w-2 rounded-full bg-green-400 mr-2" title="Your transaction"></div>
                    <span class="text-sm font-mono text-gray-300" :title="tx.buyer ?? 'N/A'">
                      {{ truncateKey(tx.buyer) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-right">
                  <span class="text-sm font-medium text-green-400">{{ tx.s3mtAmount }}</span>
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end">
                    <span class="text-sm font-medium text-gray-200 mr-2">{{ tx.cost }}</span>
                    <span class="text-xs font-medium px-2 py-1 rounded-md" 
                      :class="tx.currency === 'SOL' ? 'bg-purple-800/50 text-purple-300' : 'bg-blue-800/50 text-blue-300'">
                      {{ tx.currency }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-center">
                  <a
                    :href="`https://solscan.io/tx/${tx.signature}?cluster=devnet`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-150"
                    :title="tx.signature"
                  >
                    <span class="mr-1 text-sm">{{ truncateKey(tx.signature) }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else class="text-center my-16">
      <div class="flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <div class="relative px-8 py-6 backdrop-blur-sm bg-gray-800/70 rounded-xl border border-gray-700/50 shadow-lg max-w-lg">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 opacity-50 rounded-xl"></div>
          <div class="relative z-10">
            <p class="text-xl text-gray-300 mb-2">No transactions found yet.</p>
            <p class="text-gray-500">Be the first to participate in the presale!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add animation classes for stats cards */
@import 'animate.css';

/* Add some subtle animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
}

.btn-loading {
  animation: pulse 1.5s infinite;
}

tbody tr {
  animation: fadeIn 0.3s ease-out;
  animation-fill-mode: both;
}

tbody tr:nth-child(1) { animation-delay: 0.05s; }
tbody tr:nth-child(2) { animation-delay: 0.1s; }
tbody tr:nth-child(3) { animation-delay: 0.15s; }
tbody tr:nth-child(4) { animation-delay: 0.2s; }
tbody tr:nth-child(5) { animation-delay: 0.25s; }
tbody tr:nth-child(6) { animation-delay: 0.3s; }
tbody tr:nth-child(7) { animation-delay: 0.35s; }
tbody tr:nth-child(8) { animation-delay: 0.4s; }
tbody tr:nth-child(9) { animation-delay: 0.45s; }
tbody tr:nth-child(10) { animation-delay: 0.5s; }

/* Add hover effects for stats cards */
.grid > div {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.grid > div:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}
</style> 