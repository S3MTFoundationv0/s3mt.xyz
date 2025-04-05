<template>
  <ClientOnly>
    <WalletMultiButton />
    <template #fallback>
      <button class="btn btn-primary">
        Connect Wallet
      </button>
    </template>
  </ClientOnly>
</template>

<script setup>
import { WalletMultiButton } from "solana-wallets-vue";
</script>