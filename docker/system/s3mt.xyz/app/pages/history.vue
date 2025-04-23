<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useWallet } from 'solana-wallets-vue'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { AnchorProvider, Program, BN } from '@coral-xyz/anchor' // Import Anchor items
import presaleIdl from '~/programs/s3mt_presale.idl.json' // Import the IDL

useSWV()

useHead({
  title: 'Transaction History',
  meta: [{ name: 'description', content: 'View presale transaction history.' }]
})

// Define a type for better structure
interface ParsedTransaction {
  signature: string;
  blockTime: number | null | undefined;
  buyer: string | null;
  s3mtAmount: string;
  cost: string;
  currency: 'SOL' | 'USDC' | 'N/A';
  isUserTransaction: boolean;
}

// Wallet & UI state
const { connected, publicKey } = useWallet()
const loading = ref(false)
const errorMsg = ref('')
const transactions = ref<ParsedTransaction[]>([]) // Use the interface

// Environment variables & Connection
const config = useRuntimeConfig()
const rpcUrl = config.public.solanaNetwork
const presaleProgramId = new PublicKey(config.public.presaleProgramId)
const usdcMintAddress = new PublicKey(config.public.usdcMint) // Needed for parsing USDC tx
const connection = new Connection(rpcUrl, { commitment: 'finalized' }) // Use finalized for history

// --- Anchor Setup for Parsing ---
// Create a dummy provider as we only need the connection and coder
const provider = new AnchorProvider(connection, {} as any, { commitment: 'confirmed' });
// Helper to fix IDL PublicKey strings if necessary (copy from founders.vue or ensure IDL is correct)
const fixIdlPublicKeys = (idl: any) => {
  return { ...idl, metadata: { ...(idl.metadata || {}), address: presaleProgramId.toString() } };
};
const program = new Program(fixIdlPublicKeys(presaleIdl as any), provider);
// --- End Anchor Setup ---


async function fetchAndParseTransactions() {
  loading.value = true
  errorMsg.value = ''
  transactions.value = []
  try {
    // 1. Fetch Signatures
    const signaturesInfo = await connection.getSignaturesForAddress(presaleProgramId, { limit: 100 })

    if (!signaturesInfo || signaturesInfo.length === 0) {
      errorMsg.value = 'No transactions found for this program yet.'
      loading.value = false
      return
    }

    const signatures = signaturesInfo.map(sigInfo => sigInfo.signature)

    // 2. Fetch Full Transaction Details
    // Note: getTransactions can sometimes return null for slots that were skipped
    const fetchedTxs = await connection.getTransactions(signatures, {
      commitment: 'finalized',
      maxSupportedTransactionVersion: 0 // Specify version if needed, 0 for legacy/v0
    })

    const parsedTxs: ParsedTransaction[] = []

    // 3. Parse Each Transaction
    for (let i = 0; i < fetchedTxs.length; i++) {
      const tx = fetchedTxs[i]
      const sigInfo = signaturesInfo[i] // Get corresponding sigInfo for blockTime

      if (!tx || !tx.transaction || !tx.meta) {
        console.warn(`Skipping null transaction for signature: ${signatures[i]}`)
        continue; // Skip if transaction data is null
      }

      let parsedData: ParsedTransaction = {
        signature: signatures[i],
        blockTime: sigInfo?.blockTime, // Use blockTime from sigInfo
        buyer: null,
        s3mtAmount: 'N/A',
        cost: 'N/A',
        currency: 'N/A',
        isUserTransaction: false
      }

      try {
        // Find the instruction related to our program
        const ix = tx.transaction.message.instructions.find(ix =>
          tx.transaction.message.accountKeys[ix.programIdIndex].equals(presaleProgramId)
        );

        if (ix && 'data' in ix) {
          const decodedIx = program.coder.instruction.decode(ix.data, 'base58');

          if (decodedIx) {
            const accounts = tx.transaction.message.accountKeys;
            // Buyer is typically the first account passed to purchase_* methods
            const buyerPk = accounts[ix.accounts[0]]; // Assuming buyer is index 0
            parsedData.buyer = buyerPk.toBase58();

            // Check if this transaction belongs to the connected user
            if (publicKey.value && buyerPk.equals(publicKey.value)) {
              parsedData.isUserTransaction = true;
            }

            // Extract data based on instruction name
            if (decodedIx.name === 'purchaseUsdc') {
              const s3mtAmount = decodedIx.data.s3mtAmount as BN;
              const usdcAmount = decodedIx.data.usdcAmount as BN; // Amount in smallest unit (1e6)
              parsedData.s3mtAmount = s3mtAmount.toString();
              parsedData.cost = (usdcAmount.toNumber() / 1e6).toFixed(6); // Format USDC
              parsedData.currency = 'USDC';
            } else if (decodedIx.name === 'purchaseSol') {
              const s3mtAmount = decodedIx.data.s3mtAmount as BN;
              const lamports = decodedIx.data.lamports as BN; // Amount in lamports (1e9)
              parsedData.s3mtAmount = s3mtAmount.toString();
              parsedData.cost = (lamports.toNumber() / LAMPORTS_PER_SOL).toFixed(9); // Format SOL
              parsedData.currency = 'SOL';
            }
          } else {
             console.warn(`Could not decode instruction for signature: ${parsedData.signature}`);
          }
        } else {
           console.warn(`No instruction found for program ${presaleProgramId} in signature: ${parsedData.signature}`);
        }
      } catch (parseError) {
        console.error(`Error parsing transaction ${parsedData.signature}:`, parseError)
        // Keep basic info even if parsing fails
      }
      parsedTxs.push(parsedData)
    } // End loop

    transactions.value = parsedTxs

  } catch (err) {
    console.error('Error fetching or parsing transactions:', err)
    errorMsg.value = err instanceof Error ? err.message : String(err)
  } finally {
    loading.value = false
  }
}

// Format timestamp
function formatTimestamp(unixTimestamp: number | null | undefined): string {
  if (unixTimestamp === null || typeof unixTimestamp === 'undefined') return 'N/A'
  return new Date(unixTimestamp * 1000).toLocaleString()
}

// Truncate public key
function truncateKey(key: string | null | undefined): string {
  if (!key) return 'N/A'
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`
}

onMounted(() => {
  fetchAndParseTransactions() // Call the new combined function
})
</script>

<template>
  <div class="mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
    <h1 class="text-4xl font-bold text-center mb-8">Transaction History</h1>

    <div v-if="loading" class="text-center text-gray-400 my-10">
      <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="text-lg align-middle">Loading & Parsing History...</span>
    </div>
    <div v-else-if="errorMsg" class="text-center text-red-500 bg-red-900/30 border border-red-700 p-4 rounded-lg">
      {{ errorMsg }}
    </div>
    <div v-else-if="transactions.length > 0" class="bg-gray-800/70 rounded-xl border border-gray-700 overflow-hidden shadow-lg">
      <table class="min-w-full divide-y divide-gray-700">
        <thead class="bg-gray-700/50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Buyer</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Amount (S3MT)</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Cost</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Transaction</th>
          </tr>
        </thead>
        <tbody class="bg-gray-800 divide-y divide-gray-700">
          <tr
            v-for="tx in transactions"
            :key="tx.signature"
            :class="{'bg-indigo-900/40': tx.isUserTransaction, 'hover:bg-gray-700/50': true}"
            class="transition-colors duration-150"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ formatTimestamp(tx.blockTime) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono" :title="tx.buyer ?? 'N/A'">{{ truncateKey(tx.buyer) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200 text-right">{{ tx.s3mtAmount }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200 text-right">{{ tx.cost }} <span class="text-xs text-gray-400">{{ tx.currency }}</span></td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-indigo-400">
              <a
                :href="`https://solscan.io/tx/${tx.signature}?cluster=devnet`"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-indigo-300 underline"
                :title="tx.signature"
              >
                {{ truncateKey(tx.signature) }}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-center text-gray-400 mt-8">
      No transactions found or processed.
    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles if needed */
</style> 