<template>
  <section 
    v-motion
    :initial="{ opacity: 0 }"
    :enter="{
      opacity: 1,
      transition: {
        duration: 500,
        ease: 'easeInOut',
      },
    }"
    :leave="{ 
      opacity: 0,
      transition: { duration: 200, ease: 'easeIn' } 
    }" 
    class="relative h-screen overflow-hidden"
  >
    <!-- Background image or SVG -->
    <div class="absolute inset-0 z-0">
      <img src="/assets/images/synthwave-bg.png" alt="Synthwave mining scene"
           class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black bg-opacity-60"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
      <img src="/assets/images/S3MT-logo-v0.2.0-transparent.svg" alt="S3MT Logo" class="h-60 mb-6" />
      <h1 class="text-4xl md:text-6xl font-bold mb-4">
        Powering the Future of <span class="text-primary">Sustainable Bitcoin Mining</span>
      </h1>
      <p class="text-lg md:text-xl max-w-2xl mb-8 text-white/80">
        Smart. Secure. Sustainable. Join the movement where crypto meets clean energy.
      </p>
      <div class="flex gap-4 flex-wrap justify-center">
        <NuxtLink to="/presale" class="btn btn-primary">Buy Now</NuxtLink>
        <NuxtLink to="/whitepaper" class="btn btn-secondary">Learn More</NuxtLink>
      </div>
    </div>
  </section>
</template>


