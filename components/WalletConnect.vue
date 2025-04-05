<template>
  <div>
    <button v-if="!connected" @click="connect" class="btn btn-primary">
      Connect Wallet
    </button>
    <div v-else class="flex items-center space-x-2">
      <span class="text-sm text-gray-300">{{ shortAddress }}</span>
      <button @click="disconnect" class="btn btn-secondary text-sm">
        Disconnect
      </button>
    </div>
  </div>
</template>

<script setup>
const connected = ref(false)
const address = ref('')

const shortAddress = computed(() => {
  if (!address.value) return ''
  return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
})

async function connect() {
  // Implement wallet connection logic
  connected.value = true
  address.value = '12345...abcde' // Placeholder
}

function disconnect() {
  connected.value = false
  address.value = ''
}
</script>