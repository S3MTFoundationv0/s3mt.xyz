<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="max-w-2xl mx-auto">
      <div class="card">
        <h2 class="text-2xl font-bold mb-6">Swap Tokens</h2>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-300">From</label>
            <select v-model="fromToken" class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2">
              <option value="sol">SOL</option>
              <option value="usdc">USDC</option>
            </select>
            <input
              type="number"
              v-model="fromAmount"
              class="mt-2 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300">To</label>
            <div class="bg-gray-700 border border-gray-600 rounded-md px-3 py-2">
              S3MT
            </div>
            <input
              type="number"
              v-model="toAmount"
              disabled
              class="mt-2 block w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
            />
          </div>
          <button 
            @click="swapTokens"
            class="w-full btn btn-primary"
            :disabled="!connected"
          >
            Swap
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const fromToken = ref('sol')
const fromAmount = ref(0)
const toAmount = ref(0)
const connected = ref(false) // Replace with actual wallet connection state

async function swapTokens() {
  // Implement token swap logic
}
</script>