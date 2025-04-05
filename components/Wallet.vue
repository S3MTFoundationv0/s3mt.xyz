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
import { ref, onMounted } from 'vue';
import { WalletProvider } from '@solana/wallet-adapter-vue';
import { WalletModalProvider } from '@solana/wallet-adapter-vue-ui';
// Import adapters dynamically or ensure they are tree-shaken if not used on server
// For simplicity, we'll initialize them in onMounted

const wallets = ref([]);

onMounted(async () => {
  // Import adapters only on the client
  const { PhantomWalletAdapter, SolflareWalletAdapter } = await import('@solana/wallet-adapter-wallets');
  wallets.value = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    // Add other adapters here if needed
  ];
});

</script> 