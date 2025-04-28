import "solana-wallets-vue/styles.css";
import SolanaWallets from "solana-wallets-vue";

const walletOptions = {
  autoConnect: true,
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(SolanaWallets, walletOptions);
});