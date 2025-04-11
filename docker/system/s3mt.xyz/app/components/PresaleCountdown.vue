<template>
  <div class="text-center">
    <h3 class="text-2xl font-bold mb-4 flex items-center justify-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Presale Ends Soon
    </h3>
    
    <div class="relative">
      <div class="bg-gray-900/80 rounded-xl p-5 border border-gray-700 shadow-lg relative overflow-hidden">
        <!-- Animated background glow -->
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 animate-pulse"></div>
        
        <div class="relative z-10">
          <CountdownTimer :end-date="endDate" />
          
          <div class="mt-4 text-sm text-gray-400">
            Next price increase in {{ formatTimeRemaining() }}
          </div>
          
          <div class="mt-6">
            <button 
              @click="scrollToInvest" 
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 rounded-lg shadow-lg text-white font-medium animate-pulse hover:animate-none"
            >
              Buy Now at Best Price
            </button>
          </div>
        </div>
      </div>
      
      <!-- Decorative corner elements -->
      <div class="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-indigo-500 rounded-tl-lg"></div>
      <div class="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-indigo-500 rounded-tr-lg"></div>
      <div class="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-indigo-500 rounded-bl-lg"></div>
      <div class="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-indigo-500 rounded-br-lg"></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import CountdownTimer from './CountdownTimer.vue';

const props = defineProps({
  endDate: {
    type: String,
    required: true
  }
});

const scrollToInvest = () => {
  const investElement = document.getElementById('invest');
  if (investElement) {
    investElement.scrollIntoView({ behavior: 'smooth' });
  }
};

const formatTimeRemaining = () => {
  const endTime = new Date(props.endDate).getTime();
  const now = new Date().getTime();
  const diff = endTime - now;
  
  if (diff <= 0) return 'Offer ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days} days, ${hours} hours`;
  } else {
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} hours, ${minutes} minutes`;
  }
};
</script> 