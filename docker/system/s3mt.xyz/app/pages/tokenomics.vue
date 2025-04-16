<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate__animated animate__fadeIn">
    <!-- Optional Header if needed -->
    <!-- <WhitepaperHeader /> -->
    <h1 class="text-4xl md:text-5xl font-bold text-center mb-16 text-white">S3MT Tokenomics</h1>

    <div class="grid gap-10 md:grid-cols-2">
      <!-- Distribution Card - Removed Hover Effects -->
      <div class="card bg-neutral text-neutral-content shadow-xl border border-neutral/40 rounded-xl transition-all duration-300 ease-in-out active:scale-[0.98] active:shadow-inner cursor-pointer">
        <div class="card-body p-8">
          <h2 class="card-title text-3xl font-semibold text-secondary mb-6">Distribution</h2>
          <p class="mb-8 text-lg text-neutral-content/80 leading-relaxed">
            1,000,000,000 Total Supply — fixed. Designed to power sustainable Bitcoin
            mining and reward long-term holders through staking and burn cycles.
          </p>
          <div v-for="(item, index) in animatedDistribution" :key="item.label" class="mb-5">
            <div class="flex justify-between text-base font-medium mb-2 text-neutral-content/90">
              <span>{{ item.label }}</span>
              <span>{{ Math.round(item.animatedValue) }}%</span>
            </div>
            <ThemedProgressBar :value="item.animatedValue" />
          </div>
        </div>
      </div>

      <!-- Token Utility Card - Removed Hover Effects -->
      <div class="card bg-neutral text-neutral-content shadow-xl border border-neutral/40 rounded-xl transition-all duration-300 ease-in-out active:scale-[0.98] active:shadow-inner cursor-pointer">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ThemedProgressBar from '~/components/ui/ThemedProgressBar.vue';
// Removed unused component imports

// Define distribution data within script setup
// Remove daisyColor as the new component uses a fixed gradient
const distribution = ref([
  { label: "Mining Rewards", value: 45 },
  { label: "Community + Staking", value: 20 },
  { label: "Team + Advisors", value: 15 },
  { label: "Presale Investors", value: 15 },
  { label: "Treasury + Dev Fund", value: 5 },
]);

// Reactive ref for animated progress values
const animatedDistribution = ref(
  distribution.value.map(item => ({ ...item, animatedValue: 0 }))
);

// Animation function
const animateProgressBars = () => {
  const duration = 1000; // Animation duration in ms
  const startTime = performance.now();

  const runAnimation = (currentTime) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1); // Normalize progress (0 to 1)

    animatedDistribution.value.forEach((item, index) => {
      const targetValue = distribution.value[index].value;
      item.animatedValue = Math.round(targetValue * progress); // Ease-out effect implicit via Math.min
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

// Run animation when component is mounted
onMounted(() => {
  animateProgressBars();
});

// Define page meta using useHead
useHead({
  title: 'S3MT Tokenomics',
  meta: [
    { name: 'description', content: 'Learn about the S3MT token distribution, utility, and deflationary mechanisms.' }
  ],
})
</script>

<style scoped>
@import 'animate.css';

/* Remove styles related to native progress element */
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