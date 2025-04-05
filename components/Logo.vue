<template>
    <svg xmlns="http://www.w3.org/2000/svg" 
         :width="svgDimensions.width" 
         :height="svgDimensions.height" 
         viewBox="0 0 150 60"
         class="inline-block align-middle">
        <defs>
            <linearGradient id="gradient3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#a855f7" />
            <stop offset="100%" stop-color="#3b82f6" />
            </linearGradient>
        </defs>
        <text x="0" y="45"
                font-family="'Exo 2', sans-serif"
                font-size="46"
                font-weight="700"
                fill="white"
                letter-spacing="0">
            S
        </text>
        <text x="30" y="45"
                font-family="'Exo 2', sans-serif"
                font-size="46"
                font-weight="700"
                fill="url(#gradient3)"
                letter-spacing="0">
            3
        </text>
        <text x="60" y="45"
                font-family="'Exo 2', sans-serif"
                font-size="46"
                font-weight="700"
                fill="white"
                letter-spacing="0">
            MT
        </text>
    </svg>
</template>

<script setup lang="ts">
const props = defineProps({
  size: {
    type: String as PropType<'xs' | 'sm' | 'md' | 'lg' | 'xl'>,
    default: 'md',
    validator: (value: string) => [
      'xs', 'sm', 'md', 'lg', 'xl'
    ].includes(value)
  }
})

const sizeMap = {
  xs: { width: 75, height: 30 },
  sm: { width: 113, height: 45 },
  md: { width: 150, height: 60 },
  lg: { width: 188, height: 75 },
  xl: { width: 225, height: 90 },
} as const

const svgDimensions = computed(() => {
  return sizeMap[props.size] || sizeMap.md
})
</script>