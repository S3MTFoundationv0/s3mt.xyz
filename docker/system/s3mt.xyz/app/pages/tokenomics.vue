<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
    <!-- Optional Header if needed -->
    <!-- <WhitepaperHeader /> -->
    <h1 class="text-4xl md:text-5xl font-bold text-center mb-16 text-white animate__animated animate__fadeInDown">S3MT Tokenomics</h1>

    <div class="grid gap-10 md:grid-cols-2">
      <!-- Distribution Card - Added animate-on-scroll and specific class -->
      <div class="card bg-neutral text-neutral-content shadow-xl border border-neutral/40 rounded-xl transition-all duration-300 ease-in-out active:scale-[0.98] active:shadow-inner cursor-pointer animate-on-scroll distribution-card">
        <div class="card-body p-8">
          <h2 class="card-title text-3xl font-semibold text-secondary mb-6">Distribution</h2>
          <p class="mb-8 text-lg text-neutral-content/80 leading-relaxed">
            A fixed total supply of 1,000,000,000 S3MT tokens powers sustainable Bitcoin
            mining and rewards long-term holders via yield, staking, and burn cycles.
            80% (800,000,000 tokens) are allocated to token holders through presale and launch distributions,
            while 20% (200,000,000 tokens) are reserved for foundation operations, development, marketing, rewards, and founders.
          </p>
          <div v-for="(item, index) in animatedDistribution" :key="item.label" class="mb-5">
            <div class="flex justify-between text-base font-medium mb-2 text-neutral-content/90">
              <span>{{ item.label }}</span>
              <span>{{ formatNumber(item.animatedValue) }}</span>
            </div>
            <ThemedProgressBar :value="calculatePercentage(item.animatedValue)" />
          </div>
        </div>
      </div>

      <!-- Token Utility Card - Added animate-on-scroll -->
      <div class="card bg-neutral text-neutral-content shadow-xl border border-neutral/40 rounded-xl transition-all duration-300 ease-in-out active:scale-[0.98] active:shadow-inner cursor-pointer animate-on-scroll">
        <div class="card-body p-8 space-y-6">
          <h2 class="card-title text-3xl font-semibold text-secondary">Token Utility</h2>
          <ul class="list-disc pl-6 space-y-3 text-lg text-neutral-content/80">
            <li>Stake to earn <span class="font-medium text-neutral-content/95">mining revenue rewards</span></li>
            <li>Access <span class="font-medium text-neutral-content/95">green hashpower</span> & exclusive mining tiers</li>
            <li><span class="font-medium text-neutral-content/95">Buybacks & burns</span> reduce supply over time</li>
            <li>Team tokens <span class="font-medium text-neutral-content/95">vested over 24 months</span></li>
          </ul>

          <!-- Utility Box - Removed Hover Effects -->
          <div
            class="utility-box rounded-lg bg-gradient-to-br from-primary to-secondary text-primary-content p-6 text-center mt-8 transition-all duration-300 ease-out transform active:scale-[0.97]"
          >
            <p class="text-sm uppercase tracking-wider mb-1 font-semibold">Deflationary</p>
            <p class="text-xl font-bold">Built for Long-Term Value</p>
          </div>
        </div>
      </div>
    </div>

    <!-- New Section for Post-Launch Minting & Distribution - Added animate-on-scroll -->
    <div class="mt-16 card bg-neutral text-neutral-content shadow-xl border border-neutral/40 rounded-xl transition-all duration-300 ease-in-out active:scale-[0.98] active:shadow-inner animate-on-scroll">
      <div class="card-body p-8">
        <h2 class="card-title text-3xl font-semibold text-secondary mb-6">Post-Launch Minting & Distribution</h2>
        <p class="mb-4 text-lg text-neutral-content/80 leading-relaxed">
          S3MT tokens will have an initial price of $0.10 USD each at launch.
        </p>
        <p class="mb-4 text-lg text-neutral-content/80 leading-relaxed">
          The minting process upon purchase works as follows:
        </p>
        <ul class="list-disc pl-6 space-y-3 text-lg text-neutral-content/80 mb-6">
          <li>A buyer sends 10 USDC (or equivalent value) to the designated contract address.</li>
          <li>A total of 120 S3MT tokens are minted and added to the buyer's account initially.</li>
          <li>The buyer's final allocation is 100 S3MT tokens.</li>
          <li>The S3MT Foundation receives the remaining 20 S3MT tokens, distributed internally:</li>
        </ul>
        <div class="pl-12 mb-6"> <!-- Indent the foundation breakdown -->
           <ul class="list-disc space-y-2 text-base text-neutral-content/70">
              <li><span class="font-medium text-neutral-content/90">7 S3MT:</span> DAO Operations</li>
              <li><span class="font-medium text-neutral-content/90">3 S3MT:</span> Development Team</li>
              <li><span class="font-medium text-neutral-content/90">2 S3MT:</span> Marketing</li>
              <li><span class="font-medium text-neutral-content/90">5 S3MT:</span> Discretionary (Airdrops, rewards, liquidity, staking)</li>
              <li><span class="font-medium text-neutral-content/90">3 S3MT:</span> Founders</li>
            </ul>
        </div>
         <p class="text-sm text-neutral-content/60 italic">
          This mechanism ensures continuous funding for the project's growth and community rewards alongside token holder acquisition.
        </p>
      </div>
    </div>
    <!-- End New Section -->

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ThemedProgressBar from '~/components/ui/ThemedProgressBar.vue';
// Removed unused component imports

// Define TOTAL_SUPPLY and distribution data
const TOTAL_SUPPLY = 1000000000;
const distribution = ref([
  { label: "Token Holder Allocation", value: 800000000 },
  { label: "DAO Operations", value: 70000000 },
  { label: "Development Team", value: 30000000 },
  { label: "Marketing", value: 20000000 },
  { label: "Airdrops + Staking Rewards", value: 50000000 },
  { label: "Founder Rewards", value: 30000000 },
]);

// Reactive refs for animation
const animatedDistribution = ref(
  distribution.value.map(item => ({ ...item, animatedValue: 0 }))
);
const distributionCardRef = ref(null); // Ref for the distribution card element
const hasAnimated = ref(false); // Flag to ensure animation runs only once

// --- Animation Logic ---

// Number count-up animation function
const animateDistributionNumbers = () => {
  if (hasAnimated.value) return; // Don't re-animate
  hasAnimated.value = true;

  const duration = 1500; // Longer duration for effect
  const startTime = performance.now();

  const runAnimation = (currentTime) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1); // Normalize progress (0 to 1)

    // Apply ease-out quadratic easing function: progress * (2 - progress)
    const easedProgress = progress * (2 - progress);

    animatedDistribution.value.forEach((item, index) => {
      const targetValue = distribution.value[index].value;
      item.animatedValue = Math.floor(targetValue * easedProgress);
    });

    if (progress < 1) {
      requestAnimationFrame(runAnimation);
    } else {
       // Ensure final values are exact
       animatedDistribution.value.forEach((item, index) => {
         item.animatedValue = distribution.value[index].value;
       });
    }
  };

  requestAnimationFrame(runAnimation);
};

// --- Intersection Observer Setup ---
let observer = null;

onMounted(() => {
  const options = {
    root: null, // viewport
    threshold: 0.2, // Trigger when 20% of the element is visible
  };

  observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate numbers when distribution card is visible
        // Check target using classList as ref might not be fully resolved or could be a component
        if (entry.target.classList.contains('distribution-card') && !hasAnimated.value) {
           animateDistributionNumbers();
        }
        // Add 'is-visible' class for general card animations
        entry.target.classList.add('is-visible');
        // Optional: Unobserve after animation if not needed anymore
        // observerInstance.unobserve(entry.target);
      } else {
         // Optional: remove class if you want animation to reverse on scroll out
         // Keep elements visible once they appear for this use case
         // entry.target.classList.remove('is-visible');
      }
    });
  }, options);

  // Observe all elements with the 'animate-on-scroll' class
  const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
  elementsToAnimate.forEach(el => {
     if (observer) observer.observe(el);
  });

  // Clean up distributionCardRef - no longer needed if selecting by class
  // const distCardElement = document.querySelector('.distribution-card');
  // if (distCardElement && observer) {
  //   distributionCardRef.value = { $el: distCardElement }; // Simulate component ref structure
  //   observer.observe(distCardElement);
  // }

});

onBeforeUnmount(() => {
  if (observer) {
    // Ensure elements exist before trying to unobserve if needed
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => {
       if (observer) observer.unobserve(el);
    });
    observer.disconnect();
  }
});


// --- Helper Functions ---
const formatNumber = (num) => {
  return Math.round(num).toLocaleString('en-US');
};

const calculatePercentage = (value) => {
  // Prevent division by zero if TOTAL_SUPPLY is somehow 0
  if (TOTAL_SUPPLY === 0) return 0;
  return (value / TOTAL_SUPPLY) * 100;
};

// Define page meta using useHead
useHead({
  title: 'S3MT Tokenomics - Interactive',
  meta: [
    { name: 'description', content: 'Explore the S3MT token distribution, utility, and minting process with interactive elements.' }
  ],
})
</script>

<style scoped>
@import 'animate.css'; /* Keep for title animation */

/* Styles for scroll-triggered animations */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Remove default progress styles if they conflict or are unneeded */
/*
.progress.h-4 {
    height: 1rem; 
}
.progress {
  border-radius: theme('borderRadius.lg');
}
.progress::-webkit-progress-bar {
  background-color: rgba(var(--fallback-nc,oklch(var(--nc)/1)),0.2);
  border-radius: theme('borderRadius.lg');
}
.progress::-moz-progress-bar {
  background-color: rgba(var(--fallback-nc,oklch(var(--nc)/1)),0.2);
  border-radius: theme('borderRadius.lg');
}
.progress::-webkit-progress-value {
  transition: width 0.1s ease-out; 
  border-radius: theme('borderRadius.lg');
}
.progress::-moz-progress-bar { 
  transition: width 0.1s ease-out; 
  border-radius: theme('borderRadius.lg');
}
@-moz-document url-prefix() { 
  .progress {
    background-color: rgba(var(--fallback-nc,oklch(var(--nc)/1)),0.2);
    border-radius: theme('borderRadius.lg');
  }
}
*/
</style>