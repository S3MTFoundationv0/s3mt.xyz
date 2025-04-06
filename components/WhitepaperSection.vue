<template>
  <section :id="id" ref="sectionRef" class="mb-16 transition-opacity duration-500 ease-in-out">
    <div class="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 shadow-xl border border-gray-700 hover:border-indigo-500/30 transition-all duration-300">
      <h2 class="text-3xl font-semibold mb-6 border-b border-gray-700 pb-3 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300">
        <slot name="icon"></slot>
        {{ title }}
      </h2>
      
      <div class="prose prose-invert max-w-none text-gray-300">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

const sectionRef = ref(null);

defineExpose({
  sectionRef
});
</script>

<style scoped>
.prose h3 {
  @apply text-2xl font-semibold mb-3 mt-6 text-indigo-300;
}

.prose p {
  @apply mb-4 text-lg leading-relaxed;
}

.prose ul {
  @apply list-disc ml-6 space-y-2 mb-6 text-lg;
}

.prose ul ul {
  @apply ml-6 mt-2 space-y-1;
  list-style-type: circle;
}

.prose code {
  @apply bg-gray-800 p-3 rounded text-lg font-mono;
}

.prose hr {
  @apply my-10 border-gray-700;
}
</style> 