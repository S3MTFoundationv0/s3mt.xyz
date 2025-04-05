<template>
  <Wallet>
    <div class="min-h-screen bg-gray-900 text-white">
      <NavBar />
      <main class="overflow-x-hidden">
        <NuxtPage 
          :transition="{
            name: 'page',
            mode: 'out-in'
          }" 
        />
      </main>
      <Footer />
    </div>
  </Wallet>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import Wallet from '@/components/Wallet.vue'
</script>