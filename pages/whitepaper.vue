<template>
  <div 
    class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
  >
    <img src="/logo.svg" alt="S3MT Logo" class="h-40 w-auto mx-auto mb-6">
    <h1 class="text-4xl font-bold mb-10 text-center flex justify-center items-center gap-3">
      <Logo size="lg" /> Whitepaper
    </h1>
    
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Main Content -->
      <div class="lg:w-3/4 prose prose-invert max-w-none text-gray-300">
        
        <section id="abstract" ref="abstractSection">
          <h2 class="text-3xl font-semibold mb-4 mt-8 border-b border-gray-700 pb-2">Abstract</h2>
          <p class="mb-4 text-lg leading-relaxed">S3MT offers a Simple, Smart, and Sustainable approach to tokenizing, optimizing, and distributing rewards derived from real-world assets, primarily crypto mining and sustainable mineral mining. Holding the S3MT token entitles owners to dividends generated from the entire ecosystem's assets and transaction activities. Initially launched on Solana, S3MT is designed for future cross-chain expansion. The ecosystem is governed by a Decentralized Autonomous Organization (DAO) supported by a purpose-built AI companion aimed at maximizing reward distribution.</p>
          <p class="mb-4 text-lg font-medium">Key aspects include:</p>
          <ul class="list-disc ml-6 space-y-2 mb-6 text-lg">
            <li>Real-world asset backing (Sustainable Bitcoin & Silver Mining).</li>
            <li>Dividend distribution to token holders (Stablecoins and/or S3MT).</li>
            <li>Transition towards DAO-based governance.</li>
            <li>Focus on sustainability and trust.</li>
          </ul>
        </section>

        <hr class="my-10 border-gray-700">

        <section id="asset-strategy" ref="assetStrategySection">
          <h2 class="text-3xl font-semibold mb-4 mt-8 border-b border-gray-700 pb-2">Asset Strategy: Sustainable Mining</h2>
          <p class="mb-6 text-lg leading-relaxed">The S3MT Treasury invests collected funds into tangible, income-generating assets focused on sustainability:</p>
          
          <h3 class="text-2xl font-semibold mb-3 mt-6 text-indigo-300">Sustainable Bitcoin Mining</h3>
          <p class="mb-4 text-lg leading-relaxed">S3MT prioritizes Bitcoin mining operations that predominantly utilize renewable and clean energy sources, such as partnerships with clean energy providers (e.g., leveraging palm oil operations in Guatemala). The S3MT DAO acquires shares in public and private mining operations demonstrating positive EBITDA and favorable yields. All proceeds, yields, and other income or dividends generated are distributed directly to S3MT token holders via the network.</p>
          
          <h3 class="text-2xl font-semibold mb-3 mt-6 text-indigo-300">Sustainable Mineral Mining (Silver Focus)</h3>
          <p class="mb-4 text-lg leading-relaxed">S3MT takes an innovative approach to mineral assets, primarily silver. Instead of physical extraction, we focus on tokenizing certified mineral reserves, keeping the vast majority (99%) of the minerals securely in the ground. World-renowned geologists provide certifications, which are immutably recorded on the blockchain alongside share purchase agreements detailing sustainability commitments and purchasing thresholds. S3MT purchases shares in mines, bullion, certificates, and related instruments, with all transactions transparently recorded on the blockchain. While preserving resources, S3MT also supports genuinely sustainable traditional mining efforts by local and indigenous communities. Profits from asset management and any sustainable extraction efforts are distributed to token holders through the S3MT network.</p>
        </section>

        <hr class="my-10 border-gray-700">

        <section id="tokenomics" ref="tokenomicsSection">
          <h2 class="text-3xl font-semibold mb-4 mt-8 border-b border-gray-700 pb-2">Tokenomics</h2>
          <p class="mb-6 text-lg leading-relaxed">While the S3MT token price will ultimately be determined by market forces, its initial structure and distribution are designed for sustainable growth and rewarding holders.</p>
          
          <h3 class="text-2xl font-semibold mb-3 mt-6 text-indigo-300">Minting & Initial Distribution (Post-Launch)</h3>
          <ul class="list-disc ml-6 space-y-2 mb-4 text-lg">
            <li>A buyer sends 1 USDC (or equivalent) to the contract address.</li>
            <li>1000 S3MT tokens are minted.</li>
            <li>The buyer receives 80% (800 S3MT) to their wallet.</li>
            <li>The S3MT Foundation receives 20% (200 S3MT) allocated as follows:
              <ul class="list-circle ml-6 mt-2 space-y-1">
                <li>7.5% Operations</li>
                <li>2.5% Developers</li>
                <li>2.5% Marketing</li>
                <li>5.0% Discretionary (Airdrops, rewards, liquidity pools)</li>
                <li>2.5% Founders</li>
              </ul>
            </li>
          </ul>
          
          <h3 class="text-2xl font-semibold mb-3 mt-6 text-indigo-300">Pre-Launch & Founder Benefits</h3>
          <p class="mb-4 text-lg leading-relaxed">Early participation offers increased token shares for the buyer, enhancing potential rewards:</p>
          <ul class="list-disc ml-6 space-y-2 mb-4 text-lg">
            <li>Founders: 100.00% Buyer Share</li>
            <li>Pre-Family: 95.00% Buyer Share</li>
            <li>Pre-Launch: 90.00% Buyer Share</li>
            <li>Launch Mode: 85.00% Buyer Share</li>
            <li>Post Launch: 80.00% Buyer Share</li>
          </ul>
          <p class="mb-4 text-lg leading-relaxed">Holders of Founder tokens are perpetually eligible for the 2.5% founder mint distribution. These benefits are linked to a Founder NFT, which must be held in the same wallet as the S3MT tokens. Founder NFTs are tradable.</p>
          
          <h3 class="text-2xl font-semibold mb-3 mt-6 text-indigo-300">Dividends</h3>
          <p class="mb-4 text-lg leading-relaxed">Dividends derived from asset performance are paid directly to the wallet address holding the S3MT token. Payments are made in Stablecoins and/or S3MT tokens, depending on the asset source and dividend type. 100% of net asset rewards are distributed to S3MT holders.</p>
          
          <h3 class="text-2xl font-semibold mb-3 mt-6 text-indigo-300">Burn Mechanism</h3>
          <p class="mb-4 text-lg leading-relaxed">A token burn mechanism is tied to the underlying asset value:</p>
          <p class="mb-2 text-lg font-mono bg-gray-800 p-3 rounded"><code>Burn Return = ((Total Treasury Value + Total Asset Value) / Total S3MT Supply) * 80%</code></p>
          <p class="mb-4 text-lg leading-relaxed">Example: With a $10M Treasury and $80M in Assets ($90M total) and 50M S3MT supply:</p>
          <p class="mb-6 text-lg font-mono bg-gray-800 p-3 rounded"><code>( $90,000,000 / 50,000,000 S3MT ) * 80% = $1.80 * 80% = $1.44 per S3MT burn return</code></p>
        </section>

        <hr class="my-10 border-gray-700">

        <section id="governance" ref="governanceSection">
          <h2 class="text-3xl font-semibold mb-4 mt-8 border-b border-gray-700 pb-2">Governance & Trust</h2>
          <p class="mb-4 text-lg leading-relaxed">S3MT is fundamentally designed as a trustworthy investment vehicle backed by real-world assets, distinct from speculative meme coins. Initial asset management is handled by our registered entity in the BVI (BolsaDx Holding Ltd.). As the ecosystem matures and assets grow, governance will transition to a DAO. We plan to implement a governance model inspired by established projects like Helium (HNT), enabling S3MT token holders to stake their tokens and vote on investment proposals, operational decisions, and the future direction of the asset portfolio.</p>
        </section>
        
        <hr class="my-10 border-gray-700">

        <section id="stablecoins" ref="stablecoinsSection">
          <h2 class="text-3xl font-semibold mb-4 mt-8 border-b border-gray-700 pb-2">Stablecoins & Financial Inclusion</h2>
          <p class="mb-4 text-lg leading-relaxed">Complementary to the asset-backed token, S3MT plans to launch stablecoins pegged to Latin American currencies (e.g., Mexican Peso, USD-equivalent Pesos). This initiative aims to facilitate low-cost, efficient cross-border payments and enhance financial accessibility within the region. Profits from related exchange activities (e.g., BolsaDx) will also contribute to the S3MT dividend pool.</p>
        </section>
        
        <hr class="my-10 border-gray-700">

        <section id="roadmap" ref="roadmapSection">
          <h2 class="text-3xl font-semibold mb-4 mt-8 border-b border-gray-700 pb-2">Roadmap</h2>
          <p class="mb-4 text-lg leading-relaxed">The immediate roadmap focuses on launching the S3MT token, establishing initial mining operations, securing mineral asset agreements, and building the foundational platform. Future milestones include:</p>
          <ul class="list-disc ml-6 space-y-2 mb-6 text-lg">
            <li>Expansion to multiple blockchains.</li>
            <li>Full transition to DAO governance.</li>
            <li>Launch of Latin American stablecoins.</li>
            <li>Development of the AI companion for optimized reward distribution.</li>
            <li>Continued diversification of sustainable asset portfolio.</li>
          </ul>
          <p class="text-lg italic">(Further details on the roadmap will be released subsequently.)</p>
        </section>

      </div>

      <!-- Table of Contents -->
      <aside class="lg:w-1/4 sticky top-24 h-fit">
        <nav class="space-y-2">
          <h3 class="text-xl font-semibold mb-3 text-white">Contents</h3>
          <a 
            href="#abstract" 
            @click.prevent="smoothScrollTo('#abstract')"
            class="block px-3 py-1 rounded transition-colors duration-200"
            :class="{ 'text-white bg-indigo-600 font-semibold': activeSection === 'abstract', 'text-gray-400 hover:text-white hover:bg-gray-700': activeSection !== 'abstract' }"
          >
            Abstract
          </a>
          <a 
            href="#asset-strategy" 
            @click.prevent="smoothScrollTo('#asset-strategy')"
            class="block px-3 py-1 rounded transition-colors duration-200"
            :class="{ 'text-white bg-indigo-600 font-semibold': activeSection === 'asset-strategy', 'text-gray-400 hover:text-white hover:bg-gray-700': activeSection !== 'asset-strategy' }"
          >
            Asset Strategy
          </a>
          <a 
            href="#tokenomics" 
            @click.prevent="smoothScrollTo('#tokenomics')"
            class="block px-3 py-1 rounded transition-colors duration-200"
            :class="{ 'text-white bg-indigo-600 font-semibold': activeSection === 'tokenomics', 'text-gray-400 hover:text-white hover:bg-gray-700': activeSection !== 'tokenomics' }"
          >
            Tokenomics
          </a>
          <a 
            href="#governance" 
            @click.prevent="smoothScrollTo('#governance')"
            class="block px-3 py-1 rounded transition-colors duration-200"
            :class="{ 'text-white bg-indigo-600 font-semibold': activeSection === 'governance', 'text-gray-400 hover:text-white hover:bg-gray-700': activeSection !== 'governance' }"
          >
            Governance & Trust
          </a>
          <a 
            href="#stablecoins" 
            @click.prevent="smoothScrollTo('#stablecoins')"
            class="block px-3 py-1 rounded transition-colors duration-200"
            :class="{ 'text-white bg-indigo-600 font-semibold': activeSection === 'stablecoins', 'text-gray-400 hover:text-white hover:bg-gray-700': activeSection !== 'stablecoins' }"
          >
            Stablecoins & Financial Inclusion
          </a>
          <a 
            href="#roadmap" 
            @click.prevent="smoothScrollTo('#roadmap')"
            class="block px-3 py-1 rounded transition-colors duration-200"
            :class="{ 'text-white bg-indigo-600 font-semibold': activeSection === 'roadmap', 'text-gray-400 hover:text-white hover:bg-gray-700': activeSection !== 'roadmap' }"
          >
            Roadmap
          </a>
        </nav>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const activeSection = ref('abstract') // Default to the first section
const observer = ref(null)

// Refs for each section element to observe
const abstractSection = ref(null)
const assetStrategySection = ref(null)
const tokenomicsSection = ref(null)
const governanceSection = ref(null)
const stablecoinsSection = ref(null)
const roadmapSection = ref(null)

const sections = ref({})

onMounted(() => {
  sections.value = {
    abstract: abstractSection.value,
    'asset-strategy': assetStrategySection.value,
    tokenomics: tokenomicsSection.value,
    governance: governanceSection.value,
    stablecoins: stablecoinsSection.value,
    roadmap: roadmapSection.value,
  }

  const observerOptions = {
    root: null, // relative to document viewport
    rootMargin: '-80px 0px -50% 0px', // Adjust top margin based on sticky header, bottom margin to trigger earlier
    threshold: 0, // Trigger as soon as the element enters the margin
  }

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Check intersection ratio to prioritize if multiple are intersecting slightly
        // Simple approach: just set the first one that intersects from the top margin
        activeSection.value = entry.target.id
      }
    })
  }, observerOptions)

  // Observe each section
  Object.values(sections.value).forEach((sectionEl) => {
    if (sectionEl) {
      observer.value.observe(sectionEl)
    }
  })
})

onUnmounted(() => {
  if (observer.value) {
    // Disconnect observer
    Object.values(sections.value).forEach((sectionEl) => {
       if (sectionEl) {
        observer.value.unobserve(sectionEl)
      }
    });
    observer.value.disconnect()
  }
})

const smoothScrollTo = (selector) => {
  const element = document.querySelector(selector);
  if (element) {
    // Calculate offset dynamically if possible (e.g., based on fixed navbar height)
    // Simple approach: scroll to the element's top
    const yOffset = -80; // Adjust this value based on your sticky navbar height
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({top: y, behavior: 'smooth'});
    
    // Update active section immediately for better UX, as observer might lag
    activeSection.value = selector.substring(1); // Remove '#' 
  }
};

// Define page meta if needed
// useHead({
//   title: 'S3MT Whitepaper',
//   meta: [
//     { name: 'description', content: 'Read the S3MT whitepaper.' }
//   ],
// })
</script> 