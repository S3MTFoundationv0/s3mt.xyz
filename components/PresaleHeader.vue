<template>
  <div class="text-center mb-12 animate__animated animate__fadeIn">
    <h1 class="text-4xl md:text-5xl font-bold mb-4 flex justify-center items-center gap-3">
      <Logo size="lg" /> 
      <span class="relative">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Token Presale</span>
        <span class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></span>
      </span>
    </h1>
    <p class="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mt-6">
      Join early investors in the Simple, Smart, Sustainable approach to 
      <span class="font-medium text-indigo-300">real-world asset-backed</span> rewards.
    </p>
    <div class="mt-8 flex justify-center space-x-4">
      <a href="/whitepaper" class="px-6 py-3 bg-gray-800 hover:bg-gray-700 transition-colors duration-300 rounded-lg border border-gray-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Read Whitepaper
      </a>
      <a href="#invest" class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 rounded-lg shadow-lg text-white font-medium flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Invest Now
      </a>
    </div>
  </div>
</template>

<script setup>
import Logo from './Logo.vue';
</script> 