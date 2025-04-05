// stop doing this, it is done in nuxt.config.ts import "@solana/wallet-adapter-vue-ui/styles.css";
import "solana-wallets-vue/styles.css";
import SolanaWallets, { initWallet } from "solana-wallets-vue";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  autoConnect: true,
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(SolanaWallets, walletOptions);
  initWallet(walletOptions);
});