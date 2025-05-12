<template>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W5X3RJ8D" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
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