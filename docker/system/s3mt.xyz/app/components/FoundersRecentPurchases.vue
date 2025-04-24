<template>
  <div v-if="recentPurchases.length > 0" class="relative animate__animated animate__fadeIn animate__delay-4s">
    <div class="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-gray-700/10 to-gray-800/20 rounded-xl blur opacity-30"></div>
    <div class="relative bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-lg">
      <div class="p-4 border-b border-gray-700/70">
        <h3 class="text-xl font-semibold text-white">Recent Purchases</h3>
      </div>
      <div class="divide-y divide-gray-700/50">
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
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  recentPurchases: {
    type: Array,
    required: true
  }
})

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