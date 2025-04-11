export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@vueuse/motion/nuxt'],

  app: {
    head: {
      title: 'S3MT Token Presale',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Simple Sustainable Smart Mining Token (S3MT) Presale' }
      ]
    }
  },

  css: [
    '~/assets/css/main.css',
    // Wallet styles are imported in the plugin
  ],

  runtimeConfig: {
    public: {
      solanaNetwork: process.env.SOLANA_NETWORK || 'devnet',
      presaleEndDate: process.env.PRESALE_END_DATE || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now by default
      motion: {
        directives: {
          // your motion directives if any
        }
      }
    }
  },

  build: {
    transpile: [
      '@solana/wallet-adapter-base',
      '@solana/wallet-adapter-wallets',
      'solana-wallets-vue'
    ]
  },

  vite: {
    esbuild: {
      target: "esnext",
    },
    build: {
      target: "esnext",
    },
    optimizeDeps: {
      include: [
        'eventemitter3',
        'bs58',
        'events',
        '@solana/web3.js',
        '@coral-xyz/anchor',
        'buffer'
      ],
      esbuildOptions: {
        target: 'esnext',
      }
    },
    resolve: {
      alias: {
        buffer: 'buffer/',
      }
    },
    // Ensure browser environment
    define: {
      'process.env.BROWSER': true,
    }
  },

  compatibilityDate: '2025-04-02',
})