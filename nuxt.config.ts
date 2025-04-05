export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],

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

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      solanaNetwork: process.env.SOLANA_NETWORK || 'devnet'
    }
  },

  compatibilityDate: '2025-04-02'
})