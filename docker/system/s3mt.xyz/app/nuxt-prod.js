// Read and parse the original env vars
const originalEnv = process.env

// Helper to safely parse JSON if string is JSON
const safeJsonParse = (str, fallback = {}) => {
  try {
    return typeof str === 'string' ? JSON.parse(str) : str || fallback
  } catch {
    return fallback
  }
}

// Setup runtime config environment variables
const setupNuxtEnv = () => {
  // Handle root level config
  process.env.NUXT_COMMIT_SHA_FRONT = originalEnv.COMMIT_SHA_FRONT
  // Handle public config
  process.env.NUXT_PUBLIC_COMMIT_SHA_FRONT = originalEnv.COMMIT_SHA_FRONT
  process.env.NUXT_PUBLIC_CLIENT_REQUEST_TIMEOUT =originalEnv.CLIENT_REQUEST_TIMEOUT
  process.env.NUXT_PUBLIC_SOLANA_NETWORK = originalEnv.SOLANA_NETWORK
  process.env.NUXT_PUBLIC_SOLANA_RPC_URL = originalEnv.SOLANA_RPC_URL
  process.env.NUXT_PUBLIC_PRESALE_PROGRAM_ID = originalEnv.PRESALE_PROGRAM_ID
  process.env.NUXT_PUBLIC_PRESALE_END_DATE = originalEnv.PRESALE_END_DATE
  process.env.NUXT_PUBLIC_USDC_MINT = originalEnv.USDC_MINT
  process.env.NUXT_PUBLIC_TREASURY = originalEnv.TREASURY
}

// Run the setup
setupNuxtEnv()

// Import and run the production server
import('./.output/server/index.mjs').catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
