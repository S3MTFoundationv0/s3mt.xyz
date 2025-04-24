import { ref } from 'vue'
import { useRuntimeConfig } from '#app'
import { Connection, PublicKey, LAMPORTS_PER_SOL, Message, VersionedMessage } from '@solana/web3.js'
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

export function useTransactionHistory() {
  const transactions = ref<ParsedTransaction[]>([])
  const loading = ref(false)
  const errorMsg = ref('')

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
        return
      }
      const sigs = allSigInfos.map(s => s.signature)

      // 2. Fetch transactions
      const fetched = await connection.getTransactions(sigs, {
        commitment: 'finalized',
        maxSupportedTransactionVersion: 0
      })

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

      for (let i = 0; i < fetched.length; i++) {
        const txc = fetched[i]
        const info = allSigInfos.find(si => si.signature === sigs[i])
        if (!txc || !txc.transaction || !txc.meta) continue
        const pd: ParsedTransaction = {
          signature: sigs[i],
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
            instrs = lm.instructions.map(ix => ({
              programIdIndex: ix.programIdIndex,
              accounts: ix.accounts.map(a =>
                lm.accountKeys.findIndex(k => k.equals((a as unknown).pubkey))
              ),
              data: Buffer.from(ix.data)
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
              } else if (decoded.name === 'purchaseSol') {
                const s3 = (decoded.data.s3MtAmount as BN).toString()
                const sol = (decoded.data.solAmount as BN).toNumber() / LAMPORTS_PER_SOL
                pd.s3mtAmount = s3
                pd.cost = sol.toFixed(9)
                pd.currency = 'SOL'
              }
            }
          }
        } catch (e) {
          console.error('Parse error', e)
        }
        parsed.push(pd)
      }
      transactions.value = parsed
    } catch (err: any) {
      errorMsg.value = err instanceof Error ? err.message : String(err)
    } finally {
      loading.value = false
    }
  }

  return {
    transactions,
    loading,
    errorMsg,
    fetchTransactionHistory
  }
}