<template>
  <nav class="sticky top-0 z-50 bg-indigo-900 border-b border-indigo-700 bg-opacity-75 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center gap-3">
            <img class="h-10 w-auto" src="/logo.svg" alt="S3MT Icon" />
            <Logo size="sm" />
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <NuxtLink to="/" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</NuxtLink>
              <NuxtLink to="/presale" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Presale</NuxtLink>
              <NuxtLink to="/swap" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Swap</NuxtLink>
              <NuxtLink to="/whitepaper" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Whitepaper</NuxtLink>
            </div>
          </div>
        </div>
        <WalletConnect />
      </div>
    </div>
  </nav>
</template>