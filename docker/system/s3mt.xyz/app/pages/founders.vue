<script setup lang="ts">
import { useWallet, useAnchorWallet } from 'solana-wallets-vue'
import { Connection, PublicKey, SystemProgram, SYSVAR_CLOCK_PUBKEY, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { AnchorProvider, Program, BN } from '@coral-xyz/anchor'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import presaleIdl from '~/programs/s3mt_presale.idl.json'

useSWV()

useHead({
  title: 'Founders Presale',
  meta: [{ name: 'description', content: 'Founders presale - get in early at $0.10 per unit.' }]
})

console.log(presaleIdl)

// Constants & reactive state
const PRICE = 0.10
const currency = ref('USDC')
const amount = ref(0)
const totalCost = computed(() => PRICE * amount.value)
const isValid = computed(() => amount.value > 0)

// Wallet & UI state
const { connected, publicKey } = useWallet()
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

function formatCurrency(val) {
  return '$' + val.toFixed(2)
}

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
      // Compute lamports for SOL purchase
      const lamportsBn = new BN(
        Math.round(amount.value * PRICE * LAMPORTS_PER_SOL)
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
    <!-- Enhanced Header with Gradient -->
    <div class="mb-12 text-center">
      <h1 class="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600">
        Founders Presale
      </h1>
      <p class="text-gray-400 max-w-2xl mx-auto">
        Get in early and support the project at <span class="font-semibold text-white">$0.10</span> per unit. Limited availability.
      </p>
    </div>

    <!-- Main Purchase Form in Glass Card -->
    <div class="relative mb-10 animate__animated animate__fadeIn">
      <!-- Background Gradient Effect -->
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-500/20 to-indigo-700/20 rounded-xl blur-xl opacity-30"></div>
      
      <!-- Glass Container -->
      <div class="relative bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-xl">
        <!-- Form Header Stats -->
        <div class="p-5 border-b border-gray-700/70 bg-gray-800/90 flex justify-between items-center">
          <div>
            <h3 class="text-xl font-semibold text-white">Purchase S3MT Tokens</h3>
            <p class="text-gray-400 text-sm">Current Price: $0.10 per token</p>
          </div>
          <div v-if="connected" class="text-sm text-green-400 flex items-center">
            <span class="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
            <span>Wallet Connected</span>
          </div>
          <div v-else class="text-sm text-yellow-500 flex items-center">
            <span class="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
            <span>Connect Wallet</span>
          </div>
        </div>
        
        <!-- Form Body with Enhanced Controls -->
        <div class="p-6 space-y-6">
          <!-- Currency Selection with Icons -->
          <div>
            <label for="currency" class="block text-sm font-medium text-gray-300 mb-2">Select Currency</label>
            <div class="grid grid-cols-2 gap-4">
              <div 
                @click="currency = 'USDC'"
                :class="[
                  'flex items-center justify-center cursor-pointer p-3 rounded-lg border transition-all',
                  currency === 'USDC' 
                    ? 'bg-blue-900/40 border-blue-500/50 shadow-md shadow-blue-500/10' 
                    : 'bg-gray-800/70 border-gray-700 hover:bg-gray-700/50'
                ]"
              >
                <span class="text-blue-300 text-lg mr-2">$</span>
                <span :class="currency === 'USDC' ? 'text-white' : 'text-gray-400'">USDC</span>
              </div>
              <div 
                @click="currency = 'SOL'"
                :class="[
                  'flex items-center justify-center cursor-pointer p-3 rounded-lg border transition-all',
                  currency === 'SOL' 
                    ? 'bg-purple-900/40 border-purple-500/50 shadow-md shadow-purple-500/10' 
                    : 'bg-gray-800/70 border-gray-700 hover:bg-gray-700/50'
                ]"
              >
                <svg class="h-5 w-5 mr-2" :class="currency === 'SOL' ? 'text-purple-300' : 'text-gray-500'" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M93.94 42.86H13.72a2.62 2.62 0 0 1-1.85-4.47L31.09 19.17a2.62 2.62 0 0 1 1.85-.77h80.22a2.62 2.62 0 0 1 1.85 4.47L95.79 42.09a2.62 2.62 0 0 1-1.85.77Z" fill="currentColor"/>
                  <path d="M93.94 109.6H13.72a2.62 2.62 0 0 1-1.85-4.47l19.22-19.22a2.62 2.62 0 0 1 1.85-.76h80.22a2.62 2.62 0 0 1 1.85 4.47L95.79 108.83a2.62 2.62 0 0 1-1.85.77Z" fill="currentColor"/>
                  <path d="M114.6 76.5H34.38a2.62 2.62 0 0 1-1.85-4.47l19.22-19.22a2.62 2.62 0 0 1 1.85-.77H114.6a2.62 2.62 0 0 1 1.85 4.47L97.23 75.73a2.62 2.62 0 0 1-1.85.77Z" fill="currentColor"/>
                </svg>
                <span :class="currency === 'SOL' ? 'text-white' : 'text-gray-400'">SOL</span>
              </div>
            </div>
          </div>

          <!-- Amount Input -->
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-300 mb-2">Amount of S3MT Tokens</label>
            <div class="relative mt-1">
              <input
                id="amount"
                type="number"
                v-model.number="amount"
                min="0"
                step="0.01"
                placeholder="Enter amount"
                class="block w-full bg-gray-800 border-2 border-gray-700 focus:border-indigo-500 text-white rounded-lg p-3 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span class="text-gray-400">S3MT</span>
              </div>
            </div>
          </div>

          <!-- Summary Card -->
          <div class="bg-gray-800/70 rounded-lg p-4 border border-gray-700/50">
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-400">Price per token:</span>
              <span class="text-white font-medium">$0.10</span>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-400">Total tokens:</span>
              <span class="text-white font-medium">{{ amount > 0 ? amount.toLocaleString() : '0' }}</span>
            </div>
            <div class="h-px bg-gray-700 my-3"></div>
            <div class="flex justify-between items-center">
              <span class="text-gray-300 font-medium">Total Cost:</span>
              <span class="text-xl font-bold text-white">{{ formatCurrency(totalCost) }}</span>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            @click="onPurchase"
            :disabled="!isValid || loading"
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg py-3 shadow-lg disabled:opacity-50 transition-all duration-200 relative overflow-hidden group"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <span v-else>Purchase Tokens</span>
            <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-400/0 via-white/10 to-indigo-400/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Status Feedback -->
    <!-- Error Message -->
    <div v-if="errorMsg" class="mb-6 animate__animated animate__fadeIn animate__faster">
      <div class="bg-red-900/30 border border-red-700/50 rounded-lg p-4 shadow-lg">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-300">{{ errorMsg }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="success" class="mb-6 animate__animated animate__fadeIn animate__faster">
      <div class="bg-green-900/30 border border-green-700/50 rounded-lg p-4 shadow-lg">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm text-green-300 font-medium">Purchase successful!</p>
            
            <!-- Transaction Info -->
            <div v-if="transactionSignature" class="mt-2 p-3 bg-gray-800/80 rounded-md border border-gray-700/50">
              <p class="text-xs text-gray-400 mb-1">Transaction ID:</p>
              <div class="flex items-center">
                <code class="text-xs font-mono text-indigo-300 truncate mr-2 flex-1">{{ transactionSignature }}</code>
                <a
                  :href="`https://solscan.io/tx/${transactionSignature}?cluster=devnet`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-indigo-400 hover:text-indigo-300 transition-colors flex-shrink-0"
                >
                  <span class="sr-only">View on Solscan</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Import animate.css for animations */
@import 'animate.css';

/* Custom input styling */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>