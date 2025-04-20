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
      await program.methods
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
    } else {
      // Compute lamports for SOL purchase
      const lamportsBn = new BN(
        Math.round(amount.value * PRICE * LAMPORTS_PER_SOL)
      )

      // Call purchase_sol
      await program.methods
        .purchaseSol(lamportsBn, s3mtAmountBn)
        .accounts({
          buyer: publicKey.value,
          treasury: new PublicKey(treasuryAddress),
          config: configPda,
          clock: SYSVAR_CLOCK_PUBKEY,
          systemProgram: SystemProgram.programId
        })
        .rpc()
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
  <div class="mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
    <h1 class="text-4xl font-bold text-center mb-6">Founders Presale</h1>
    <p class="text-center mb-8 text-gray-300">
      Get in early and support the project. Price: <span class="font-semibold">$0.10</span> per unit.
    </p>

    <div class="bg-gray-800/70 rounded-xl p-6 border border-gray-700 space-y-4">
      <div>
        <label for="currency" class="block text-sm font-medium text-gray-200">Currency</label>
        <select
          id="currency"
          v-model="currency"
          class="mt-1 block w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2"
        >
          <option value="USDC">USDC</option>
          <option value="SOL">SOL</option>
        </select>
      </div>

      <div>
        <label for="amount" class="block text-sm font-medium text-gray-200">Amount</label>
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          min="0"
          step="0.01"
          placeholder="Enter amount"
          class="mt-1 block w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-200">Total Cost</label>
        <p class="mt-1 text-white font-semibold">{{ formatCurrency(totalCost) }}</p>
      </div>

      <button
        class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-md py-2 disabled:opacity-50"
        :disabled="!isValid || loading"
        @click="onPurchase"
      >
        <span v-if="loading">Purchasing...</span>
        <span v-else>Purchase</span>
      </button>

      <p v-if="errorMsg" class="text-red-500 text-sm mt-2 text-center">{{ errorMsg }}</p>
      <p v-if="success" class="text-green-400 text-sm mt-2 text-center">Purchase successful!</p>
    </div>
  </div>
</template>

<style>
@import 'animate.css';
</style>