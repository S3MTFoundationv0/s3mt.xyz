<template>
  <div class="mt-12 animate__animated animate__fadeIn">
    <h3 class="text-2xl font-bold mb-6 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Recent Swaps
    </h3>
    
    <div class="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">From</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">To</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">View</th>
            </tr>
          </thead>
          <tbody class="bg-gray-800/20 divide-y divide-gray-700">
            <tr v-for="swap in recentSwaps" :key="swap.id" class="hover:bg-gray-700/30 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ formatTime(swap.timestamp) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="swap.fromIcon" alt="From token" class="w-5 h-5 mr-2">
                  <span class="text-sm text-gray-300">{{ swap.fromAmount }} {{ swap.fromToken }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="swap.toIcon" alt="To token" class="w-5 h-5 mr-2">
                  <span class="text-sm text-gray-300">{{ swap.toAmount }} {{ swap.toToken }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded': true,
                    'bg-green-900/30 text-green-400': swap.status === 'completed',
                    'bg-yellow-900/30 text-yellow-400': swap.status === 'pending',
                    'bg-red-900/30 text-red-400': swap.status === 'failed'
                  }"
                >
                  {{ swap.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a :href="swap.explorerUrl" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </td>
            </tr>
            
            <tr v-if="recentSwaps.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-400">
                No recent swaps found. Start swapping to see your history.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div v-if="connected && recentSwaps.length > 0" class="mt-4 text-right">
      <a href="#" class="text-indigo-400 hover:text-indigo-300 text-sm">View all transactions →</a>
    </div>
    
    <div v-if="!connected" class="text-center bg-indigo-900/20 rounded-lg mt-4 p-4 border border-indigo-800/20">
      <p class="text-gray-300">Connect your wallet to view your swap history</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  connected: {
    type: Boolean,
    default: false
  }
});

// Sample recent swaps for demo
const recentSwaps = [
  {
    id: 1,
    timestamp: Date.now() - 1000 * 60 * 15, // 15 minutes ago
    fromToken: 'SOL',
    fromAmount: '1.25',
    fromIcon: '/solana-sol-logo.svg',
    toToken: 'S3MT',
    toAmount: '1,243.75',
    toIcon: '/logo.svg',
    status: 'completed',
    explorerUrl: 'https://explorer.solana.com/tx/1234567890'
  },
  {
    id: 2,
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    fromToken: 'USDC',
    fromAmount: '50.00',
    fromIcon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg',
    toToken: 'S3MT',
    toAmount: '59.70',
    toIcon: '/logo.svg',
    status: 'completed',
    explorerUrl: 'https://explorer.solana.com/tx/0987654321'
  },
  {
    id: 3,
    timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    fromToken: 'SOL',
    fromAmount: '0.5',
    fromIcon: '/solana-sol-logo.svg',
    toToken: 'S3MT',
    toAmount: '497.50',
    toIcon: '/logo.svg',
    status: 'pending',
    explorerUrl: 'https://explorer.solana.com/tx/5678901234'
  }
];

// Format timestamp to relative time
function formatTime(timestamp) {
  const now = Date.now();
  const diffSeconds = Math.floor((now - timestamp) / 1000);
  
  if (diffSeconds < 60) {
    return 'Just now';
  } else if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
</script> 