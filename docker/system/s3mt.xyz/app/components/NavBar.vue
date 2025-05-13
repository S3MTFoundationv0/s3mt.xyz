<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useWallet } from 'solana-wallets-vue'
import { Connection, PublicKey } from '@solana/web3.js'
import { useRuntimeConfig } from '#app'
import ThemedProgressBar from '~/components/ui/ThemedProgressBar.vue'
import { useTransactionHistory, type ParsedTransaction } from '~/composables/useTransactionHistory'

// Initialize Solana Wallets Vue
useSWV()

// Runtime config
const config = useRuntimeConfig()
const s3mtMint = config.public.s3mtMint
const tokenGoal = config.public.tokenGoal

// Wallet connection and RPC
const { publicKey, connected } = useWallet()
const connection = new Connection(config.public.solanaNetwork)

// Initialize transaction history
const { transactions, fetchTransactionHistory } = useTransactionHistory()

// Reactive balances
const tokenBalance = ref<number | null>(null)

// Fetch total token supply
async function fetchTokenBalance() {
  if (!s3mtMint) {
    tokenBalance.value = null
    return
  }
  try {
    const { value } = await connection.getTokenSupply(new PublicKey(s3mtMint))
    tokenBalance.value = 5000 ///value.uiAmount ?? 0
  } catch (e) {
    console.error('Error fetching total token supply', e)
    tokenBalance.value = null
  }
}

// Compute user's presale purchases
const userPurchasedAmount = computed(() => {
  if (!publicKey.value) {
    return 0
  }
  return transactions.value.reduce((sum, tx: ParsedTransaction) => {
    return tx.buyer === publicKey.value.toBase58() ? sum + (Number(tx.s3mtAmount) || 0) : sum
  }, 0)
})

// Determine glow color and intensity based on amount
const tokenGlowClass = computed(() => {
  const amount = userPurchasedAmount.value;
  if (amount >= tokenGoal) return 'glow-gold animate-pulse-fast'; 
  if (amount >= tokenGoal * 0.5) return 'glow-green animate-pulse-medium';
  if (amount >= tokenGoal * 0.25) return 'glow-purple animate-pulse-slow';
  return 'glow-blue';
});

// Compute user percentage
const userPercentage = computed(() => {
  const perc = (userPurchasedAmount.value / tokenGoal) * 100
  return Math.min(Math.max(perc, 0), 100)
})

// Lifecycle hooks
onMounted(() => {
  fetchTokenBalance()
  if (connected.value) fetchTransactionHistory()
})

watch(connected, (isConnected: boolean) => {
  if (isConnected) fetchTransactionHistory()
  else {
    transactions.value = []
  }
})
</script>

<template>
  <nav class="sticky top-0 z-50 bg-indigo-900 border-b border-indigo-700 bg-opacity-75 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex-shrink-0 flex items-center gap-3">
            <img class="h-10 w-auto" src="/logo.svg" alt="S3MT Icon" />
            <Logo size="sm" />
          </NuxtLink>

          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <NuxtLink to="/" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</NuxtLink>
              <NuxtLink to="/founders" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Presale</NuxtLink>
              <!--
              <NuxtLink to="/swap" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Swap</NuxtLink>
              -->
              <NuxtLink to="/whitepaper" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Whitepaper</NuxtLink>
              <NuxtLink to="/tokenomics" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Tokenomics</NuxtLink>
              <NuxtLink to="/team" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Team</NuxtLink>
              <a href="https://github.com/S3MTFoundationv0/s3mt.xyz" target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5">
                <svg class="h-5 w-5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <!-- Token amount display (always visible) -->
          <div v-if="tokenBalance !== null && !connected" class="token-display py-1 px-2.5 bg-indigo-950/90 rounded-md border border-indigo-800/70">
            <span class="text-white font-medium text-base">{{ tokenBalance.toFixed(1) }}</span>
          </div>
        
          <!-- Compact user balance for navbar -->
          <div v-if="connected">
            <div :class="[
              'token-balance-box flex flex-col py-2 px-4 bg-indigo-950/90 backdrop-blur-sm rounded-lg border border-indigo-800/70 shadow-lg',
              tokenGlowClass
            ]">
              <!-- Label and amount on top -->
              <div class="flex justify-between items-center mb-1">
                <span class="text-white leading-none">{{ userPurchasedAmount }}</span>
                / {{ tokenGoal }}
              </div>
              
              <!-- Progress bar and refresh on bottom -->
              <div class="flex items-center gap-2">
                <div class="flex-grow h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
                  <ThemedProgressBar 
                    :value="userPercentage" 
                    size="xs" 
                    :variant="userPurchasedAmount >= tokenGoal ? 'success' : 'info'"
                  />
                </div>
                
                <button 
                  @click="fetchTransactionHistory" 
                  class="text-gray-400 hover:text-white p-0.5 rounded-full hover:bg-indigo-800/30 flex-shrink-0"
                  title="Refresh your balance"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <WalletConnect />
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.token-balance-box {
  min-width: 160px;
  max-width: 200px;
  transition: all 0.3s ease;
}

.text-2xs {
  font-size: 0.65rem;
}

.glow-blue {
  box-shadow: 0 0 5px 0 rgba(79, 140, 255, 0.2);
}

.glow-purple {
  box-shadow: 0 0 8px 0 rgba(139, 92, 246, 0.3);
}

.glow-green {
  box-shadow: 0 0 12px 0 rgba(16, 185, 129, 0.4);
}

.glow-gold {
  box-shadow: 0 0 15px 0 rgba(251, 191, 36, 0.5);
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; box-shadow: 0 0 8px 0 rgba(139, 92, 246, 0.3); }
  50% { opacity: 0.95; box-shadow: 0 0 12px 2px rgba(139, 92, 246, 0.5); }
}

@keyframes pulse-medium {
  0%, 100% { opacity: 1; box-shadow: 0 0 12px 0 rgba(16, 185, 129, 0.4); }
  50% { opacity: 0.95; box-shadow: 0 0 15px 3px rgba(16, 185, 129, 0.6); }
}

@keyframes pulse-fast {
  0%, 100% { opacity: 1; box-shadow: 0 0 15px 0 rgba(251, 191, 36, 0.5); }
  50% { opacity: 0.95; box-shadow: 0 0 20px 5px rgba(251, 191, 36, 0.8); }
}

.animate-pulse-slow {
  animation: pulse-slow 3s infinite;
}

.animate-pulse-medium {
  animation: pulse-medium 2s infinite;
}

.animate-pulse-fast {
  animation: pulse-fast 1.5s infinite;
}
</style>