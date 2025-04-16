<template>
  <div class="progress-track h-4 bg-neutral/40 rounded-full overflow-hidden relative">
    <div
      class="progress-value h-full bg-gradient-to-r from-primary to-secondary rounded-full absolute top-0 left-0 transition-all duration-1000 ease-out"
      :style="{ width: `${internalValue}%` }"
    ></div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true,
    default: 0,
    validator: (val) => val >= 0 && val <= 100,
  }
})

// Use internal ref for smoother transitions if needed, but direct prop binding works fine with CSS transitions
const internalValue = ref(props.value)

// Watch for external value changes to update the bar
watch(() => props.value, (newValue) => {
  internalValue.value = newValue
})

</script>

<style scoped>
/* Add any specific scoped styles if needed */
.progress-track {
  /* Example: Add a subtle inset shadow for depth */
   /* box-shadow: inset 0 1px 3px rgba(0,0,0,0.2); */
}
.progress-value {
 /* Ensures the gradient is smooth */
}
</style> 