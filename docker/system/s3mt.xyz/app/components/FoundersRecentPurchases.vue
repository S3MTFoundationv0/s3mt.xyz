<template>
  <!-- Initial Loading State - only shown on first load, not during refreshes -->
  <div v-if="loading && !hasLoadedOnce" class="relative animate__animated animate__fadeIn animate__delay-4s">
    <div class="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-gray-700/10 to-gray-800/20 rounded-xl blur opacity-30"></div>
    <div class="relative bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-lg p-8 text-center">
      <div class="flex flex-col items-center justify-center space-y-4">
        <div class="rounded-full bg-indigo-900/40 p-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <p class="text-gray-400">Loading purchase history...</p>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div v-else-if="errorMsg" class="relative animate__animated animate__fadeIn animate__delay-4s">
    <div class="absolute inset-0 bg-gradient-to-br from-red-800/20 via-red-700/10 to-red-800/20 rounded-xl blur opacity-30"></div>
    <div class="relative bg-gray-800/60 backdrop-blur-sm rounded-xl border border-red-700/50 overflow-hidden shadow-lg p-6">
      <div class="flex items-start space-x-4">
        <div class="rounded-full bg-red-900/40 p-2 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 class="text-white font-semibold mb-2">Error Loading Purchase History</h3>
          <p class="text-red-300 text-sm">{{ errorMsg }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Data State - always shown after first load, even during refreshes -->
  <div v-else-if="recentPurchases.length > 0 || hasLoadedOnce" class="relative animate__animated animate__fadeIn animate__delay-4s">
    <div class="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-gray-700/10 to-gray-800/20 rounded-xl blur opacity-30"></div>
    <div class="relative bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-lg">
      <!-- Loading overlay for refresh operations -->
      <div v-if="loading && hasLoadedOnce" class="refresh-overlay">
        <div class="rounded-full bg-indigo-900/60 p-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      </div>
      
      <div class="p-4 border-b border-gray-700/70 flex justify-between items-center">
        <h3 class="text-xl font-semibold text-white">Recent Purchases</h3>
        <button 
          @click="emitRefresh"
          class="refresh-button"
          :disabled="loading"
        >
          <svg v-if="loading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span v-if="loading">Refreshing...</span>
          <span v-else>Refresh</span>
        </button>
      </div>
      
      <div v-if="recentPurchases.length > 0" class="divide-y divide-gray-700/50">
        <div v-for="(purchase, index) in recentPurchases" :key="index" class="p-4 hover:bg-gray-700/20 transition-colors duration-150">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="rounded-full bg-indigo-900/40 p-2 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-white font-medium">{{ purchase.amount.toLocaleString() }} tokens</p>
                <p class="text-gray-400 text-xs font-mono">{{ purchase.address }}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs text-gray-400">{{ timeAgo(purchase.timestamp) }}</span>
              <div class="mt-1">
                <span class="text-xs px-2 py-1 rounded-full"
                  :class="purchase.currency === 'SOL' ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-900/30 text-blue-400'"
                >
                  {{ purchase.currency }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty state when we have data container but no purchases -->
      <div v-else class="p-6 text-center">
        <p class="text-gray-400">No purchase history available yet</p>
      </div>
      
      <!-- View Full History Button -->
      <div class="p-4 border-t border-gray-700/50 flex justify-center">
        <NuxtLink to="/history" class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600/80 hover:bg-indigo-700/80 rounded-md shadow-sm transition-colors duration-150 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
          View Full History
        </NuxtLink>
      </div>
    </div>
  </div>

  <!-- Empty State - only shown on first load -->
  <div v-else class="relative animate__animated animate__fadeIn animate__delay-4s">
    <div class="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-gray-700/10 to-gray-800/20 rounded-xl blur opacity-30"></div>
    <div class="relative bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-lg p-8 text-center">
      <p class="text-gray-400">No purchase history available yet</p>
      <button 
        @click="emitRefresh"
        class="refresh-button mt-4"
        :disabled="loading"
      >
        <svg v-if="loading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span v-if="loading">Refreshing...</span>
        <span v-else>Refresh</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  recentPurchases: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  errorMsg: {
    type: String,
    default: ''
  }
})

// Track if we've ever loaded data successfully
const hasLoadedOnce = ref(false)

// Set hasLoadedOnce to true when we first get data
watch(() => props.recentPurchases, (newValue) => {
  if (newValue && newValue.length > 0) {
    hasLoadedOnce.value = true
  }
}, { immediate: true })

const emit = defineEmits(['refresh'])

function emitRefresh() {
  emit('refresh')
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + 'y ago'
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + 'mo ago'
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + 'd ago'
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + 'h ago'
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + 'm ago'
  return Math.floor(seconds) + 's ago'
}
</script>

<style scoped>
.refresh-button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  background-color: rgba(79, 70, 229, 0.6);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  backdrop-filter: blur(4px);
}

.refresh-button:hover:not(:disabled) {
  background-color: rgba(67, 56, 202, 0.7);
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
</style>