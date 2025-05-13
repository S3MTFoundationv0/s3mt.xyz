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

// State for popovers (moved to the top for visibility)
const showFounderInfo = ref(false)
const showFounderInfoMobile = ref(false)

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

// Add console logging to help with debugging
function toggleMobileInfo() {
  showFounderInfoMobile.value = !showFounderInfoMobile.value
  console.log('Mobile info toggled:', showFounderInfoMobile.value)
}

// Lifecycle hooks
onMounted(() => {
  fetchTokenBalance()
  if (connected.value) fetchTransactionHistory()

  // Close popover when clicking outside
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    
    // Desktop popover
    const popover = document.querySelector('.founder-popover')
    const infoButton = document.querySelector('.token-balance-box button[title="Founder Benefits Info"]')
    
    if (popover && 
        !popover.contains(target) && 
        infoButton && 
        !infoButton.contains(target)) {
      showFounderInfo.value = false
    }
    
    // The mobile popover click-outside handling is simpler - we'll use stopPropagation instead
  })
})

watch(connected, (isConnected: boolean) => {
  if (isConnected) fetchTransactionHistory()
  else {
    transactions.value = []
  }
})
</script>

<template>
  <div>
    <nav class="sticky top-0 z-50 bg-indigo-900 border-b border-indigo-700 bg-opacity-75 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Left side with logo and navigation -->
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
          
          <!-- Right side with token info and wallet -->
          <div class="flex items-center space-x-3">
            <!-- Token amount display (always visible but only on desktop) -->
            <div v-if="tokenBalance !== null && !connected" class="hidden md:block token-display py-1 px-2.5 bg-indigo-950/90 rounded-md border border-indigo-800/70">
              <span class="text-white font-medium text-base">{{ tokenBalance.toFixed(1) }}</span>
            </div>
        
            <!-- Desktop balance widget (only visible on md+ screens) -->
            <div v-if="connected" class="hidden md:block">
              <div :class="[
                'token-balance-box relative flex flex-col py-2 px-4 bg-indigo-950/90 backdrop-blur-sm rounded-lg border border-indigo-800/70 shadow-lg',
                tokenGlowClass
              ]">
                <!-- Popover trigger -->
                <button 
                  @click="showFounderInfo = !showFounderInfo"
                  class="absolute top-0 right-0 -mt-1 -mr-1 text-purple-300 hover:text-purple-200"
                  title="Founder Benefits Info"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                <!-- Founder benefits popover -->
                <div v-if="showFounderInfo" class="founder-popover absolute right-0 top-full mt-2 bg-indigo-900/95 backdrop-blur-sm p-3 rounded-lg border border-indigo-700 shadow-xl z-50 w-64 animate-fade-in">
                  <div class="flex justify-between items-start">
                    <h4 class="text-purple-300 font-medium text-sm">Founder Benefits</h4>
                    <button @click="showFounderInfo = false" class="text-gray-400 hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  </div>
                  <div class="mt-2">
                    <p class="text-white text-xs mb-2">
                      Reach the <span class="text-green-400 font-medium">{{ tokenGoal }}</span> token goal to unlock:
                    </p>
                    <ul class="text-xs space-y-1.5">
                      <li class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 text-purple-400 mt-0.5 mr-1">
                          <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                        </svg>
                        <span class="text-gray-200">Become an official <span class="text-purple-300 font-medium">S3MT Founder</span></span>
                      </li>
                      <li class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 text-purple-400 mt-0.5 mr-1">
                          <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                        </svg>
                        <span class="text-gray-200">Receive a limited edition <span class="text-blue-300 font-medium">Founder's NFT</span></span>
                      </li>
                      <li class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 text-purple-400 mt-0.5 mr-1">
                          <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                        </svg>
                        <span class="text-gray-200">Unlock <span class="text-green-300 font-medium">exclusive benefits</span> & early platform access</span>
                      </li>
                    </ul>
                    <div class="mt-3 pt-2 border-t border-indigo-700">
                      <a href="/founders" class="inline-block text-xs text-purple-300 hover:text-purple-200 font-medium">
                        Learn more about Founder Benefits →
                      </a>
                    </div>
                  </div>
                </div>
                
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

    <!-- Mobile balance widget (full width under navbar) -->
    <div v-if="connected" class="md:hidden w-full bg-indigo-950 border-b border-indigo-800/70">
      <div :class="[
        'relative flex items-center justify-between px-4 py-2',
        tokenGlowClass
      ]">
        <!-- Left side: label + balance -->
        <div class="flex flex-col">
          <span class="text-gray-400 text-xs font-medium">Balance</span>
          <div class="flex items-baseline gap-1">
            <span class="text-white font-semibold text-xl leading-none">{{ userPurchasedAmount }}</span>
            <span class="text-gray-400 text-sm">/ {{ tokenGoal }}</span>
          </div>
        </div>
        
        <!-- Right side: progress, refresh, and info -->
        <div class="flex items-center gap-3">
          <!-- Progress bar -->
          <div class="w-32 h-2 bg-gray-800/50 rounded-full overflow-hidden">
            <ThemedProgressBar 
              :value="userPercentage" 
              size="sm"
              :variant="userPurchasedAmount >= tokenGoal ? 'success' : 'info'"
            />
          </div>
          
          <!-- Action buttons -->
          <div class="flex items-center gap-2">
            <!-- Refresh button -->
            <button 
              @click="fetchTransactionHistory" 
              class="text-gray-400 bg-indigo-900/60 hover:text-white p-1.5 rounded-full hover:bg-indigo-800/60 flex-shrink-0"
              title="Refresh your balance"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            
            <!-- Info button -->
            <button 
              @click.stop="toggleMobileInfo" 
              class="text-purple-300 hover:text-purple-200 bg-indigo-900/60 p-1.5 rounded-full hover:bg-indigo-800/60 flex-shrink-0"
              title="Founder Benefits Info"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile founder benefits popover (full width) -->
      <div v-if="showFounderInfoMobile" class="w-full bg-indigo-900/95 backdrop-blur-sm p-4 border-b border-indigo-700 shadow-lg animate-fade-in z-50">
        <div class="flex justify-between items-start mb-2">
          <h4 class="text-purple-300 font-semibold text-base">Founder Benefits</h4>
          <button @click.stop="showFounderInfoMobile = false" class="text-gray-400 hover:text-white p-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
        <p class="text-white text-sm mb-3">
          Reach the <span class="text-green-400 font-semibold">{{ tokenGoal }}</span> token goal to unlock:
        </p>
        <ul class="space-y-3 mb-4">
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-purple-400 mt-0.5 mr-2">
              <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
            </svg>
            <span class="text-gray-200 text-sm">Become an official <span class="text-purple-300 font-medium">S3MT Founder</span></span>
          </li>
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-purple-400 mt-0.5 mr-2">
              <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
            </svg>
            <span class="text-gray-200 text-sm">Receive a limited edition <span class="text-blue-300 font-medium">Founder's NFT</span></span>
          </li>
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-purple-400 mt-0.5 mr-2">
              <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
            </svg>
            <span class="text-gray-200 text-sm">Unlock <span class="text-green-300 font-medium">exclusive benefits</span> & early platform access</span>
          </li>
        </ul>
        <div class="mt-3 pt-3 border-t border-indigo-700">
          <a href="/founders" class="inline-block bg-indigo-700/70 text-white hover:bg-indigo-600/70 py-2 px-4 rounded-md text-sm font-medium w-full text-center">
            Learn More About Founder Benefits
          </a>
        </div>
      </div>
    </div>
  </div>
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

.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>