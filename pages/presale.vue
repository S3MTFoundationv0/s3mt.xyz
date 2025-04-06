<template>
  <div class="mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
    <!-- Hero Section -->
    <PresaleHeader />
    
    <!-- Main Content -->
    <div class="mt-12 mb-20">
      <!-- Stats Section -->
      <div class="grid md:grid-cols-2 gap-8 mb-16">
        <PresaleCountdown :end-date="presaleEndDate" />
        <PresaleStats 
          :conversion-rate="CONVERSION_RATE" 
          :next-phase-rate="NEXT_PHASE_RATE"
          :total-raised="TOTAL_RAISED"
          :target-amount="TARGET_AMOUNT"
        />
      </div>
      
      <!-- Trust Signals -->
      <TrustSignals />
      
      <!-- Purchase Form -->
      <div class="mt-16 max-w-lg mx-auto">
        <PurchaseForm 
          :connected="connected"
          :loading="loading"
          :conversion-rate="CONVERSION_RATE"
          @purchase="handlePurchase"
        />
      </div>
    </div>
    
    <!-- FAQ Section (Simple) -->
    <div class="mt-20 mb-16 max-w-3xl mx-auto">
      <h3 class="text-2xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
        Frequently Asked Questions
      </h3>
      
      <div class="space-y-6">
        <div class="bg-gray-800/70 rounded-xl p-5 border border-gray-700">
          <h4 class="text-xl font-semibold text-white mb-3">How do I receive dividends?</h4>
          <p class="text-gray-300">Dividends are automatically distributed to the wallet address holding S3MT tokens. Payments are made in Stablecoins and/or S3MT tokens, depending on the asset source and dividend type.</p>
        </div>
        
        <div class="bg-gray-800/70 rounded-xl p-5 border border-gray-700">
          <h4 class="text-xl font-semibold text-white mb-3">When does the token launch?</h4>
          <p class="text-gray-300">The official launch date will be announced after the presale concludes. All presale participants will receive their tokens before the official launch.</p>
        </div>
        
        <div class="bg-gray-800/70 rounded-xl p-5 border border-gray-700">
          <h4 class="text-xl font-semibold text-white mb-3">What makes S3MT different?</h4>
          <p class="text-gray-300">S3MT combines real-world asset backing with sustainable practices and a dividend system that rewards holders directly. This creates genuine value rather than relying solely on market speculation.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWallet } from 'solana-wallets-vue'
import PresaleHeader from '~/components/PresaleHeader.vue'
import PresaleCountdown from '~/components/PresaleCountdown.vue'
import PresaleStats from '~/components/PresaleStats.vue'
import PurchaseForm from '~/components/PurchaseForm.vue'
import TrustSignals from '~/components/TrustSignals.vue'

useSWV()
const { connected, publicKey, sendTransaction } = useWallet()
const loading = ref(false)

// Get presale end date from runtime config
const config = useRuntimeConfig()
const presaleEndDate = ref(config.public.presaleEndDate)

// Stats for the presale (these would typically come from your API/contract)
const CONVERSION_RATE = 1000 // Example: 1 SOL = 1000 S3MT
const NEXT_PHASE_RATE = 800 // Next phase rate: 1 SOL = 800 S3MT
const TOTAL_RAISED = 128.5 // Total SOL raised
const TARGET_AMOUNT = 500 // Target SOL amount

const handlePurchase = async (amount) => {
  if (!connected.value || !publicKey.value || amount <= 0) {
    console.error('Wallet not connected or invalid amount');
    return;
  }

  loading.value = true;
  try {
    // --- TODO: Implement actual purchase logic --- 
    console.log(`Attempting purchase: ${amount} SOL from ${publicKey.value.toBase58()}`);
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    
    console.log('Purchase successful (simulated)');

  } catch (error) {
    console.error('Purchase failed:', error);
  } finally {
    loading.value = false;
  }
}

// Set page metadata
useHead({
  title: 'S3MT Token Presale',
  meta: [
    { name: 'description', content: 'Join the S3MT presale and secure your tokens at the best price. Backed by real-world sustainable assets.' }
  ],
})
</script>

<style>
@import 'animate.css';
</style>