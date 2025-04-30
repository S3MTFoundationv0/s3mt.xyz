import type { Ref } from 'vue'
import type { Connection, Transaction, SendOptions, Commitment } from '@solana/web3.js'
import type { PublicKey } from '@solana/web3.js'

/**
 * Composable to abstract signing and sending Solana transactions.
 * Uses wallet adapter's sendTransaction if available, otherwise falls back to signTransaction + sendRawTransaction.
 */
export default function useSignAndSendTransaction(options: {
  /** Solana connection */
  connection: Connection
  /** Public key of the connected wallet (Ref) */
  publicKey: Ref<PublicKey | null | undefined>
  /** Optional wallet adapter sendTransaction method */
  sendTransaction?: (
    transaction: Transaction,
    connection: Connection,
    options?: SendOptions
  ) => Promise<string>
  /** Optional wallet adapter signTransaction method */
  signTransaction?: (transaction: Transaction) => Promise<Transaction>
}) {
  const { connection, publicKey, sendTransaction, signTransaction } = options

  /**
   * Sign and send a transaction, using adapter if available.
   * @param transaction Transaction to sign and send
   * @param opts Send options (preflightCommitment, skipPreflight)
   * @returns transaction signature
   */
  async function signAndSendTransaction(
    transaction: Transaction,
    opts: SendOptions = {}
  ): Promise<string> {
    if (!publicKey.value) {
      throw new Error('Wallet not connected')
    }
    // Set fee payer to the connected wallet
    transaction.feePayer = publicKey.value
    // Populate recent blockhash
    const { blockhash } = await connection.getLatestBlockhash(
      // use provided commitment or default to 'confirmed'
      (opts.preflightCommitment as Commitment) || 'confirmed'
    )
    // @ts-ignore: recentBlockhash exists on Transaction
    transaction.recentBlockhash = blockhash

    // If wallet adapter provides sendTransaction, use it directly
    if (sendTransaction) {
      return await sendTransaction(transaction, connection, opts)
    }

    // Otherwise, sign and send raw transaction
    if (signTransaction) {
      const signed = await signTransaction(transaction)
      const raw = signed.serialize()
      const txid = await connection.sendRawTransaction(raw, opts)
      // Confirm transaction using same commitment
      await connection.confirmTransaction(
        txid,
        (opts.preflightCommitment as Commitment) || 'confirmed'
      )
      return txid
    }

    throw new Error('No wallet method available for sending transaction')
  }

  return { signAndSendTransaction }
}