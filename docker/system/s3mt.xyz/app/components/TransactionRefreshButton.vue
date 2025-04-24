<template>
  <button 
    @click="emitRefresh"
    class="refresh-button"
    :disabled="loading"
  >
    <span v-if="loading">Refreshing...</span>
    <span v-else>Refresh Now</span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  loading: boolean;
}>();

const emit = defineEmits<{
  refresh: [];
}>();

function emitRefresh() {
  emit('refresh');
}
</script>

<style scoped>
.refresh-button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 500;
  cursor: pointer;
  background-color: #4a5568;
  color: white;
  border: none;
  transition: background-color 0.2s;
}

.refresh-button:hover:not(:disabled) {
  background-color: #2d3748;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style> 