<template>
  <nav class="sticky top-0 z-50 bg-indigo-900 border-b border-indigo-700 bg-opacity-75 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex-shrink-0 flex items-center gap-3">
            <img class="h-10 w-auto" src="/logo.svg" alt="S3MT Icon" />
            <Logo size="sm" />
          </NuxtLink>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <NuxtLink to="/" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</NuxtLink>
              <NuxtLink to="/founders" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Presale</NuxtLink>
              <!--
              <NuxtLink to="/swap" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Swap</NuxtLink>
              -->
              <NuxtLink to="/whitepaper" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Whitepaper</NuxtLink>
              <NuxtLink to="/tokenomics" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Tokenomics</NuxtLink>
              <NuxtLink to="/team" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Team</NuxtLink>
              <a href="https://github.com/distributedledgerinc/s3mt.xyz" target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5">
                <svg class="h-5 w-5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
        <WalletConnect />
      </div>
    </div>
  </nav>
</template>