<template>
  <div class="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg animate__animated animate__fadeIn">
    <div class="grid grid-cols-2 gap-6">
      <div class="text-center">
        <div class="text-xl text-gray-400 mb-1">Current Rate</div>
        <div class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          1 SOL = {{ conversionRate }} S3MT
        </div>
      </div>
      
      <div class="text-center">
        <div class="text-xl text-gray-400 mb-1">Next Price</div>
        <div class="text-3xl font-bold text-indigo-200">
          1 SOL = {{ nextPhaseRate }} S3MT
        </div>
      </div>
    </div>
    
    <div class="mt-6 bg-gray-900/60 rounded-lg p-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-gray-300 font-medium">Raised: {{ formatAmount(totalRaised) }} SOL</span>
        <span class="text-indigo-300 font-medium">Target: {{ formatAmount(targetAmount) }} SOL</span>
      </div>
      
      <!-- Progress Bar -->
      <div class="h-4 bg-gray-700 rounded-full overflow-hidden relative">
        <div
          class="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full absolute top-0 left-0 transition-all duration-1000 ease-out"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
      
      <div class="mt-2 text-right text-sm text-gray-400">
        {{ progressPercentage.toFixed(1) }}% Complete
      </div>
    </div>
    
    <div class="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
      <div class="bg-gray-900/70 rounded-lg p-3">
        <div class="text-gray-400 text-sm">Participants</div>
        <div class="font-bold text-xl">{{ totalParticipants }}</div>
      </div>
      <div class="bg-gray-900/70 rounded-lg p-3">
        <div class="text-gray-400 text-sm">Avg Investment</div>
        <div class="font-bold text-xl">{{ formatAmount(averageInvestment) }} SOL</div>
      </div>
      <div class="bg-gray-900/70 rounded-lg p-3">
        <div class="text-gray-400 text-sm">Tokens Sold</div>
        <div class="font-bold text-xl">{{ formatAmount(tokensSold / 1000) }}K</div>
      </div>
      <div class="bg-gray-900/70 rounded-lg p-3">
        <div class="text-gray-400 text-sm">Time Left</div>
        <div class="font-bold text-xl">{{ daysLeft }} Days</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  conversionRate: {
    type: Number,
    default: 1000
  },
  nextPhaseRate: {
    type: Number,
    default: 800
  },
  totalRaised: {
    type: Number,
    default: 128.5
  },
  targetAmount: {
    type: Number,
    default: 500
  },
  totalParticipants: {
    type: Number,
    default: 247
  },
  tokensSold: {
    type: Number,
    default: 128500
  },
  daysLeft: {
    type: Number,
    default: 14
  }
});

const progressPercentage = computed(() => {
  return Math.min(100, (props.totalRaised / props.targetAmount) * 100);
});

const averageInvestment = computed(() => {
  return props.totalParticipants > 0 ? props.totalRaised / props.totalParticipants : 0;
});

function formatAmount(amount) {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}
</script> 