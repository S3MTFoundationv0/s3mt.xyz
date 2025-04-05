<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="max-w-2xl mx-auto">
      <div class="card">
        <h2 class="text-2xl font-bold mb-6">S3MT Token Presale</h2>
        <div class="space-y-4">
          <div class="flex justify-between">
            <span>Price per token:</span>
            <span>0.001 SOL</span>
          </div>
          <div class="flex justify-between">
            <span>Minimum purchase:</span>
            <span>100 S3MT</span>
          </div>
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-300">Amount (SOL)</label>
            <input
              type="number"
              v-model="amount"
              class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
            />
          </div>
          <button 
            @click="purchaseTokens"
            class="w-full btn btn-primary mt-4"
            :disabled="!connected"
          >
            Purchase Tokens
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const amount = ref(0)
const connected = ref(false) // Replace with actual wallet connection state

async function purchaseTokens() {
  // Implement token purchase logic
}
</script>