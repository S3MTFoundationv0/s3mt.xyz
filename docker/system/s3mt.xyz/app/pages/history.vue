<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useWallet } from 'solana-wallets-vue'
import { Connection, PublicKey, LAMPORTS_PER_SOL, type TransactionInstruction, type CompiledInstruction, Message, VersionedMessage, type AccountMeta } from '@solana/web3.js'
import { AnchorProvider, Program, BN, type Idl } from '@coral-xyz/anchor' // Import Anchor items
import presaleIdl from '~/programs/s3mt_presale.idl.json' // Import the IDL
import { Buffer } from 'buffer' // Import Buffer
import * as bs58 from 'bs58' // Import bs58

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
// Cast IDL
const program = new Program(fixIdlPublicKeys(presaleIdl as any) as Idl, provider);
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
    const fetchedTxs = await connection.getTransactions(signatures, {
      commitment: 'finalized',
      maxSupportedTransactionVersion: 0 // Or specify highest supported version
    })

    const parsedTxs: ParsedTransaction[] = []

    // 3. Parse Each Transaction
    for (let i = 0; i < fetchedTxs.length; i++) {
      const tx = fetchedTxs[i]
      const sigInfo = signaturesInfo[i]

      if (!tx || !tx.transaction || !tx.meta) {
        console.warn(`Skipping null transaction for signature: ${signatures[i]}`)
        continue;
      }

      let parsedData: ParsedTransaction = {
        signature: signatures[i],
        blockTime: sigInfo?.blockTime,
        buyer: null,
        s3mtAmount: 'N/A',
        cost: 'N/A',
        currency: 'N/A',
        isUserTransaction: false
      }

      try {
        const message = tx.transaction.message;
        let accountKeys: PublicKey[];
        // Use a common structure for processing instructions
        let processedInstructions: { programIdIndex: number; accounts: number[]; data: string | Uint8Array | Buffer }[] = [];

        // Check for VersionedMessage using property existence
        if ('addressTableLookups' in message) {
           // Versioned Message (potentially V0)
           const msgV0 = message as VersionedMessage; // Cast for type safety
           accountKeys = msgV0.staticAccountKeys.concat(msgV0.addressTableLookups ? await getKeysFromLookups(msgV0.addressTableLookups) : []);
           // Map CompiledInstruction to our common structure
           processedInstructions = msgV0.compiledInstructions.map(ix => ({
             programIdIndex: ix.programIdIndex,
             accounts: ix.accountKeyIndexes, // Use accountKeyIndexes
             data: ix.data // data is typically Uint8Array here
           }));
        } else {
           // Legacy Message
           const msgLegacy = message as Message; // Cast for type safety
           accountKeys = msgLegacy.accountKeys;
           // Map TransactionInstruction to our common structure
           processedInstructions = msgLegacy.instructions.map(ix => ({
             programIdIndex: ix.programIdIndex,
             // Map pubkeys back to indices in the legacy accountKeys array
             accounts: ix.accounts.map(accMeta => accountKeys.findIndex(key => key.equals((accMeta as AccountMeta).pubkey))), // Cast accMeta
             data: ix.data // data is Buffer here
           }));
        }

        // Find the instruction related to our program using the common structure
        const ix = processedInstructions.find(ix =>
          accountKeys[ix.programIdIndex]?.equals(presaleProgramId) // Add optional chaining
        );

        if (ix && ix.data) { // Check if ix and ix.data exist
          let dataBuffer: Buffer;
          // Ensure data is a Buffer for the decoder
          if (ix.data instanceof Uint8Array) {
              dataBuffer = Buffer.from(ix.data);
          } else if (typeof ix.data === 'string') {
              // Use bs58 to decode base58 string
              try {
                  dataBuffer = Buffer.from(bs58.decode(ix.data));
              } catch (e) {
                  console.warn(`Failed to decode base58 data for signature: ${parsedData.signature}`, ix.data, e);
                  continue;
              }
          } else if (Buffer.isBuffer(ix.data)) {
               dataBuffer = ix.data;
          }
           else {
              console.warn(`Instruction data has unexpected type for signature: ${parsedData.signature}`, ix.data);
              continue; // Skip if data type is wrong
          }

          // Use bracket notation for decode
          const decodedIx = program.coder.instruction['decode'](dataBuffer);

          if (decodedIx) {
            // Use the account indices from our common structure
            const buyerAccountIndex = ix.accounts[0]; // Assuming buyer is index 0
            const buyerPk = accountKeys[buyerAccountIndex];
            if (buyerPk) {
              parsedData.buyer = buyerPk.toBase58();
              // Check if this transaction belongs to the connected user
              if (publicKey.value && buyerPk.equals(publicKey.value)) {
                parsedData.isUserTransaction = true;
              }
            } else {
               console.warn(`Could not resolve buyer public key for index ${buyerAccountIndex} in signature: ${parsedData.signature}`);
            }

            // Extract data based on instruction name
            if (decodedIx.name === 'purchaseUsdc') {
              const s3mtAmount = decodedIx.data.solAmount
              const usdcAmount = decodedIx.data.usdcAmount
              parsedData.s3mtAmount = s3mtAmount.toString();
              parsedData.cost = (usdcAmount.toNumber() / 1e6).toFixed(6);
              parsedData.currency = 'USDC';
            } else if (decodedIx.name === 'purchaseSol') {
              const s3mtAmount = decodedIx.data.s3MtAmount
              const solAmount = decodedIx.data.solAmount
              parsedData.s3mtAmount = s3mtAmount.toString();
              parsedData.cost = (solAmount.toNumber() / LAMPORTS_PER_SOL).toFixed(9);
              parsedData.currency = 'SOL';
            }
          } else {
             console.warn(`Could not decode instruction data buffer for signature: ${parsedData.signature}`);
          }
        } else {
           console.warn(`No instruction found for program ${presaleProgramId} or ix.data is missing in signature: ${parsedData.signature}`);
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

// Helper function to resolve Address Lookup Table keys (simplified, might need more robust implementation)
async function getKeysFromLookups(lookups: any[]): Promise<PublicKey[]> {
    let keys: PublicKey[] = [];
    for (const lookup of lookups) {
        try {
            // Safety check before accessing accountKey
            if (!lookup || !lookup.accountKey) {
                console.warn("Invalid lookup object found:", lookup);
                continue;
            }
            const tableAccount = await connection.getAddressLookupTable(lookup.accountKey);
            if (tableAccount && tableAccount.value) {
                const lookupKeys = tableAccount.value.state.addresses;
                keys = keys.concat(lookupKeys);
            } else {
              // Log the key safely
              console.warn("Could not fetch or find addresses in lookup table:", lookup.accountKey.toBase58());
            }
        } catch (e) {
            console.error(`Error fetching lookup table for key ${lookup?.accountKey?.toBase58()}:`, e);
        }
    }
    return keys;
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