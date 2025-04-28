import { initWallet } from "solana-wallets-vue";

const walletOptions = {
  autoConnect: true,
};

export const useSWV = () => {
  initWallet(walletOptions);
}