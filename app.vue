<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">
    <NavBar />
    <main class="flex-grow">
        <NuxtPage 
          :transition="{
            name: 'page',
            mode: 'out-in'
          }" 
        />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
</script>