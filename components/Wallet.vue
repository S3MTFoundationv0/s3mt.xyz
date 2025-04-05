<template>
  <ClientOnly>
    <WalletProvider :wallets="wallets" auto-connect>
      <WalletModalProvider>
        <slot /> 
      </WalletModalProvider>
    </WalletProvider>
    <template #fallback>
      <!-- Fallback content while wallet loads on client -->
      <div class="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Initializing Wallet...</p>
      </div>
      <!-- Render the default slot content hidden or styled differently during SSR -->
      <!-- <div style="visibility: hidden;"><slot /></div> -->
    </template>
  </ClientOnly>
</template>

<script setup>
import { ref } from 'vue';
import { WalletProvider } from '@solana/wallet-adapter-vue';
import { WalletModalProvider } from '@solana/wallet-adapter-vue-ui';
// Import adapters directly for synchronous initialization on client
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

// Initialize wallets synchronously
const wallets = ref([
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  // Add other adapters here if needed
]);

// Removed onMounted hook
</script> 