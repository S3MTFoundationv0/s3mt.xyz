<template>
  <div 
    class="progress-track rounded-full overflow-hidden relative"
    :class="[sizeClasses, customClasses]"
  >
    <div
      class="progress-value h-full bg-gradient-to-r rounded-full absolute top-0 left-0 transition-all duration-500 ease-out"
      :class="[
        variant === 'primary' ? 'from-indigo-500 to-purple-500' : 
        variant === 'success' ? 'from-green-500 to-emerald-500' :
        variant === 'info' ? 'from-blue-500 to-cyan-500' :
        'from-indigo-500 to-purple-500'
      ]"
      :style="{ width: `${internalValue}%` }"
    ></div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch, computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true,
    default: 0,
    validator: (val) => val >= 0 && val <= 100,
  },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['xs', 'sm', 'md', 'lg'].includes(val),
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'success', 'info'].includes(val),
  },
  customClasses: {
    type: String,
    default: '',
  }
})

// Use internal ref for smoother transitions if needed
const internalValue = ref(props.value)

// Compute size classes
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'h-1.5 bg-neutral-800/40';
    case 'sm': return 'h-2 bg-neutral-800/40';
    case 'md': return 'h-3 bg-neutral-800/40';
    case 'lg': return 'h-4 bg-neutral-800/40';
    default: return 'h-3 bg-neutral-800/40';
  }
});

// Watch for external value changes to update the bar
watch(() => props.value, (newValue) => {
  internalValue.value = newValue
})
</script>

<style scoped>
.progress-track {
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
}
.progress-value {
  background-size: 150% 150%;
}
</style> 