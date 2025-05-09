import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRuntimeConfig } from '#app'
import { Connection, PublicKey, LAMPORTS_PER_SOL, Message, VersionedMessage, TransactionInstruction } from '@solana/web3.js'
import { AnchorProvider, Program, BN } from '@coral-xyz/anchor'
import presaleIdl from '~/programs/s3mt_presale.idl.json'
import { Buffer } from 'buffer'
import bs58 from 'bs58'

// Parsed transaction structure for presale
export interface ParsedTransaction {
  signature: string
  blockTime: number | null | undefined
  buyer: string | null
  s3mtAmount: string
  cost: string
  currency: 'SOL' | 'USDC' | 'N/A'
}

// Helper function to introduce a delay
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function useTransactionHistory() {
  const transactions = ref<ParsedTransaction[]>([])
  const loading = ref(false)
  const errorMsg = ref('')
  const refreshIntervalId = ref<NodeJS.Timeout | null>(null)

  const REFRESH_INTERVAL_MS = 60000 // 1 minute
  const TRANSACTION_FETCH_BATCH_SIZE = 40; // Max 50 for getTransactions, use slightly less to be safe
  const FETCH_DELAY_MS = 250; // 40 txs / 0.25s = 160 TPS for getTransactions (well within typical limits for single method, overall ~4 calls/sec)

  const config = useRuntimeConfig()
  const rpcUrl = config.public.solanaNetwork
  const programId = new PublicKey(config.public.presaleProgramId)
  const connection = new Connection(rpcUrl, { commitment: 'finalized' })
  const provider = new AnchorProvider(connection, {} as any, { commitment: 'confirmed' })

  // Fix IDL metadata address
  function fixIdl(idl: any) {
    return {
      ...idl,
      metadata: { ...(idl.metadata || {}), address: programId.toString() }
    }
  }

  const program = new Program(fixIdl(presaleIdl as any), provider)

  // Fetch and parse all presale transactions
  async function fetchTransactionHistory() {
    if (loading.value) return;
    console.log('fetchTransactionHistory')
    loading.value = true
    errorMsg.value = ''
    transactions.value = []
    try {
      // 1. Fetch all signatures for the program
      const allSigInfos: any[] = []
      let before: string | undefined = undefined
      const limit = 100
      while (true) {
        const sigInfos = await connection.getSignaturesForAddress(
          programId,
          { limit, before },
          'finalized'
        )
        if (!sigInfos.length) break
        allSigInfos.push(...sigInfos)
        before = sigInfos[sigInfos.length - 1].signature
        if (allSigInfos.length > 2000) break
      }
      if (!allSigInfos.length) {
        errorMsg.value = 'No transactions found.'
        loading.value = false; // Ensure loading is set to false
        return
      }
      const sigs = allSigInfos.map(s => s.signature)

      // 2. Fetch transactions in batches
      const fetchedTransactionsData: (import('@solana/web3.js').ConfirmedSignatureInfo | import('@solana/web3.js').TransactionResponse | import('@solana/web3.js').VersionedTransactionResponse | null)[] = [];
      for (let i = 0; i < sigs.length; i += TRANSACTION_FETCH_BATCH_SIZE) {
        const batchSigs = sigs.slice(i, i + TRANSACTION_FETCH_BATCH_SIZE);
        console.log(`Fetching batch ${i / TRANSACTION_FETCH_BATCH_SIZE + 1} of ${Math.ceil(sigs.length / TRANSACTION_FETCH_BATCH_SIZE)}, ${batchSigs.length} transactions`)
        const batchFetched = await connection.getTransactions(batchSigs, {
          commitment: 'finalized',
          maxSupportedTransactionVersion: 0
        });
        fetchedTransactionsData.push(...batchFetched);
        if (i + TRANSACTION_FETCH_BATCH_SIZE < sigs.length) {
          await delay(FETCH_DELAY_MS); // Delay between batch fetches
        }
      }

      const parsed: ParsedTransaction[] = []
      // Helper to load lookup table keys
      async function resolveLookupKeys(lookups: any[]) {
        const keys: PublicKey[] = []
        for (const lk of lookups) {
          try {
            const table = await connection.getAddressLookupTable(lk.accountKey)
            if (table.value) keys.push(...table.value.state.addresses)
          } catch {}
        }
        return keys
      }

      for (let i = 0; i < fetchedTransactionsData.length; i++) {
        const txc = fetchedTransactionsData[i]
        const currentSignature = sigs[i]; // Signature for the current transaction
        const info = allSigInfos.find(si => si.signature === currentSignature);

        if (!txc || !txc.transaction || !txc.meta) continue
        const pd: ParsedTransaction = {
          signature: currentSignature,
          blockTime: info?.blockTime,
          buyer: null,
          s3mtAmount: 'N/A',
          cost: 'N/A',
          currency: 'N/A'
        }
        try {
          const msg = txc.transaction.message
          let accountKeys: PublicKey[] = []
          let instrs: { programIdIndex: number; accounts: number[]; data: Buffer }[] = []
          if ('addressTableLookups' in msg) {
            const vm = msg as VersionedMessage
            accountKeys = vm.staticAccountKeys.concat(
              await resolveLookupKeys(vm.addressTableLookups)
            )
            instrs = vm.compiledInstructions.map(ci => ({
              programIdIndex: ci.programIdIndex,
              accounts: ci.accountKeyIndexes,
              data: Buffer.from(ci.data)
            }))
          } else {
            const lm = msg as Message
            accountKeys = lm.accountKeys
            instrs = lm.instructions.map((ix: TransactionInstruction) => ({
              programIdIndex: ix.programIdIndex,
              accounts: ix.accounts, // These are already indices into message.accountKeys
              data: bs58.decode(ix.data) // Decode base58 string to Buffer
            }))
          }
          // Find presale instruction
          const inst = instrs.find(it => accountKeys[it.programIdIndex].equals(programId))
          if (inst) {
            const decoded = (program.coder.instruction as any).decode(inst.data)
            if (decoded) {
              const buyerKey = accountKeys[inst.accounts[0]]
              pd.buyer = buyerKey.toBase58()
              if (decoded.name === 'purchaseUsdc') {
                const s3 = (decoded.data.s3MtAmount as BN).toString()
                const usdc = (decoded.data.usdcAmount as BN).toNumber() / 1e6
                pd.s3mtAmount = s3
                pd.cost = usdc.toFixed(6)
                pd.currency = 'USDC'
                parsed.push(pd)
              } else if (decoded.name === 'purchaseSol') {
                const s3 = (decoded.data.s3MtAmount as BN).toString()
                const sol = (decoded.data.solAmount as BN).toNumber() / LAMPORTS_PER_SOL
                pd.s3mtAmount = s3
                pd.cost = sol.toFixed(9)
                pd.currency = 'SOL'
                parsed.push(pd)
              }
            }
          }
        } catch (e) {
          console.error('Parse error', e)
        }
      }
      transactions.value = parsed
    } catch (err: any) {
      errorMsg.value = err instanceof Error ? err.message : String(err)
    } finally {
      loading.value = false
    }
  }

  const startAutoRefresh = () => {
    if (refreshIntervalId.value) return // Already running
    fetchTransactionHistory() // Fetch immediately on start
    refreshIntervalId.value = setInterval(fetchTransactionHistory, REFRESH_INTERVAL_MS)
  }

  const stopAutoRefresh = () => {
    if (refreshIntervalId.value) {
      clearInterval(refreshIntervalId.value)
      refreshIntervalId.value = null
    }
  }

  // Start refreshing when the composable is mounted
  onMounted(startAutoRefresh)

  // Stop refreshing when the composable is unmounted
  onUnmounted(stopAutoRefresh)

  const statsMetrics = computed(() => {
    const fetchedTransactions = transactions.value;
    
    // Total number of transactions
    const totalTransactions = fetchedTransactions.length;
    
    // Total S3MT tokens purchased
    const totalS3mtPurchased = fetchedTransactions.reduce((total: number, tx: ParsedTransaction) => {
      if (tx.s3mtAmount && tx.s3mtAmount !== 'N/A') {
        // Try to parse the s3mtAmount
        try {
          return total + Number(tx.s3mtAmount);
        } catch (e) {
          // console.error("Error parsing s3mtAmount in stats:", tx.s3mtAmount, e);
          return total;
        }
      }
      return total;
    }, 0);
    
    // Total spent in each currency
    const totalSpentByType = fetchedTransactions.reduce((acc: Record<string, number>, tx: ParsedTransaction) => {
      if (tx.cost && tx.cost !== 'N/A' && tx.currency && tx.currency !== 'N/A') {
        try {
          const cost = Number(tx.cost);
          acc[tx.currency] = (acc[tx.currency] || 0) + cost;
        } catch (e) {
          // console.error("Error parsing cost in stats:", tx.cost, e);
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
    const last24HoursCount = fetchedTransactions.filter((tx: ParsedTransaction) => {
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
      totalS3mtPurchased: totalS3mtPurchased,
      totalSolSpent,
      totalUsdcSpent,
      avgPurchaseSize,
      last24HoursCount
    };
  });

  return {
    transactions,
    loading,
    errorMsg,
    fetchTransactionHistory,
    statsMetrics,
    startAutoRefresh,
    stopAutoRefresh
  }
}