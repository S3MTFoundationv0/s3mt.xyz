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
      <div class="flex justify-center gap-6 mt-8">
        <NuxtLink to="/presale" class="btn btn-primary btn-lg btn-glow-primary">Buy Now</NuxtLink>
        <NuxtLink to="/whitepaper" class="btn btn-secondary btn-lg">Learn More</NuxtLink>
      </div>
    </div>
  </section>

  <!-- Featured Partner Section -->
  <section class="py-16 bg-base-300">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl font-bold mb-8 text-primary">Featured Partner</h2>
      <div class="flex justify-center items-center">
        <a href="https://ocean.xyz" target="_blank" rel="noopener noreferrer" 
           class="flex flex-col items-center p-6 bg-base-100 rounded-lg shadow-lg hover:shadow-primary/50 transition-shadow duration-300">
           <img src="/assets/images/s3mt-partners-ocean-logo.png" alt="Ocean Protocol Logo" class="h-20 mb-4 filter brightness-0 invert">
           <span class="text-lg font-semibold text-white/90">Ocean</span>
        </a>
      </div>
    </div>
  </section>
</template>


