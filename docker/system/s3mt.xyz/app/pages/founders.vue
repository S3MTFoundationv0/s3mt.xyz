<script setup lang="ts">
import { useWallet, useAnchorWallet } from 'solana-wallets-vue'
import { Connection, PublicKey, SystemProgram, SYSVAR_CLOCK_PUBKEY, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { AnchorProvider, Program, BN } from '@coral-xyz/anchor'
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, getAccount } from '@solana/spl-token'
import presaleIdl from '~/programs/s3mt_presale.idl.json'

useSWV()

useHead({
  title: 'Founders Presale',
  meta: [{ name: 'description', content: 'Founders presale - get in early at $0.10 per unit.' }]
})


// Price oracle data (would come from an actual oracle API in production)
const solPrice = ref(169.42); // Current SOL price in USD
const isFetchingPrice = ref(false);

// Constants & reactive state
const PRICE = 0.10 // Price in USD
const currency = ref('USDC')
const amount = ref(0)

// Wallet balances
const walletBalances = ref({
  sol: null as number | null,
  usdc: null as number | null
})
const isFetchingBalances = ref(false)

// Computed props for currency-specific calculations
const totalCostInUsd = computed(() => PRICE * amount.value)

// Dynamic total based on selected currency
const totalCost = computed(() => {
  if (currency.value === 'USDC') {
    return totalCostInUsd.value;
  } else {
    // Convert USD to SOL
    return totalCostInUsd.value / solPrice.value;
  }
})

// Format display values based on selected currency
const formattedTotalCost = computed(() => {
  if (currency.value === 'USDC') {
    return '$' + totalCost.value.toFixed(2);
  } else {
    return totalCost.value.toFixed(5) + ' SOL';
  }
})

// Format for individual token price display
const formattedTokenPrice = computed(() => {
  if (currency.value === 'USDC') {
    return '$' + PRICE.toFixed(2);
  } else {
    const priceInSol = PRICE / solPrice.value;
    return priceInSol.toFixed(8) + ' SOL';
  }
})

const isValid = computed(() => amount.value > 0)

// Wallet & UI state
const { connected, publicKey, select: selectWallet, wallets } = useWallet()
const wallet = useAnchorWallet()

const loading = ref(false)
const success = ref(false)
const errorMsg = ref('')
const transactionSignature = ref<string | null>(null)

// Environment variables
const config = useRuntimeConfig()
const rpcUrl = config.public.solanaNetwork
const presaleProgramId = config.public.presaleProgramId
const usdcMintAddress = config.public.usdcMint
const treasuryAddress = config.public.treasury

// Solana connection
const connection = new Connection(rpcUrl, { commitment: 'confirmed' })

// Recent purchases for social proof (fetched from blockchain via composable)
const { transactions, loading: historyLoading, errorMsg: historyError, fetchTransactionHistory, statsMetrics } = useTransactionHistory()

// Presale stats (would typically come from an API/contract)
const PRESALE_ALLOCATION =  1_000_000_000 // Total tokens in presale
const TOKENS_SOLD = computed(() => statsMetrics.value.totalS3mtPurchased) // Tokens sold so far
const SALE_PROGRESS = computed(() => Math.min(100, (TOKENS_SOLD.value / PRESALE_ALLOCATION) * 100))

// End date for the presale
const PRESALE_END_DATE = new Date('2024-07-25T23:59:59Z')
const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let countdownTimer: any = null

// Define an interface for the transaction object structure if not already defined
interface Transaction {
  buyer?: string;
  s3mtAmount: number | string;
  blockTime?: number;
  currency: string;
}

onMounted(() => {
  fetchTransactionHistory()
})
const recentPurchases = computed(() =>
  transactions.value.slice(0, 5).map((tx: Transaction) => ({
    address: tx.buyer || '',
    amount: Number(tx.s3mtAmount),
    timestamp: tx.blockTime ? new Date(tx.blockTime * 1000) : new Date(),
    currency: tx.currency
  }))
)

const fixIdlPublicKeys = (idl: any) => {
  // First ensure IDL has a metadata.address field that's a valid PublicKey string
  const fixedIdl = {
    ...idl,
    metadata: {
      ...(idl.metadata || {}),
      address: presaleProgramId
    }
  };

  // Convert address fields to proper public key strings
  if (fixedIdl.accounts) {
    fixedIdl.accounts = fixedIdl.accounts.map((account: any) => {
      if (account.pda?.seeds) {
        account.pda.seeds = account.pda.seeds.map((seed: any) => {
          return seed;
        });
      }
      return account;
    });
  }

  // Also fix any instruction account addresses
  if (fixedIdl.instructions) {
    fixedIdl.instructions = fixedIdl.instructions.map((instruction: any) => {
      if (instruction.accounts) {
        instruction.accounts = instruction.accounts.map((account: any) => {
          if (account.address && !account.address.startsWith('1')) {
            // Only convert if it seems like a PublicKey
            try {
              account.address = new PublicKey(account.address).toString();
            } catch (e) {
              // Not a valid PublicKey, leave it as is
            }
          }
          return account;
        });
      }
      return instruction;
    });
  }

  return fixedIdl;
};

function updateCountdown() {
  const now = new Date()
  const diff = PRESALE_END_DATE.getTime() - now.getTime()
  
  if (diff <= 0) {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    clearInterval(countdownTimer)
    return
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  countdown.value = { days, hours, minutes, seconds }
}

// Mock function to fetch SOL price from an oracle
async function fetchSolPrice() {
  try {
    isFetchingPrice.value = true;
    
    // In production, replace this with an actual API call to a price oracle
    // For example:
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const data = await response.json();
    solPrice.value = data.solana.usd;
    
    // For development, simulate API delay and randomly fluctuate the price slightly
    // await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Random price fluctuation (±2%) to simulate market movement
    // const fluctuation = 1 + (Math.random() * 0.04 - 0.02);
    // solPrice.value = 169.42 * fluctuation;
    
    console.log(`Updated SOL price: $${solPrice.value.toFixed(2)}`);
  } catch (error) {
    console.error('Failed to fetch SOL price:', error);
    // Fallback to a default price if fetch fails
    solPrice.value = 169.42;
  } finally {
    isFetchingPrice.value = false;
  }
}

// Watch for currency changes to refetch price when switching to SOL
watch(currency, (newCurrency: 'USDC' | 'SOL') => {
  if (newCurrency === 'SOL') {
    fetchSolPrice();
  }
});

// Function to fetch wallet balances
async function fetchWalletBalances() {
  if (!connected.value || !publicKey.value) {
    walletBalances.value = { sol: null, usdc: null };
    return;
  }

  isFetchingBalances.value = true;
  console.log('Fetching wallet balances...');
  
  try {
    // Create a fresh object to ensure reactivity
    const newBalances = { 
      sol: null as number | null, 
      usdc: null as number | null 
    };
    
    // Fetch SOL balance
    const solBalance = await connection.getBalance(publicKey.value);
    newBalances.sol = solBalance;
    console.log('SOL balance:', solBalance / LAMPORTS_PER_SOL);
    
    // Fetch USDC balance
    try {
      const usdcMint = new PublicKey(usdcMintAddress);
      const usdcTokenAccount = await getAssociatedTokenAddress(
        usdcMint,
        publicKey.value
      );
      
      try {
        const accountInfo = await getAccount(connection, usdcTokenAccount);
        newBalances.usdc = Number(accountInfo.amount);
        console.log('USDC balance:', newBalances.usdc / 1000000);
      } catch (error) {
        // Token account might not exist yet
        console.log("USDC account not found or has no balance");
        newBalances.usdc = 0;
      }
    } catch (error) {
      console.error("Error fetching USDC balance:", error);
      newBalances.usdc = 0;
    }
    
    // Update the reactive state with the new object to ensure Vue detects the change
    walletBalances.value = newBalances;
  } catch (error) {
    console.error("Error fetching wallet balances:", error);
    walletBalances.value = { sol: 0, usdc: 0 };
  } finally {
    isFetchingBalances.value = false;
  }
}

// Watch for wallet connection status changes
watch(connected, async (isConnected: boolean) => {
  if (isConnected && publicKey.value) {
    await fetchWalletBalances();
  }
})

// Lifecycle hooks
onMounted(() => {
  updateCountdown()
  countdownTimer = setInterval(updateCountdown, 1000)
  
  // Fetch SOL price initially on load
  fetchSolPrice()
  
  // For development - periodically refresh SOL price to simulate market movement
  const priceRefreshInterval = setInterval(() => {
    if (currency.value === 'SOL') {
      fetchSolPrice()
    }
  }, 30000) // Every 30 seconds
  
  // Fetch wallet balances if wallet is already connected
  if (connected.value && publicKey.value) {
    fetchWalletBalances()
  }
  
  // Clean up interval on component unmount
  onUnmounted(() => {
    clearInterval(priceRefreshInterval)
    // Also clear the countdown timer
    if (countdownTimer) {
      clearInterval(countdownTimer);
    }
  })
})

// Purchase handler wiring to Anchor program
async function onPurchase() {
  if (!connected.value || !publicKey.value || amount.value <= 0) {
    errorMsg.value = 'Wallet not connected or invalid amount'
    return
  }
  loading.value = true
  errorMsg.value = ''
  success.value = false
  try {
    const programId = new PublicKey(presaleProgramId)
    const provider = new AnchorProvider(
        connection,
        wallet.value,
        { commitment: 'confirmed' }
      );
    const program = new Program(fixIdlPublicKeys(presaleIdl), provider)

    // Derive the presale config PDA
    const [configPda] = await PublicKey.findProgramAddress(
      [Buffer.from('config')],
      programId
    )

    const s3mtAmountBn = new BN(amount.value)

    if (currency.value === 'USDC') {
      // Compute USDC amount in 6-decimal base units
      const usdcAmountBn = new BN(Math.round(amount.value * PRICE * 1e6))

      // Derive associated token accounts
      const buyerUsdcAta = await getAssociatedTokenAddress(
        new PublicKey(usdcMintAddress),
        publicKey.value
      )
      const treasuryUsdcAta = await getAssociatedTokenAddress(
        new PublicKey(usdcMintAddress),
        new PublicKey(treasuryAddress)
      )

      // Call purchase_usdc
      const txSigUsdc = await program.methods
        .purchaseUsdc(usdcAmountBn, s3mtAmountBn)
        .accounts({
          buyer: publicKey.value,
          buyerUsdcAccount: buyerUsdcAta,
          treasuryUsdcAccount: treasuryUsdcAta,
          config: configPda,
          usdcMint: new PublicKey(usdcMintAddress),
          tokenProgram: TOKEN_PROGRAM_ID,
          clock: SYSVAR_CLOCK_PUBKEY
        })
        .rpc()
      transactionSignature.value = txSigUsdc
    } else {
      // For SOL: calculate using SOL price instead of fixed USD conversion
      const solCost = totalCost.value;
      const lamportsBn = new BN(
        Math.round(solCost * LAMPORTS_PER_SOL)
      )

      // Call purchase_sol
      const txSigSol = await program.methods
        .purchaseSol(lamportsBn, s3mtAmountBn)
        .accounts({
          buyer: publicKey.value,
          treasury: new PublicKey(treasuryAddress),
          config: configPda,
          clock: SYSVAR_CLOCK_PUBKEY,
          systemProgram: SystemProgram.programId
        })
        .rpc()
      transactionSignature.value = txSigSol
    }

    success.value = true
    
    // Refresh balances after successful purchase
    fetchWalletBalances()
    
    // Also refresh transaction history
    fetchTransactionHistory()
    
  } catch (err) {
    console.error(err)
    errorMsg.value = err instanceof Error ? err.message : String(err)
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
    <div class="particles-container absolute inset-0 overflow-hidden pointer-events-none"></div>

    <FoundersHeader />

    <FoundersStats
      :tokens-sold="TOKENS_SOLD"
      :presale-allocation="PRESALE_ALLOCATION"
      :sale-progress="SALE_PROGRESS"
      :formatted-token-price="formattedTokenPrice"
      :countdown="countdown"
    />

    <FoundersPurchaseForm
      :currency="currency"
      :sol-price="solPrice"
      :is-fetching-price="isFetchingPrice"
      :amount="amount"
      :is-valid="isValid"
      :formatted-total-cost="formattedTotalCost"
      :formatted-token-price="formattedTokenPrice"
      :total-cost-in-usd="totalCostInUsd"
      :total-cost="totalCost"
      :connected="connected"
      :loading="loading"
      :success="success"
      :error-msg="errorMsg"
      :transaction-signature="transactionSignature"
      :wallet-balances="walletBalances"
      @update:currency="currency = $event"
      @update:amount="amount = $event"
      @purchase="onPurchase"
      @fetch-balances="fetchWalletBalances"
    />

    <FoundersRecentPurchases 
      :recent-purchases="recentPurchases" 
      :loading="historyLoading" 
      :error-msg="historyError" 
      @refresh="fetchTransactionHistory" 
    />
  </div>
</template>

<!-- Removed scoped styles; using global CSS and component-level styles -->
