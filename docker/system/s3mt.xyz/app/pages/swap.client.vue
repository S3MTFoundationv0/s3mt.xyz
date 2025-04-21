<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate__animated animate__fadeIn">
    <!-- Header -->
    <SwapHeader />
    
    <!-- Main Container -->
    <div class="mt-8 mb-16">
      <div class="grid md:grid-cols-2 gap-8 items-start">
        <!-- Swap Form -->
        <div>
          <SwapForm 
            :connected="connected" 
            :loading="loading"
            @swap="handleSwap"
          />
        </div>
        
        <!-- Swap Info -->
        <div>
          <div class="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
            <h3 class="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300">Why Swap with S3MT?</h3>
            <p class="text-gray-300 mb-6">Our swap protocol is designed to provide the best possible experience with favorable rates, no slippage, and low fees.</p>
            
            <SwapInfo />
          </div>
        </div>
      </div>
      
      <!-- Swap History -->
      <div v-if="connected">
        <SwapHistory :connected="connected" />
      </div>
      
      <div v-else class="mt-16 max-w-2xl mx-auto text-center bg-indigo-900/20 rounded-lg p-6 border border-indigo-800/30">
        <h3 class="text-xl font-bold mb-4 text-white">Connect Your Wallet</h3>
        <p class="text-gray-300 mb-6">Connect your wallet to start swapping tokens and view your transaction history.</p>
        <div class="flex justify-center">
          <WalletMultiButton />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { WalletMultiButton, useWallet } from 'solana-wallets-vue'
import SwapHeader from '~/components/SwapHeader.vue'
import SwapForm from '~/components/SwapForm.vue'
import SwapInfo from '~/components/SwapInfo.vue'
import SwapHistory from '~/components/SwapHistory.vue'

// Initialize Solana wallet adapter
useSWV()
const { connected, publicKey } = useWallet()
const loading = ref(false)

// Handle swap function
async function handleSwap(swapDetails) {
  if (!connected.value || !publicKey.value) {
    console.error('Wallet not connected');
    return;
  }

  loading.value = true;
  try {
    console.log(`Executing swap: ${swapDetails.fromAmount} ${swapDetails.fromToken} → ${swapDetails.toAmount} ${swapDetails.toToken}`);
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    
    console.log('Swap successful (simulated)');
    // Here you would implement the actual swap logic
    
  } catch (error) {
    console.error('Swap failed:', error);
  } finally {
    loading.value = false;
  }
}

// Set page metadata
useHead({
  title: 'S3MT Token Swap',
  meta: [
    { name: 'description', content: 'Swap tokens with zero slippage at the best rates in the S3MT ecosystem.' }
  ],
})
</script>

<style>
@import 'animate.css';
</style>