<script setup lang="ts">
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const target = ref<HTMLElement | null>(null)
const isVisible = ref(false)

useIntersectionObserver(
  target,
  ([{ isIntersecting }], observerElement) => {
    if (isIntersecting) {
      isVisible.value = true
      observerElement.unobserve(target.value!)
    }
  },
  { threshold: 0.1 }
)
</script>

<template>
  <section ref="target" class="py-16 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-t before:from-base-300/95 before:via-primary/10 before:to-base-100/30 before:z-0">
    <!-- Enhanced stars in background -->
    <div class="absolute inset-0 z-0">
      <div v-for="i in 25" :key="i" 
           class="absolute rounded-full bg-primary shadow-glow" 
           :style="{
             width: `${Math.random() * 12 + 2}px`, 
             height: `${Math.random() * 12 + 2}px`,
             left: `${Math.random() * 100}%`,
             top: `${Math.random() * 100}%`,
             opacity: Math.random() * 0.5 + 0.2,
             animationDuration: `${Math.random() * 40 + 20}s`,
             animationDelay: `${Math.random() * 5}s`
           }"
           :class="`animate-float-${(i % 3) + 1}`"></div>
    </div>
    
    <div class="container mx-auto px-4 text-center relative z-10">
      <div class="mb-12">
        <h2 class="text-3xl font-bold mb-2 text-primary inline-block relative">
          Innovation Catalysts
          <span class="absolute -bottom-1 left-0 right-0 h-1 bg-primary/30 rounded-full"></span>
        </h2>
        <p class="text-base-content/70 italic text-lg">Powering the future of decentralized technology</p>
      </div>
      
      <div class="flex flex-wrap justify-center items-stretch gap-8">
        <a href="https://ocean.xyz?ref=s3mt.xyz" target="_blank" rel="noopener noreferrer" 
           :class="[
             'flex flex-col items-center justify-center p-6 bg-base-200/90 backdrop-blur-md border-2 border-neutral-focus rounded-xl hover:shadow-xl hover:shadow-primary/30 hover:scale-105 hover:border-primary transition-all duration-500 ease-out w-full max-w-sm',
             isVisible ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-5'
           ]">
           <img src="/assets/images/s3mt-partners-ocean-logo.png" alt="Ocean Protocol Logo" class="h-50 filter brightness-0 invert">
        </a>
        <a href="https://www.xt.com/en?ref=s3mt.xyz" target="_blank" rel="noopener noreferrer" 
           :class="[
             'flex flex-col items-center justify-center p-6 bg-base-200/90 backdrop-blur-md border-2 border-neutral-focus rounded-xl hover:shadow-xl hover:shadow-primary/30 hover:scale-105 hover:border-primary transition-all duration-500 ease-out w-full max-w-sm',
             isVisible ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-5' 
           ]">
           <img src="/assets/images/s3mt-partners-xt-logo.png" alt="XT.com Logo" class="h-50 filter brightness-0 invert">
        </a>
        <a href="https://luxor.tech?ref=s3mt.xyz" target="_blank" rel="noopener noreferrer" 
           :class="[
             'flex flex-col items-center justify-center p-6 bg-base-200/90 backdrop-blur-md border-2 border-neutral-focus rounded-xl hover:shadow-xl hover:shadow-primary/30 hover:scale-105 hover:border-primary transition-all duration-500 ease-out w-full max-w-sm',
             isVisible ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-5' 
           ]">
           <img src="/assets/images/sm3t-partners-luxor-logo.svg" alt="Luxor Logo" class="h-50 filter brightness-0 invert">
        </a>
        <a href="https://bitmain.com?ref=s3mt.xyz" target="_blank" rel="noopener noreferrer" 
           :class="[
             'flex flex-col items-center justify-center p-6 bg-base-200/90 backdrop-blur-md border-2 border-neutral-focus rounded-xl hover:shadow-xl hover:shadow-primary/30 hover:scale-105 hover:border-primary transition-all duration-500 ease-out w-full max-w-sm',
             isVisible ? 'opacity-100 translate-y-0 delay-400' : 'opacity-0 translate-y-5' 
           ]">
           <img src="/assets/images/s3mt-partners-bitmain-logo.png" alt="Bitmain Logo" class="h-50 filter brightness-0 invert">
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes float-1 {
  0%, 100% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-20px) translateX(10px); }
  50% { transform: translateY(-10px) translateX(20px); }
  75% { transform: translateY(20px) translateX(-10px); }
}

@keyframes float-2 {
  0%, 100% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(20px) translateX(20px); }
  50% { transform: translateY(10px) translateX(-10px); }
  75% { transform: translateY(-15px) translateX(5px); }
}

@keyframes float-3 {
  0%, 100% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-10px) translateX(-20px); }
  50% { transform: translateY(15px) translateX(10px); }
  75% { transform: translateY(5px) translateX(-15px); }
}

.animate-float-1 { animation: float-1 infinite ease-in-out; }
.animate-float-2 { animation: float-2 infinite ease-in-out; }
.animate-float-3 { animation: float-3 infinite ease-in-out; }

.shadow-glow {
  box-shadow: 0 0 15px 2px rgba(var(--color-primary), 0.5);
}
</style>