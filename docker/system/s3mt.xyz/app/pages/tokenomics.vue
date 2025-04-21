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

    <!-- New Section for Post-Launch Minting & Distribution -->
    <div class="mt-16 card bg-neutral text-neutral-content shadow-xl border border-neutral/40 rounded-xl transition-all duration-300 ease-in-out active:scale-[0.98] active:shadow-inner">
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
import { ref, onMounted } from 'vue'
import ThemedProgressBar from '~/components/ui/ThemedProgressBar.vue';
// Removed unused component imports

// Define distribution data within script setup
const TOTAL_SUPPLY = 1000000000;

const distribution = ref([
  { label: "Token Holder Allocation", value: 800000000 }, // 432M Presale + 368M Launch/Post-Launch
  { label: "DAO Operations", value: 70000000 },
  { label: "Development Team", value: 30000000 },
  { label: "Marketing", value: 20000000 },
  { label: "Airdrops + Staking Rewards", value: 50000000 },
  { label: "Founder Rewards", value: 30000000 },
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
      // Use Math.floor for smoother animation towards the large number
      item.animatedValue = Math.floor(targetValue * progress);
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

// Helper function to format large numbers with commas
const formatNumber = (num) => {
  return Math.round(num).toLocaleString('en-US');
};

// Helper function to calculate percentage for the progress bar
const calculatePercentage = (value) => {
  return (value / TOTAL_SUPPLY) * 100;
};

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