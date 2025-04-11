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
  process.env.NUXT_REDIS_READER = safeJsonParse(originalEnv.REDIS_READER)
  process.env.NUXT_REDIS_PRIMARY = safeJsonParse(originalEnv.REDIS_PRIMARY)
  process.env.NUXT_ENABLE_REDIS_LOGGING =
    originalEnv.ENABLE_REDIS_LOGGING === '1'
  process.env.NUXT_ACS_CONFIG = {
    endpoint: originalEnv.ACS_SEARCH_ENDPOINT || '',
    region: originalEnv.ACS_REGION || '',
    maxAttempts: 3,
    credentials: {
      accessKeyId: originalEnv.ACS_KEY || '',
      secretAccessKey: originalEnv.ACS_SECRET || '',
    },
  }
  process.env.NUXT_LAUNCHPAD_API_PRIVATE_URL = originalEnv.LAUNCHPAD_API_PRIVATE_URL
  process.env.NUXT_JWT_SECRET = originalEnv.JWT_SECRET
  process.env.NUXT_JWT_PRIVATE_KEY = ( originalEnv.JWT_PRIVATE_KEY || '' ).replace(/\\n/g, '\n')
  process.env.NUXT_JWT_PUBLIC_KEY = (originalEnv.JWT_PUBLIC_KEY || '').replace(
    /\\n/g,
    '\n'
  )
  

  // Handle public config
  process.env.NUXT_PUBLIC_COMMIT_SHA_FRONT = originalEnv.COMMIT_SHA_FRONT
  process.env.NUXT_PUBLIC_CLIENT_REQUEST_TIMEOUT =originalEnv.CLIENT_REQUEST_TIMEOUT
  process.env.NUXT_PUBLIC_PUBLIC_VAPID_KEY = originalEnv.PUBLIC_VAPID_KEY
  process.env.NUXT_PUBLIC_API_URL = originalEnv.API_URL
  process.env.NUXT_PUBLIC_API_PORT = originalEnv.API_PORT
  process.env.NUXT_PUBLIC_APP_HOST = originalEnv.APP_HOST
}

// Run the setup
setupNuxtEnv()

// Import and run the production server
import('./.output/server/index.mjs').catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
