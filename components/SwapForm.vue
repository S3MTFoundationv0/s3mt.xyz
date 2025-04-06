<template>
  <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-indigo-500/30 shadow-xl transition-all duration-300 animate__animated animate__fadeIn">
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-4 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        Swap Tokens
      </h2>
      <p class="text-gray-400">Exchange your tokens at the best rates with zero slippage</p>
    </div>

    <div class="space-y-6">
      <!-- From Token Section -->
      <div class="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-300">From</label>
          <div class="text-sm text-gray-400">
            Balance: {{ formatBalance(fromBalance) }}
          </div>
        </div>

        <div class="flex space-x-4">
          <div class="w-full">
            <div class="relative">
              <input
                type="number"
                v-model="fromAmount"
                @input="handleFromAmountChange"
                placeholder="0.00"
                class="w-full text-3xl font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-white placeholder-gray-500"
              />
              <div class="absolute right-0 bottom-0">
                <button 
                  @click="setMaxAmount" 
                  class="text-xs bg-indigo-600/20 hover:bg-indigo-600/30 transition-colors text-indigo-400 px-2 py-1 rounded"
                >
                  MAX
                </button>
              </div>
            </div>
            <div class="text-right text-sm text-gray-500 mt-1">≈ ${{ formatUsdValue(fromUsdValue) }}</div>
          </div>

          <div class="w-24 flex-shrink-0">
            <div @click="showFromTokenSelect = true" class="flex items-center space-x-1 bg-gray-800 hover:bg-gray-700 transition-colors p-2 rounded-lg cursor-pointer">
              <img :src="getTokenIcon(fromToken)" class="w-6 h-6" :alt="fromToken" />
              <span class="font-medium">{{ fromToken }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Swap Direction Button -->
      <div class="flex justify-center">
        <button 
          @click="swapDirection" 
          class="bg-indigo-700/30 hover:bg-indigo-700/50 transition-colors rounded-full p-2 border border-indigo-600/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      <!-- To Token Section -->
      <div class="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-300">To</label>
          <div class="text-sm text-gray-400">
            Balance: {{ formatBalance(toBalance) }}
          </div>
        </div>

        <div class="flex space-x-4">
          <div class="w-full">
            <input
              type="number"
              v-model="toAmount"
              placeholder="0.00"
              disabled
              class="w-full text-3xl font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-white placeholder-gray-500"
            />
            <div class="text-right text-sm text-gray-500 mt-1">≈ ${{ formatUsdValue(toUsdValue) }}</div>
          </div>

          <div class="w-24 flex-shrink-0">
            <div class="flex items-center space-x-1 bg-gray-800 p-2 rounded-lg">
              <Logo size="xs" class="w-6 h-6" />
              <span class="font-medium">S3MT</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Rate Information -->
      <div class="bg-gray-900/60 rounded-lg p-3 text-sm text-gray-400">
        <div class="flex justify-between">
          <span>Exchange Rate:</span>
          <span>1 {{ fromToken }} = {{ formatRate(exchangeRate) }} S3MT</span>
        </div>
        <div class="flex justify-between mt-1">
          <span>Minimum Received:</span>
          <span>{{ formatNumber(minimumReceived) }} S3MT</span>
        </div>
        <div class="flex justify-between mt-1">
          <span>Fee:</span>
          <span>{{ swapFee }}%</span>
        </div>
      </div>

      <!-- Submit Button -->
      <button 
        @click="executeSwap"
        :disabled="!connected || isInsufficientBalance || fromAmount <= 0 || loading"
        class="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-60"
      >
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing Swap...
        </span>
        <span v-else-if="!connected">
          Connect Wallet to Swap
        </span>
        <span v-else-if="isInsufficientBalance">
          Insufficient {{ fromToken }} Balance
        </span>
        <span v-else-if="fromAmount <= 0">
          Enter an Amount
        </span>
        <span v-else>
          Swap Tokens
        </span>
      </button>

      <p class="text-xs text-center text-gray-400 mt-2">
        By swapping, you agree to our <a href="#" class="text-indigo-400 hover:underline">Terms of Service</a>
      </p>
    </div>

    <!-- Token Selection Modal -->
    <div v-if="showFromTokenSelect" class="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50 animate__animated animate__fadeIn">
      <div class="bg-gray-800 rounded-xl p-5 max-w-md w-full max-h-96 overflow-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">Select Token</h3>
          <button @click="showFromTokenSelect = false" class="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-2">
          <div 
            v-for="token in availableTokens" 
            :key="token.symbol"
            @click="selectFromToken(token.symbol)"
            class="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg cursor-pointer"
          >
            <img :src="token.icon" class="w-8 h-8" :alt="token.symbol" />
            <div>
              <div class="font-medium">{{ token.symbol }}</div>
              <div class="text-sm text-gray-400">{{ token.name }}</div>
            </div>
            <div class="ml-auto text-right">
              <div>{{ formatBalance(token.balance) }}</div>
              <div class="text-sm text-gray-400">${{ formatUsdValue(token.usdValue) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Logo from './Logo.vue';

const props = defineProps({
  connected: {
    type: Boolean,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['swap']);

// Token State
const fromToken = ref('SOL');
const toToken = ref('S3MT');
const fromAmount = ref(0);
const toAmount = ref(0);
const showFromTokenSelect = ref(false);

// Exchange Rates and Fees
const exchangeRates = {
  'SOL': 1000,
  'USDC': 1.2
};

const swapFee = 0.5; // 0.5% fee

// Mock balances
const balances = {
  'SOL': 2.54,
  'USDC': 150.75,
  'S3MT': 2405
};

// Mock USD values
const usdRates = {
  'SOL': 120,
  'USDC': 1,
  'S3MT': 0.12
};

const availableTokens = [
  { symbol: 'SOL', name: 'Solana', icon: '/solana-sol-logo.svg', balance: balances['SOL'], usdValue: balances['SOL'] * usdRates['SOL'] },
  { symbol: 'USDC', name: 'USD Coin', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg', balance: balances['USDC'], usdValue: balances['USDC'] * usdRates['USDC'] }
];

const fromBalance = computed(() => balances[fromToken.value] || 0);
const toBalance = computed(() => balances[toToken.value] || 0);

const fromUsdValue = computed(() => fromAmount.value * usdRates[fromToken.value] || 0);
const toUsdValue = computed(() => toAmount.value * usdRates[toToken.value] || 0);

const exchangeRate = computed(() => exchangeRates[fromToken.value] || 0);

const minimumReceived = computed(() => {
  const amount = fromAmount.value * exchangeRate.value;
  return amount - (amount * swapFee / 100);
});

const isInsufficientBalance = computed(() => {
  return fromAmount.value > fromBalance.value;
});

// Update to amount when from amount changes
watch(fromAmount, (newVal) => {
  if (newVal > 0) {
    const rawAmount = newVal * exchangeRate.value;
    // Apply fee
    toAmount.value = rawAmount - (rawAmount * swapFee / 100);
  } else {
    toAmount.value = 0;
  }
});

// Methods
function handleFromAmountChange() {
  // Ensure positive value
  if (fromAmount.value < 0) {
    fromAmount.value = 0;
  }
}

function swapDirection() {
  // Note: In this case we only swap from SOL/USDC to S3MT, not vice versa
  // This is just to give the user the feeling of control
  if (fromToken.value === 'SOL') {
    fromToken.value = 'USDC';
  } else {
    fromToken.value = 'SOL';
  }
  
  // Recalculate
  if (fromAmount.value > 0) {
    const rawAmount = fromAmount.value * exchangeRate.value;
    toAmount.value = rawAmount - (rawAmount * swapFee / 100);
  }
}

function setMaxAmount() {
  fromAmount.value = fromBalance.value;
}

function selectFromToken(token) {
  fromToken.value = token;
  showFromTokenSelect.value = false;
  
  // Recalculate
  if (fromAmount.value > 0) {
    const rawAmount = fromAmount.value * exchangeRate.value;
    toAmount.value = rawAmount - (rawAmount * swapFee / 100);
  }
}

function executeSwap() {
  if (!props.connected || isInsufficientBalance.value || fromAmount.value <= 0) {
    return;
  }
  
  emit('swap', {
    fromToken: fromToken.value,
    toToken: toToken.value,
    fromAmount: fromAmount.value,
    toAmount: toAmount.value
  });
}

function getTokenIcon(token) {
  if (token === 'SOL') return '/solana-sol-logo.svg';
  if (token === 'USDC') return 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg';
  return '';
}

// Formatters
function formatBalance(balance) {
  return balance?.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }) || '0.00';
}

function formatUsdValue(value) {
  return value?.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) || '0.00';
}

function formatRate(rate) {
  return rate?.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }) || '0';
}

function formatNumber(num) {
  return num?.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }) || '0';
}
</script> 