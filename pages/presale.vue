<template>
  
    <div 
      v-motion
      :initial="{ opacity: 0, scale: 0.95 }"
      :enter="{
        opacity: 1,
        scale: 1,
        transition: {
          duration: 450,
          ease: [0.22, 1, 0.36, 1], // Exaggerated easeOutBack-like curve
        },
      }"
      class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <h1 class="text-3xl font-bold text-center mb-8 flex justify-center items-center gap-2">
        <Logo size="md" /> <span>Presale</span>
      </h1>
      
      <div class="bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          
          <!-- Left Side: Info & Timer -->
          <div>
            <h2 class="text-2xl font-semibold mb-4">Join the Future of Mining</h2>
            <p class="text-gray-400 mb-6">
              Secure your S3MT tokens at the best price before the official launch. 
              Be part of the sustainable revolution in crypto.
            </p>
            
            <!-- Placeholder for Countdown Timer -->
            <div class="mb-6 p-4 bg-gray-700 rounded">
              <p class="text-center text-lg font-medium">Presale Ends In:</p>
              <p class="text-center text-2xl font-bold text-primary">[Countdown Timer Here]</p>
            </div>
            
            <div class="text-sm text-gray-500">
              <p>Current Rate: 1 SOL = X S3MT</p>
              <p>Total Raised: Y SOL / Z SOL Target</p>
            </div>
          </div>
          
          <!-- Right Side: Purchase Form -->
          <div>
            <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>Buy</span> <Logo size="sm" /> <span>Tokens</span>
            </h3>
            <ClientOnly>
              <form @submit.prevent="handlePurchase">
                <div class="mb-4">
                  <label for="solAmount" class="block text-sm font-medium text-gray-300 mb-1">Amount (SOL)</label>
                  <input 
                    type="number" 
                    id="solAmount" 
                    v-model="solAmount" 
                    placeholder="Enter SOL amount"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                </div>
                <p class="text-sm text-gray-400 mb-4">You will receive: {{ estimatedS3MT }} S3MT</p>
                
                <WalletMultiButton />
                
                <button 
                  type="submit" 
                  :disabled="!connected.value || loading" 
                  class="mt-4 w-full btn btn-primary disabled:opacity-50"
                >
                  {{ loading ? 'Processing...' : 'Buy Now' }}
                </button>
              </form>
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup >
import { ref, computed } from 'vue'
import { WalletMultiButton, useWallet } from 'solana-wallets-vue'
useSWV()
const { connected, publicKey, sendTransaction } = useWallet()
const solAmount = ref(0.1) // Default or minimum amount
const loading = ref(false)

// Replace with actual conversion rate
const CONVERSION_RATE = 1000 // Example: 1 SOL = 1000 S3MT

const estimatedS3MT = computed(() => {
  return (solAmount.value * CONVERSION_RATE).toFixed(2)
})

const handlePurchase = async () => {
  if (!connected.value || !publicKey.value || solAmount.value <= 0) {
    console.error('Wallet not connected or invalid amount');
    // Add user feedback (e.g., toast notification)
    return;
  }

  loading.value = true;
  try {
    // --- TODO: Implement actual purchase logic --- 
    // 1. Get wallet public key: publicKey.value
    // 2. Get SOL amount: solAmount.value
    // 3. Call your backend or smart contract function to process the transaction
    //    (This will likely involve signing a transaction with sendTransaction)
    console.log(`Attempting purchase: ${solAmount.value} SOL from ${publicKey.value.toBase58()}`);
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    
    console.log('Purchase successful (simulated)');
    // Add success feedback
    solAmount.value = 0.1; // Reset amount

  } catch (error) {
    console.error('Purchase failed:', error);
    // Add error feedback
  } finally {
    loading.value = false;
  }
}
</script>