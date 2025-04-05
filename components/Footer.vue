<template>
  <footer class="bg-indigo-950 text-gray-400 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div class="flex items-center space-x-4">
          <img class="h-8 w-auto" src="/logo.svg" alt="S3MT Logo" />
          <span class="text-sm">&copy; {{ new Date().getFullYear() }} S3MT. All rights reserved.</span>
        </div>
        <div class="flex space-x-6">
          <NuxtLink to="/" class="hover:text-white text-sm">Home</NuxtLink>
          <NuxtLink to="/presale" class="hover:text-white text-sm">Presale</NuxtLink>
          <NuxtLink to="/swap" class="hover:text-white text-sm">Swap</NuxtLink>
          <NuxtLink to="/whitepaper" class="hover:text-white text-sm">Whitepaper</NuxtLink>
          <!-- Add other important links here, e.g., Terms, Privacy Policy -->
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No script needed for this basic footer yet
</script> 