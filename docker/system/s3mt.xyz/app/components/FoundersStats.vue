<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate__animated animate__fadeIn animate__delay-2s">
    <!-- Presale Progress Card -->
    <div class="bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 shadow-lg overflow-hidden relative group">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 opacity-50 transition-opacity duration-200 group-hover:opacity-70"></div>
      <div class="relative z-10">
        <h3 class="text-sm font-medium text-gray-400 mb-1">Presale Progress</h3>
        <div class="flex justify-between mb-2">
          <span class="text-white font-bold">{{ (typeof tokensSold === 'number' && !isNaN(tokensSold)) ? tokensSold.toLocaleString() : '0' }}</span>
          <span class="text-gray-400">{{ (typeof presaleAllocation === 'number' && !isNaN(presaleAllocation)) ? presaleAllocation.toLocaleString() : '0' }}</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2.5 mb-1">
          <div class="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" :style="`width: ${saleProgress}%`"></div>
        </div>
        <div class="text-xs text-right text-gray-400">{{ (typeof saleProgress === 'number' && !isNaN(saleProgress)) ? saleProgress.toFixed(1) : '0.0' }}% sold</div>
      </div>
    </div>

    <!-- Token Price Card -->
    <div class="bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 shadow-lg overflow-hidden relative group">
      <div class="absolute inset-0 bg-gradient-to-br from-green-600/10 to-blue-600/10 opacity-50 transition-opacity duration-200 group-hover:opacity-70"></div>
      <div class="relative z-10">
        <h3 class="text-sm font-medium text-gray-400 mb-1">Token Price</h3>
        <div class="flex items-center">
          <span class="text-2xl font-bold text-white">{{ formattedTokenPrice || 'N/A' }}</span>
        </div>
        <p class="text-green-400 text-xs mt-1">50% discount from public sale</p>
      </div>
    </div>

    <!-- Time Remaining Card -->
    <div class="bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 shadow-lg overflow-hidden relative group">
      <div class="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-50 transition-opacity duration-200 group-hover:opacity-70"></div>
      <div class="relative z-10">
        <h3 class="text-sm font-medium text-gray-400 mb-2">Time Remaining</h3>
        <div class="grid grid-cols-4 gap-1 text-center">
          <div class="bg-gray-900/70 rounded p-1">
            <div class="text-xl font-mono font-bold text-white">{{ countdown.days }}</div>
            <div class="text-xs text-gray-400">days</div>
          </div>
          <div class="bg-gray-900/70 rounded p-1">
            <div class="text-xl font-mono font-bold text-white">{{ countdown.hours }}</div>
            <div class="text-xs text-gray-400">hours</div>
          </div>
          <div class="bg-gray-900/70 rounded p-1">
            <div class="text-xl font-mono font-bold text-white">{{ countdown.minutes }}</div>
            <div class="text-xs text-gray-400">mins</div>
          </div>
          <div class="bg-gray-900/70 rounded p-1">
            <div class="text-xl font-mono font-bold text-white">{{ countdown.seconds }}</div>
            <div class="text-xs text-gray-400">secs</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tokensSold: { type: Number, required: true },
  presaleAllocation: { type: Number, required: true },
  saleProgress: { type: Number, required: true },
  formattedTokenPrice: { type: String, required: true }
})

const config = useRuntimeConfig().public

const countdown = ref({
  days: '00',
  hours: '00',
  minutes: '00',
  seconds: '00'
})

let intervalId = null

const calculateCountdown = () => {
  const endDate = new Date(config.presaleEndDate).getTime();
  const now = new Date().getTime();
  const distance = endDate - now;

  if (distance < 0) {
    countdown.value = { days: '00', hours: '00', minutes: '00', seconds: '00' };
    if (intervalId) clearInterval(intervalId);
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  countdown.value = {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0')
  };
}

onMounted(() => {
  calculateCountdown() // Initial calculation
  intervalId = setInterval(calculateCountdown, 1000);
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
})
</script>