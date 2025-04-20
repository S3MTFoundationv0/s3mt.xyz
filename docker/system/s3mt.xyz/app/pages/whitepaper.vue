<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate__animated animate__fadeIn">
    <WhitepaperHeader />
    
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Main Content -->
      <div class="lg:w-3/4 prose prose-invert max-w-none text-gray-300">
        
        <WhitepaperSection id="abstract" ref="abstractSection" title="Abstract">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </template>
          
          <p class="mb-4 text-lg leading-relaxed">S3MT offers a Simple, Smart, and Sustainable approach to tokenizing, optimizing, and distributing rewards derived from real-world assets, primarily crypto mining and sustainable mineral mining. Holding the S3MT token entitles owners to yield generated from the entire ecosystem's assets and transaction activities. Initially launched on Solana, S3MT is designed for future cross-chain expansion. The ecosystem is governed by a Decentralized Autonomous Organization (DAO) supported by a purpose-built AI companion aimed at maximizing reward distribution.</p>
          <p class="mb-4 text-lg font-medium">Key aspects include:</p>
          <ul class="list-disc ml-6 space-y-2 mb-6 text-lg">
            <li>Real-world asset backing (Sustainable Bitcoin Mining).</li>
            <li>Yield distribution to token holders (Stablecoins and/or S3MT).</li>
            <li>Transition towards DAO-based governance.</li>
            <li>Focus on sustainability and trust.</li>
          </ul>
        </WhitepaperSection>

        <SectionDivider />

        <WhitepaperSection id="asset-strategy" ref="assetStrategySection" title="Asset Strategy: Sustainable Mining">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </template>
          
          <p class="mb-6 text-lg leading-relaxed">The S3MT Treasury allocates collected funds into tangible, income-generating assets focused on sustainability:</p>
          
          <h3 class="text-2xl font-semibold mb-3 mt-6 text-indigo-300">Sustainable Bitcoin Mining</h3>
          <p class="mb-4 text-lg leading-relaxed">S3MT prioritizes Bitcoin mining operations that predominantly utilize renewable and clean energy sources, such as partnerships with clean energy providers (e.g., leveraging palm oil operations in Guatemala). The S3MT DAO acquires shares in public and private mining operations demonstrating positive EBITDA and favorable yields. All proceeds, yields, and other income generated are distributed directly to S3MT token holders via the network.</p>
          
          <h3 class="text-2xl font-semibold mb-3 mt-6 text-indigo-300">Sustainable Mineral Mining</h3>
          <p class="mb-4 text-lg leading-relaxed">S3MT takes an innovative approach to mineral assets. Instead of physical extraction, we focus on tokenizing certified mineral reserves, keeping the vast majority (99%) of the minerals securely in the ground. World-renowned geologists provide certifications, which are immutably recorded on the blockchain alongside share purchase agreements detailing sustainability commitments and purchasing thresholds. S3MT purchases shares in mines, bullion, certificates, and related instruments, with all transactions transparently recorded on the blockchain. While preserving resources, S3MT also supports genuinely sustainable traditional mining efforts by local and indigenous communities in Latin America and Africa. Yields from asset management and any sustainable extraction efforts are distributed to token holders through the S3MT network.</p>
        </WhitepaperSection>

        <SectionDivider />

        <WhitepaperSection id="tokenomics" ref="tokenomicsSection" title="Tokenomics">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </template>
          
          <p class="mb-6 text-lg leading-relaxed">
            The S3MT token is designed with a fixed total supply of <strong>1,000,000,000 S3MT</strong>. This supply powers sustainable Bitcoin mining operations and rewards long-term holders through yield distribution, staking incentives, and periodic token burn cycles. The token price will ultimately be determined by market forces, but the initial structure ensures a sustainable ecosystem.
          </p>
          
          <h3 class="text-2xl font-semibold mb-3 mt-6 text-indigo-300">Total Supply Allocation</h3>
          <p class="mb-4 text-lg leading-relaxed">The total supply is allocated as follows:</p>
          <ul class="list-disc ml-6 space-y-2 mb-4 text-lg">
            <li><strong>Token Holder Distribution (80%):</strong> 800,000,000 S3MT
              <ul class="list-circle ml-6 mt-2 space-y-1">
                <li>Presale Distribution: 432,000,000 S3MT</li>
                <li>Launch & Post-Launch Distribution: 368,000,000 S3MT</li>
              </ul>
            </li>
            <li><strong>S3MT Foundation & Ecosystem Growth (20%):</strong> 200,000,000 S3MT
              <ul class="list-circle ml-6 mt-2 space-y-1">
                <li>DAO Operations: 70,000,000 S3MT</li>
                <li>Development Team: 30,000,000 S3MT</li>
                <li>Marketing: 20,000,000 S3MT</li>
                <li>Airdrops & Staking Rewards: 50,000,000 S3MT</li>
                <li>Founder Rewards (NFT Required): 30,000,000 S3MT</li>
              </ul>
            </li>
          </ul>
          <p class="mb-6 text-lg leading-relaxed">This 80/20 split ensures the majority of tokens are available to the community while providing dedicated resources for development, operations, marketing, and rewarding key contributors like founders.</p>

          <h3 class="text-2xl font-semibold mb-3 mt-6 text-indigo-300">Initial Minting Example (Post-Launch)</h3>
          <p class="mb-4 text-lg leading-relaxed">During the post-launch phase, tokens are initially priced at $0.10 each. The minting process works as follows:</p>
          <ul class="list-disc ml-6 space-y-2 mb-4 text-lg">
              <li>A buyer sends 10 USDC (or equivalent stablecoin) to the designated contract address.</li>
              <li>A total of 120 S3MT tokens are minted in relation to this purchase.</li>
              <li>The buyer receives 100 S3MT (representing their purchase at the $0.10 price).</li>
              <li>The remaining 20 S3MT are allocated to the S3MT Foundation's pools:
                  <ul class="list-circle ml-6 mt-2 space-y-1">
                      <li>7 S3MT to DAO Operations</li>
                      <li>3 S3MT to Development Team</li>
                      <li>2 S3MT to Marketing</li>
                      <li>5 S3MT to Discretionary (Airdrops, Staking Rewards, Liquidity)</li>
                      <li>3 S3MT to Founder Rewards</li>
                  </ul>
              </li>
          </ul>
          <p class="mb-4 text-lg leading-relaxed">Note: Presale and launch phases offered different bonus structures, reflected in the overall distribution allocation.</p>
          
          <p class="mb-4 text-lg leading-relaxed">Holders of Founder tokens are perpetually eligible for the founder mint distribution as well as an additional 3% split share of all mining and staking rewards by holding a founders NFT. Earn a founders NFT by minting 100,000 tokens. Founder NFT must be held in the same wallet as the S3MT tokens. Founder NFTs are tradable.</p>
          <p class="mb-4 text-lg leading-relaxed">Further token mints beyond the initial supply, if ever needed, will be strictly controlled by the DAO, requiring S3MT holders to stake tokens and vote on S3MT Improvement Proposals.</p>
          
          <h3 class="text-2xl font-semibold mb-3 mt-6 text-indigo-300">Yield</h3>
          <p class="mb-4 text-lg leading-relaxed">Yield derived from asset performance are sent directly to the wallet address holding the S3MT token. Payments are made in Stablecoins and/or S3MT tokens, depending on the asset source and yield type. 100% of net rewards are distributed to S3MT holders.</p>
          
          <h3 class="text-2xl font-semibold mb-3 mt-6 text-indigo-300">Burn Mechanism</h3>
          <p class="mb-4 text-lg leading-relaxed">A token burn mechanism is tied to the underlying asset value:</p>
          <p class="mb-2 text-lg font-mono bg-gray-800 p-3 rounded"><code>Burn Return = ((Total Treasury Value + Total Asset Value) / Total S3MT Supply) * 80%</code></p>
          <p class="mb-4 text-lg leading-relaxed">Example: With a $10M Treasury and $80M in Assets ($90M total) and 50M S3MT supply:</p>
          <p class="mb-6 text-lg font-mono bg-gray-800 p-3 rounded"><code>( $90,000,000 / 50,000,000 S3MT ) * 80% = $1.80 * 80% = $1.44 per S3MT burn return</code></p>
          <div class="mt-6">
            <NuxtLink 
              to="/tokenomics" 
              class="btn btn-primary btn-md inline-flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Explore Full Tokenomics</span>
            </NuxtLink>
          </div>
        </WhitepaperSection>

        <SectionDivider />

        <WhitepaperSection id="governance" ref="governanceSection" title="Governance & Trust">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </template>
          
          <p class="mb-4 text-lg leading-relaxed">S3MT is fundamentally designed as a trustworthy financial instrument backed by real-world assets, distinct from speculative meme coins. Initial asset management is handled by our registered entity in the BVI (BolsaDx Holding Ltd.). As the ecosystem matures and assets grow, governance will transition to a DAO. We plan to implement a governance model inspired by established projects like Helium (HNT), enabling S3MT token holders to stake their tokens and vote on proposals, operational decisions, and the future direction of the asset portfolio.</p>
        </WhitepaperSection>
        
        <SectionDivider />

        <WhitepaperSection id="stablecoins" ref="stablecoinsSection" title="Stablecoins & Financial Inclusion">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </template>
          
          <p class="mb-4 text-lg leading-relaxed">Complementary to the asset-backed token, S3MT plans to launch stablecoins pegged to Latin American currencies (e.g., Mexican Peso, USD-equivalent Pesos). This initiative aims to facilitate low-cost, efficient cross-border payments and enhance financial accessibility within the region. Profits from related exchange activities (e.g., BolsaDx) will also contribute to the S3MT yield pool.</p>
        </WhitepaperSection>
        
        <SectionDivider />

        <WhitepaperSection id="roadmap" ref="roadmapSection" title="Roadmap">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </template>
          
          <p class="mb-4 text-lg leading-relaxed">The immediate roadmap focuses on launching the S3MT token, establishing initial mining operations, securing mineral asset agreements, and building the foundational platform. Future milestones include:</p>
          <ul class="list-disc ml-6 space-y-2 mb-6 text-lg">
            <li>Expansion to multiple blockchains.</li>
            <li>Full transition to DAO governance.</li>
            <li>Launch of Latin American stablecoins.</li>
            <li>Development of the AI companion for optimized reward distribution.</li>
            <li>Continued diversification of sustainable asset portfolio.</li>
          </ul>
          <p class="text-lg italic">(Further details on the roadmap will be released subsequently.)</p>
        </WhitepaperSection>

      </div>

      <!-- Table of Contents -->
      <div class="lg:w-1/4">
        <TableOfContents 
          :sections="sectionsList" 
          :activeSection="activeSection" 
          :smoothScrollTo="smoothScrollTo"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import WhitepaperHeader from '~/components/WhitepaperHeader.vue'
import WhitepaperSection from '~/components/WhitepaperSection.vue'
import TableOfContents from '~/components/TableOfContents.vue'
import SectionDivider from '~/components/SectionDivider.vue'

const activeSection = ref('abstract') // Default to the first section
const observer = ref(null)

// Refs for each section element to observe
const abstractSection = ref(null)
const assetStrategySection = ref(null)
const tokenomicsSection = ref(null)
const governanceSection = ref(null)
const stablecoinsSection = ref(null)
const roadmapSection = ref(null)

const sectionsList = computed(() => [
  { id: 'abstract', title: 'Abstract' },
  { id: 'asset-strategy', title: 'Asset Strategy' },
  { id: 'tokenomics', title: 'Tokenomics' },
  { id: 'governance', title: 'Governance & Trust' },
  { id: 'stablecoins', title: 'Stablecoins & Financial Inclusion' },
  { id: 'roadmap', title: 'Roadmap' }
])

onMounted(() => {
  const sectionsMap = {
    abstract: abstractSection.value.sectionRef,
    'asset-strategy': assetStrategySection.value.sectionRef,
    tokenomics: tokenomicsSection.value.sectionRef,
    governance: governanceSection.value.sectionRef,
    stablecoins: stablecoinsSection.value.sectionRef,
    roadmap: roadmapSection.value.sectionRef,
  }

  const observerOptions = {
    root: null, // relative to document viewport
    rootMargin: '-80px 0px -50% 0px', // Adjust top margin based on sticky header, bottom margin to trigger earlier
    threshold: 0, // Trigger as soon as the element enters the margin
  }

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Find section id from the target
        activeSection.value = entry.target.id
      }
    })
  }, observerOptions)

  // Observe each section
  Object.values(sectionsMap).forEach((sectionEl) => {
    if (sectionEl) {
      observer.value.observe(sectionEl)
    }
  })
  
  // Add animate on scroll effect
  animateSectionsOnScroll()
})

onUnmounted(() => {
  if (observer.value) {
    // Disconnect observer
    observer.value.disconnect()
  }
})

const smoothScrollTo = (selector) => {
  const element = document.querySelector(selector);
  if (element) {
    // Calculate offset dynamically if possible (e.g., based on fixed navbar height)
    const yOffset = -80; // Adjust this value based on your sticky navbar height
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({top: y, behavior: 'smooth'});
    
    // Update active section immediately for better UX, as observer might lag
    activeSection.value = selector.substring(1); // Remove '#' 
  }
};

const animateSectionsOnScroll = () => {
  // Simple animation when sections come into view
  const sections = document.querySelectorAll('section');
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100');
        entry.target.classList.remove('opacity-70');
      }
    });
  }, { threshold: 0.1 });
  
  sections.forEach(section => {
    section.classList.add('opacity-70');
    fadeObserver.observe(section);
  });
};

// Define page meta
useHead({
  title: 'S3MT Whitepaper',
  meta: [
    { name: 'description', content: 'Read the S3MT whitepaper - Simple, Smart, and Sustainable approach to tokenizing real-world assets.' }
  ],
})
</script>

<style>
@import 'animate.css';

/* Additional styles for tailwind prose elements if needed */
.list-circle {
  list-style-type: circle;
}
</style> 