<template>
  <ClientOnly>
    <div class="wallet-wrapper">
      <template v-if="connected.value">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-300">{{ publicKeyShort }}</span>
          <button @click="disconnect" class="btn btn-secondary text-sm">
            Disconnect
          </button>
        </div>
      </template>
      <template v-else>
        <button @click="handleConnect" class="btn btn-primary">
          Connect Wallet
        </button>
      </template>
    </div>
    <template #fallback>
      <button class="btn btn-primary">
        Connect Wallet
      </button>
    </template>
  </ClientOnly>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useWallet } from 'solana-wallets-vue';

// Use the wallet store from solana-wallets-vue
const { connected, publicKey, connect, disconnect } = useWallet();

// Compute a shortened version of the public key
const publicKeyShort = computed(() => {
  if (!publicKey.value) return '';
  const key = publicKey.value.toString();
  return `${key.slice(0, 6)}...${key.slice(-4)}`;
});

// Handle connection errors
const handleConnect = async () => {
  try {
    await connect();
  } catch (error) {
    console.error('Failed to connect wallet:', error);
  }
};
</script>