<script setup lang="ts">
import { useWallet } from 'solana-wallets-vue'
import { Connection, PublicKey, LAMPORTS_PER_SOL, Message, VersionedMessage } from '@solana/web3.js'
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
// Transaction history composable
const { transactions: fetchedTransactions, loading, errorMsg, fetchTransactionHistory } = useTransactionHistory()
onMounted(() => fetchTransactionHistory())

// Create computed property for display
const displayTransactions = computed(() => {
  return fetchedTransactions.value.map((tx: ParsedTransaction) => ({
    ...tx,
    isUserTransaction: !!(publicKey.value && tx.buyer && new PublicKey(tx.buyer).equals(publicKey.value))
  }));
});

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
  fetchedTransactions.value = []
  try {
    // --- Paginated Signature Fetching ---
    const allSignaturesInfo: any[] = []; // Array to hold all signature info objects
    let oldestSignature: string | undefined = undefined;
    const batchLimit = 100; // How many signatures to fetch per RPC call
    console.log("Starting transaction signature fetching...");

    while (true) {
      console.log(`Fetching signatures before: ${oldestSignature || 'start'}`);
      const signaturesInfo = await connection.getSignaturesForAddress(
        presaleProgramId,
        {
          limit: batchLimit,
          before: oldestSignature
        },
        'finalized' // Explicitly request finalized commitment here
      );

      if (signaturesInfo.length === 0) {
        console.log("No more signatures found, breaking loop.");
        break; // Exit loop if no more signatures are found
      }

      allSignaturesInfo.push(...signaturesInfo);
      oldestSignature = signaturesInfo[signaturesInfo.length - 1].signature;
      console.log(`Fetched ${signaturesInfo.length} signatures. Oldest is now: ${oldestSignature}`);

      // Optional: Add a small delay to avoid rate limiting on public RPCs
      // await new Promise(resolve => setTimeout(resolve, 200));

      // Safety break if something goes wrong (e.g., infinite loop possibility)
      if (allSignaturesInfo.length > 2000) { // Adjust limit as needed
         console.warn("Reached signature fetch limit (2000), stopping pagination.");
         break;
      }
    }
    console.log(`Total signatures fetched: ${allSignaturesInfo.length}`);
    // --- End Paginated Fetching ---

    if (allSignaturesInfo.length === 0) {
      errorMsg.value = 'No transactions found for this program yet.'
      loading.value = false
      return
    }

    // Extract just the signatures string array for getTransactions
    const signatures = allSignaturesInfo.map(sigInfo => sigInfo.signature)

    // 2. Fetch Full Transaction Details (Consider batching this if signature list is huge)
    console.log(`Fetching details for ${signatures.length} transactions...`);
    const fetchedTxs = await connection.getTransactions(signatures, {
      commitment: 'finalized',
      maxSupportedTransactionVersion: 0
    })
    console.log(`Fetched details complete.`);

    const parsedTxs: ParsedTransaction[] = []

    // 3. Parse Each Transaction
    console.log("Parsing transactions...");
    for (let i = 0; i < fetchedTxs.length; i++) {
      const tx = fetchedTxs[i]
      // Find corresponding sigInfo using the signature for correct blockTime
      const sigInfo = allSignaturesInfo.find(info => info.signature === signatures[i]);

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
             // Map pubkeys back to indices in the legacy accountKeys array - Fix cast
             accounts: ix.accounts.map(accMeta => accountKeys.findIndex(key => key.equals((accMeta as unknown).pubkey))),
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

          // Use bracket notation for decode - Cast coder to any to suppress linter
          const decodedIx = (program.coder.instruction as any).decode(dataBuffer);

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
              // Standardize field name to s3MtAmount
              const s3MtAmount = decodedIx.data.s3MtAmount as BN;
              const usdcAmount = decodedIx.data.usdcAmount as BN;
              parsedData.s3mtAmount = s3MtAmount.toString();
              parsedData.cost = (usdcAmount.toNumber() / 1e6).toFixed(6);
              parsedData.currency = 'USDC';
            } else if (decodedIx.name === 'purchaseSol') {
              const s3MtAmount = decodedIx.data.s3MtAmount as BN;
              const solAmount = decodedIx.data.solAmount as BN;
              parsedData.s3mtAmount = s3MtAmount.toString();
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

    fetchedTransactions.value = parsedTxs
    console.log("Parsing complete.");

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

// Computed metrics for the stats dashboard
const statsMetrics = computed(() => {
  const transactions = fetchedTransactions.value;
  
  // Total number of transactions
  const totalTransactions = transactions.length;
  
  // Total S3MT tokens purchased
  const totalS3mtPurchased = transactions.reduce((total, tx) => {
    if (tx.s3mtAmount && tx.s3mtAmount !== 'N/A') {
      // Try to parse the s3mtAmount
      try {
        return total + Number(tx.s3mtAmount);
      } catch (e) {
        return total;
      }
    }
    return total;
  }, 0);
  
  // Total spent in each currency
  const totalSpentByType = transactions.reduce((acc, tx) => {
    if (tx.cost && tx.cost !== 'N/A' && tx.currency) {
      try {
        const cost = Number(tx.cost);
        acc[tx.currency] = (acc[tx.currency] || 0) + cost;
      } catch (e) {
        // Skip if we can't parse the cost
      }
    }
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate average purchase size
  const avgPurchaseSize = totalTransactions > 0 
    ? (totalS3mtPurchased / totalTransactions).toFixed(2) 
    : '0';
  
  // Format the SOL and USDC totals nicely
  const totalSolSpent = totalSpentByType['SOL'] ? totalSpentByType['SOL'].toFixed(4) : '0';
  const totalUsdcSpent = totalSpentByType['USDC'] ? totalSpentByType['USDC'].toFixed(2) : '0';
    
  // Recent activity - count transactions in last 24 hours
  const last24HoursCount = transactions.filter(tx => {
    if (tx.blockTime) {
      const txTime = new Date(tx.blockTime * 1000);
      const now = new Date();
      const diffMs = now.getTime() - txTime.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours <= 24;
    }
    return false;
  }).length;
  
  return {
    totalTransactions,
    totalS3mtPurchased: totalS3mtPurchased.toLocaleString(),
    totalSolSpent,
    totalUsdcSpent,
    avgPurchaseSize,
    last24HoursCount
  };
});

onMounted(() => {
  fetchAndParseTransactions() // Call the new combined function
})
</script>

<template>
  <div class="mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
    <!-- Enhanced Header with Gradient -->
    <div class="mb-12 text-center">
      <h1 class="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600">
        Transaction History
      </h1>
      <p class="text-gray-400 max-w-2xl mx-auto">
        Transparent, immutable record of all S3MT presale transactions on the Solana blockchain.
      </p>
    </div>

    <!-- Stats Dashboard -->
    <div v-if="displayTransactions.length > 0" class="mb-10 animate__animated animate__fadeIn">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Total Transactions Card -->
        <div class="bg-gray-800/70 rounded-xl p-5 border border-gray-700/50 shadow-lg backdrop-blur-sm overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 opacity-50 transition-opacity duration-200 group-hover:opacity-70"></div>
          <div class="relative z-10">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-gray-400 text-sm font-medium mb-1">Total Transactions</h3>
                <p class="text-3xl font-bold text-white">{{ statsMetrics.totalTransactions }}</p>
              </div>
              <div class="bg-indigo-500/20 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div class="mt-2 text-xs text-gray-500">
              <span class="text-green-400">{{ statsMetrics.last24HoursCount }}</span> in the last 24 hours
            </div>
          </div>
        </div>

        <!-- Total S3MT Purchased Card -->
        <div class="bg-gray-800/70 rounded-xl p-5 border border-gray-700/50 shadow-lg backdrop-blur-sm overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-green-600/10 to-blue-600/10 opacity-50 transition-opacity duration-200 group-hover:opacity-70"></div>
          <div class="relative z-10">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-gray-400 text-sm font-medium mb-1">Total S3MT Purchased</h3>
                <p class="text-3xl font-bold text-white">{{ statsMetrics.totalS3mtPurchased }}</p>
              </div>
              <div class="bg-green-500/20 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="mt-2 text-xs text-gray-500">
              <span class="text-green-400">{{ statsMetrics.avgPurchaseSize }}</span> tokens average per transaction
            </div>
          </div>
        </div>

        <!-- Total Value Card -->
        <div class="bg-gray-800/70 rounded-xl p-5 border border-gray-700/50 shadow-lg backdrop-blur-sm overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-50 transition-opacity duration-200 group-hover:opacity-70"></div>
          <div class="relative z-10">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-gray-400 text-sm font-medium mb-1">Total Investment</h3>
                <div class="flex items-baseline">
                  <p class="text-3xl font-bold text-white mr-3">{{ statsMetrics.totalSolSpent }} SOL</p>
                  <p class="text-lg font-medium text-gray-400">{{ statsMetrics.totalUsdcSpent }} USDC</p>
                </div>
              </div>
              <div class="bg-purple-500/20 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="mt-2 text-xs text-gray-500 flex items-center">
              <span class="bg-purple-900/50 px-2 py-1 rounded text-purple-300 mr-2">SOL</span>
              <span class="bg-blue-900/50 px-2 py-1 rounded text-blue-300">USDC</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center text-gray-400 my-16">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-12 w-12 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-xl text-indigo-300">Loading Transaction History...</span>
        <p class="text-gray-500 mt-2 animate-pulse">Fetching from Solana blockchain</p>
      </div>
    </div>

    <div v-else-if="errorMsg" class="text-center bg-red-900/30 border border-red-700 p-8 rounded-xl shadow-lg">
      <div class="flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="text-xl font-semibold text-red-400 mb-2">Error Loading Transactions</h3>
        <p class="text-red-300">{{ errorMsg }}</p>
      </div>
    </div>

    <div v-else-if="displayTransactions.length > 0" class="relative">
      <!-- Glass-like container with subtle gradient border -->
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-xl blur-xl opacity-30"></div>
      <div class="relative bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-xl">
        <!-- Table Header Stats -->
        <div class="p-4 border-b border-gray-700/70 bg-gray-800/90">
          <div class="flex flex-wrap justify-between items-center gap-4">
            <div class="text-gray-300">
              <span class="text-sm font-medium">Total Transactions:</span>
              <span class="text-xl ml-2 font-bold text-white">{{ displayTransactions.length }}</span>
            </div>
            <div v-if="connected" class="text-sm text-indigo-300">
              <span class="mr-2 text-gray-400">Connected:</span>
              <span class="font-mono bg-indigo-900/50 py-1 px-2 rounded-md">{{ truncateKey(publicKey?.toBase58()) }}</span>
            </div>
          </div>
        </div>

        <!-- Enhanced Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-700/70">
            <thead class="bg-gray-800/90">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Buyer</th>
                <th scope="col" class="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Amount (S3MT)</th>
                <th scope="col" class="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Cost</th>
                <th scope="col" class="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Transaction</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700/50">
              <tr
                v-for="tx in displayTransactions"
                :key="tx.signature"
                :class="{'bg-indigo-900/40 hover:bg-indigo-800/50': tx.isUserTransaction, 'hover:bg-gray-700/40': !tx.isUserTransaction}"
                class="transition-colors duration-200"
              >
                <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-300">
                  {{ formatTimestamp(tx.blockTime) }}
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                  <div class="flex items-center">
                    <div v-if="tx.isUserTransaction" class="h-2 w-2 rounded-full bg-green-400 mr-2" title="Your transaction"></div>
                    <span class="text-sm font-mono text-gray-300" :title="tx.buyer ?? 'N/A'">
                      {{ truncateKey(tx.buyer) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-right">
                  <span class="text-sm font-medium text-green-400">{{ tx.s3mtAmount }}</span>
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end">
                    <span class="text-sm font-medium text-gray-200 mr-2">{{ tx.cost }}</span>
                    <span class="text-xs font-medium px-2 py-1 rounded-md" 
                      :class="tx.currency === 'SOL' ? 'bg-purple-800/50 text-purple-300' : 'bg-blue-800/50 text-blue-300'">
                      {{ tx.currency }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-center">
                  <a
                    :href="`https://solscan.io/tx/${tx.signature}?cluster=devnet`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-150"
                    :title="tx.signature"
                  >
                    <span class="mr-1 text-sm">{{ truncateKey(tx.signature) }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else class="text-center my-16">
      <div class="flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-xl text-gray-500">No transactions found yet.</p>
        <p class="text-gray-600 mt-2">Be the first to participate in the presale!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add animation classes for stats cards */
@import 'animate.css';

/* Add some subtle animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

tbody tr {
  animation: fadeIn 0.3s ease-out;
  animation-fill-mode: both;
}

tbody tr:nth-child(1) { animation-delay: 0.05s; }
tbody tr:nth-child(2) { animation-delay: 0.1s; }
tbody tr:nth-child(3) { animation-delay: 0.15s; }
tbody tr:nth-child(4) { animation-delay: 0.2s; }
tbody tr:nth-child(5) { animation-delay: 0.25s; }
tbody tr:nth-child(6) { animation-delay: 0.3s; }
tbody tr:nth-child(7) { animation-delay: 0.35s; }
tbody tr:nth-child(8) { animation-delay: 0.4s; }
tbody tr:nth-child(9) { animation-delay: 0.45s; }
tbody tr:nth-child(10) { animation-delay: 0.5s; }

/* Add hover effects for stats cards */
.grid > div {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.grid > div:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}
</style> 