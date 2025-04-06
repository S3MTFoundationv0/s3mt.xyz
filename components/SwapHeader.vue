<template>
  <div class="text-center mb-12 animate__animated animate__fadeIn">
    <h1 class="text-4xl md:text-5xl font-bold mb-4 flex justify-center items-center gap-3">
      <Logo size="lg" /> 
      <span class="relative">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Token Swap</span>
        <span class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></span>
      </span>
    </h1>
    <p class="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mt-6">
      Seamlessly exchange tokens and participate in the 
      <span class="font-medium text-indigo-300">S3MT ecosystem</span> with zero-slippage swaps.
    </p>
  </div>
</template>

<script setup>
import Logo from './Logo.vue';
</script> 