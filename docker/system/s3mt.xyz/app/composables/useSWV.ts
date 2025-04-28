import { initWallet } from 'solana-wallets-vue'

export const useSWV = () => {
  initWallet({
    autoConnect: true,
  });
}