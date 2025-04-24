<template>
  <div id="invest" class="relative mb-8 animate__animated animate__fadeIn animate__faster">
    <!-- Background Gradient Effect -->
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-500/20 to-indigo-700/20 rounded-xl blur-xl opacity-30"></div>

    <!-- Glass Container -->
    <div class="relative bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-xl">
      <!-- Form Header Stats -->
      <div class="p-5 border-b border-gray-700/70 bg-gray-800/90 flex justify-between items-center">
        <div>
          <h3 class="text-xl font-semibold text-white">Purchase S3MT Tokens</h3>
          <p class="text-gray-400 text-sm">Current Price: {{ formattedTokenPrice }}</p>
        </div>
        <div v-if="connected" class="text-sm text-green-400 flex items-center">
          <span class="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
          <span>Wallet Connected</span>
        </div>
        <div v-else class="text-sm text-yellow-500 flex items-center">
          <span class="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
          <span>Wallet Not Connected</span>
        </div>
      </div>

      <!-- Wallet Connection Prompt (shown when wallet is not connected) -->
      <div v-if="!connected" class="p-6 animate__animated animate__fadeIn animate__faster">
        <div class="bg-indigo-900/30 border border-indigo-700/50 rounded-lg p-6 shadow-lg mb-4">
          <svg class="h-12 w-12 text-indigo-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h4 class="text-xl font-semibold text-white mb-2 text-center">Connect Your Wallet</h4>
          <p class="text-gray-300 mb-4 text-center">Please connect your Solana wallet to purchase S3MT tokens.</p>
          <div class="flex justify-center">
            <WalletConnect class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg py-3 px-6 shadow-lg transition-all duration-200" />
          </div>
        </div>
      </div>

      <!-- Form Body with Enhanced Controls (shown when wallet is connected) -->
      <div v-else class="p-6 space-y-6 animate__animated animate__fadeIn animate__faster">
        <!-- Currency Selection with Balance Display -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Select Currency</label>
          <div class="grid grid-cols-2 gap-4">
            <div
              @click="updateCurrency('USDC')"
              :class="[
                'flex items-center justify-center cursor-pointer p-3 rounded-lg border transition-all',
                currency === 'USDC'
                  ? 'bg-blue-900/40 border-blue-500/50 shadow-md shadow-blue-500/10'
                  : 'bg-gray-800/70 border-gray-700 hover:bg-gray-700/50'
              ]"
            >
              <span class="text-blue-300 text-lg mr-2">$</span>
              <div class="flex flex-col flex-1">
                <span :class="currency === 'USDC' ? 'text-white' : 'text-gray-400'">USDC</span>
                <span class="text-xs text-gray-500">1:1 with USD</span>
                <span v-if="balances.usdc !== null" class="text-xs mt-1" :class="currency === 'USDC' ? 'text-blue-300' : 'text-gray-400'">
                  Balance: {{ formatBalance(balances.usdc, 'USDC') }}
                </span>
                <span v-else-if="isLoadingBalances" class="text-xs mt-1 text-gray-400">
                  Loading...
                </span>
              </div>
            </div>
            <div
              @click="updateCurrency('SOL')"
              :class="[
                'flex items-center justify-center cursor-pointer p-3 rounded-lg border transition-all relative',
                currency === 'SOL'
                  ? 'bg-purple-900/40 border-purple-500/50 shadow-md shadow-purple-500/10'
                  : 'bg-gray-800/70 border-gray-700 hover:bg-gray-700/50'
              ]"
            >
              <svg class="h-5 w-5 mr-2" :class="currency === 'SOL' ? 'text-purple-300' : 'text-gray-500'" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M93.94 42.86H13.72a2.62 2.62 0 0 1-1.85-4.47L31.09 19.17a2.62 2.62 0 0 1 1.85-.77h80.22a2.62 2.62 0 0 1 1.85 4.47L95.79 42.09a2.62 2.62 0 0 1-1.85.77Z" fill="currentColor"/>
                <path d="M93.94 109.6H13.72a2.62 2.62 0 0 1-1.85-4.47l19.22-19.22a2.62 2.62 0 0 1 1.85-.76h80.22a2.62 2.62 0 0 1 1.85 4.47L95.79 108.83a2.62 2.62 0 0 1-1.85.77Z" fill="currentColor"/>
                <path d="M114.6 76.5H34.38a2.62 2.62 0 0 1-1.85-4.47l19.22-19.22a2.62 2.62 0 0 1 1.85-.77H114.6a2.62 2.62 0 0 1 1.85 4.47L97.23 75.73a2.62 2.62 0 0 1-1.85.77Z" fill="currentColor"/>
              </svg>
              <div class="flex flex-col flex-1">
                <span :class="currency === 'SOL' ? 'text-white' : 'text-gray-400'">SOL</span>
                <span class="text-xs text-gray-500">${{ solPrice.toFixed(2) }} per SOL</span>
                <span v-if="balances.sol !== null" class="text-xs mt-1" :class="currency === 'SOL' ? 'text-purple-300' : 'text-gray-400'">
                  Balance: {{ formatBalance(balances.sol, 'SOL') }}
                </span>
                <span v-else-if="isLoadingBalances" class="text-xs mt-1 text-gray-400">
                  Loading...
                </span>
              </div>
              <div v-if="isFetchingPrice && currency === 'SOL'" class="absolute top-1 right-1">
                <svg class="animate-spin h-3 w-3 text-purple-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Max Button -->
        <div v-if="canUseMax && showMaxButton" class="text-right">
          <button 
            @click="useMaxBalance" 
            class="text-xs text-indigo-400 hover:text-indigo-300 transition-colors underline"
          >
            Use Max Balance
          </button>
        </div>

        <!-- Token Amount Input -->
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-300 mb-2">Amount of S3MT Tokens</label>
          <div class="relative mt-1">
            <input
              id="amount"
              type="number"
              :value="amount"
              @input="updateAmount"
              min="0"
              step="0.01"
              placeholder="Enter amount"
              class="block w-full bg-gray-800 border-2 border-gray-700 focus:border-indigo-500 text-white rounded-lg p-3 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span class="text-gray-400">S3MT</span>
            </div>
          </div>

          <!-- Token Visualization -->
          <div v-if="amount > 0" class="mt-3 p-3 bg-gray-900/60 rounded-lg border border-gray-700/40 flex items-center justify-center overflow-hidden">
            <div class="token-visualization">
              <div v-for="i in Math.min(8, Math.ceil(amount / 1000))" :key="i"
                class="token-symbol"
                :style="`--delay: ${i * 0.1}s`"
              >S3</div>
              <span v-if="amount > 8000" class="text-gray-400 ml-2">+{{ Math.floor((amount - 8000) / 1000) }} more</span>
            </div>
          </div>
        </div>

        <!-- Summary Card -->
        <div class="bg-gray-800/70 rounded-lg p-4 border border-gray-700/50">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-400">Price per token:</span>
            <span class="text-white font-medium">{{ formattedTokenPrice }}</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-400">Total tokens:</span>
            <span class="text-white font-medium">{{ amount > 0 ? amount.toLocaleString() : '0' }}</span>
          </div>
          <div class="h-px bg-gray-700 my-3"></div>
          <div class="flex justify-between items-center">
            <span class="text-gray-300 font-medium">Total Cost:</span>
            <div class="flex items-center">
              <span class="text-xl font-bold text-white">{{ formattedTotalCost }}</span>
              <span v-if="currency === 'SOL'" class="ml-2 text-xs text-gray-400">(≈ ${{ totalCostInUsd.toFixed(2) }})</span>
            </div>
          </div>

          <!-- Insufficient Balance Warning -->
          <div v-if="insufficientBalance" class="mt-3 text-sm text-yellow-500 flex items-center">
            <svg class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            Insufficient balance
          </div>
        </div>

        <!-- Submit Button -->
        <button
          @click="purchase"
          :disabled="!isValid || loading || insufficientBalance"
          class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg py-3 shadow-lg disabled:opacity-50 transition-all duration-200 relative overflow-hidden group"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>Purchase Tokens</span>
          <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-400/0 via-white/10 to-indigo-400/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </button>

        <!-- Status Feedback -->
        <div v-if="errorMsg" class="mb-6 animate__animated animate__fadeIn animate__faster">
          <div class="bg-red-900/30 border border-red-700/50 rounded-lg p-4 shadow-lg">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-300">{{ errorMsg }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="success" class="mb-6 animate__animated animate__fadeIn animate__faster">
          <div class="bg-green-900/30 border border-green-700/50 rounded-lg p-4 shadow-lg">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm text-green-300 font-medium">Purchase successful!</p>
                <!-- Transaction Info -->
                <div v-if="transactionSignature" class="mt-2 p-3 bg-gray-800/80 rounded-md border border-gray-700/50">
                  <p class="text-xs text-gray-400 mb-1">Transaction ID:</p>
                  <div class="flex items-center">
                    <code class="text-xs font-mono text-indigo-300 truncate mr-2 flex-1">{{ transactionSignature }}</code>
                    <a
                      :href="`https://solscan.io/tx/${transactionSignature}?cluster=devnet`"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-indigo-400 hover:text-indigo-300 transition-colors flex-shrink-0"
                    >
                      <span class="sr-only">View on Solscan</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref, watch } from 'vue'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

const props = defineProps({
  currency: { type: String, required: true },
  solPrice: { type: Number, required: true },
  isFetchingPrice: { type: Boolean, required: true },
  amount: { type: Number, required: true },
  isValid: { type: Boolean, required: true },
  formattedTotalCost: { type: String, required: true },
  formattedTokenPrice: { type: String, required: true },
  totalCostInUsd: { type: Number, required: true },
  connected: { type: Boolean, required: true },
  loading: { type: Boolean, required: true },
  success: { type: Boolean, required: true },
  errorMsg: { type: String, required: true },
  transactionSignature: { type: String, default: null },
  walletBalances: { 
    type: Object, 
    default: () => ({ 
      sol: null, 
      usdc: null 
    }) 
  },
  totalCost: { type: Number, required: true }
})

const emit = defineEmits(['purchase', 'update:currency', 'update:amount'])

// Local state for balances
const balances = ref({
  sol: null as number | null,
  usdc: null as number | null
})

const isLoadingBalances = ref(true)
const showMaxButton = ref(true)

// Watch for wallet connection and balance updates
watch(() => props.connected, (isConnected) => {
  if (isConnected) {
    fetchBalances()
  } else {
    // Reset balances when wallet disconnected
    balances.value = { sol: null, usdc: null }
  }
})

// Watch for wallet balance updates from parent
watch(() => props.walletBalances, (newBalances) => {
  if (newBalances) {
    balances.value = { ...newBalances }
    isLoadingBalances.value = false
  }
}, { immediate: true })

// Watch for currency changes to fetch the right balance
watch(() => props.currency, () => {
  if (props.connected) {
    fetchBalances()
  }
})

function updateCurrency(val: string) {
  emit('update:currency', val)
}

function updateAmount(event: Event) {
  const target = event.target as HTMLInputElement
  const val = parseFloat(target.value)
  emit('update:amount', isNaN(val) ? 0 : val)
}

function purchase() {
  emit('purchase')
}

function fetchBalances() {
  isLoadingBalances.value = true;
  // This event will be handled by the parent component to fetch wallet balances
  emit('fetch-balances');
  
  // Safety timeout to prevent infinite loading state
  setTimeout(() => {
    if (isLoadingBalances.value) {
      console.log('Balance fetch timeout - resetting loading state');
      isLoadingBalances.value = false;
    }
  }, 5000); // 5 second timeout
}

function formatBalance(balance: number | null, type: 'SOL' | 'USDC') {
  if (balance === null) return '0'
  
  if (type === 'SOL') {
    return `${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL`
  } else {
    return `${(balance / 1000000).toFixed(2)} USDC`
  }
}

function useMaxBalance() {
  if (!canUseMax.value) return
  
  if (props.currency === 'SOL') {
    // Leave some SOL for transaction fees
    const maxSol = Math.max(0, (balances.value.sol || 0) / LAMPORTS_PER_SOL - 0.01)
    const maxTokens = Math.floor(maxSol * props.solPrice / 0.10) // 0.10 is the token price in USD
    emit('update:amount', maxTokens)
  } else {
    // USDC
    const maxUsdc = (balances.value.usdc || 0) / 1000000 // Convert from USDC base units
    const maxTokens = Math.floor(maxUsdc / 0.10) // 0.10 is the token price in USD
    emit('update:amount', maxTokens)
  }
}

// Computed values
const canUseMax = computed(() => {
  if (!props.connected) return false
  
  const relevantBalance = props.currency === 'SOL' 
    ? balances.value.sol
    : balances.value.usdc
    
  return relevantBalance !== null && relevantBalance > 0
})

const insufficientBalance = computed(() => {
  if (!props.connected || props.amount <= 0) return false
  
  if (props.currency === 'SOL') {
    // Convert totalCost to lamports for comparison
    const costInLamports = props.totalCost * LAMPORTS_PER_SOL
    return (balances.value.sol || 0) < costInLamports
  } else {
    // Convert totalCost to USDC base units for comparison
    const costInUsdcUnits = props.totalCostInUsd * 1000000
    return (balances.value.usdc || 0) < costInUsdcUnits
  }
})
</script>

<style>
/* Remove number input spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Token visualization animations */
.token-visualization {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.token-symbol {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  margin: 0 3px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 50%;
  color: white;
  font-weight: bold;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
  animation: pulse 2s infinite;
  animation-delay: var(--delay, 0s);
}

/* Custom animation speed for faster animate.css animations */
.animate__faster {
  animation-duration: 0.5s !important;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>