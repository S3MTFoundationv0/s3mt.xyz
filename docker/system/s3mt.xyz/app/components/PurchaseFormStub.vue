<template>
    <div id="invest" class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-indigo-500/30 shadow-xl transition-all duration-300 animate__animated animate__fadeIn">
      <h3 class="text-2xl font-bold mb-6 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Invest in <Logo size="sm" /> Tokens
      </h3>
      
      <div class="grid gap-6 mb-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-900/70 rounded-lg p-3 text-center">
            <div class="text-gray-400 text-sm">Minimum Purchase</div>
            <div class="font-bold text-xl text-indigo-300">0.1 SOL</div>
          </div>
          <div class="bg-gray-900/70 rounded-lg p-3 text-center">
            <div class="text-gray-400 text-sm">Maximum Purchase</div>
            <div class="font-bold text-xl text-indigo-300">100 SOL</div>
          </div>
        </div>
        
        <ClientOnly>
          <form @submit.prevent="handlePurchase">
            <div class="mb-4">
              <label for="solAmount" class="block text-sm font-medium text-gray-300 mb-2">Amount to Invest (SOL)</label>
              <div class="relative">
                <input 
                  type="number" 
                  id="solAmount" 
                  v-model="amount" 
                  :min="minAmount"
                  :max="maxAmount"
                  step="0.1"
                  placeholder="Enter SOL amount"
                  class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <img src="/solana-sol-logo.svg" alt="SOL" class="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div class="mb-6 bg-indigo-900/20 p-4 rounded-lg border border-indigo-800/30">
              <div class="flex justify-between items-center text-gray-300">
                <span>You will receive:</span>
                <span class="text-2xl font-bold text-white">{{ formatNumber(estimatedTokens) }} S3MT</span>
              </div>
              <div class="mt-2 text-xs text-gray-400">Current exchange rate: 1 SOL = {{ conversionRate }} S3MT</div>
            </div>
            
            <div class="mb-4">
              <div v-if="!connected" class="flex justify-center mb-4">
                <button class="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-60">
                  Connect Wallet
                </button>
              </div>
              
              <button 
                type="submit" 
                :disabled="!connected || loading || amount <= 0" 
                class="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-60"
              >
                <span v-if="loading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else>
                  {{ connected ? 'Purchase S3MT Tokens' : 'Connect Wallet to Purchase' }}
                </span>
              </button>
            </div>
            
            <p class="text-xs text-center text-gray-400 mt-4">
              By purchasing, you agree to our <a href="#" class="text-indigo-400 hover:underline">Terms of Service</a> and <a href="#" class="text-indigo-400 hover:underline">Privacy Policy</a>
            </p>
          </form>
        </ClientOnly>
      </div>
    </div>
  </template>
  
  <script setup>
  import Logo from './Logo.vue';
  
  const props = defineProps({
    connected: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    conversionRate: {
      type: Number,
      default: 1000
    },
    minAmount: {
      type: Number,
      default: 0.1
    },
    maxAmount: {
      type: Number,
      default: 100
    }
  });
  
  const emit = defineEmits(['purchase']);
  
  const amount = ref(0.5); // Default to a reasonable amount
  
  const estimatedTokens = computed(() => {
    return amount.value * props.conversionRate;
  });
  
  const handlePurchase = () => {
    if (!props.connected || amount.value <= 0) {
      return;
    }
    
    emit('purchase', amount.value);
  };
  
  const formatNumber = (num) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };
  </script> 