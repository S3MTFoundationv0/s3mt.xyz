<template>
  <ClientOnly>
    <slot />
    <template #fallback>
      <div class="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Initializing Wallet...</p>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
// Wallet is now initialized in the plugins/solana-wallet.client.js file
</script> 