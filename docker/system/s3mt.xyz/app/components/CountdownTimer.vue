<template>
  <div class="flex justify-center space-x-4 text-center">
    <div v-for="unit in timeUnits" :key="unit.label" class="flex flex-col">
      <div class="text-4xl font-bold bg-gray-700 rounded-lg w-20 h-20 flex items-center justify-center">
        {{ unit.value }}
      </div>
      <div class="text-xs uppercase mt-2 text-gray-400">{{ unit.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns'

const props = defineProps({
  endDate: {
    type: [Number, Date, String],
    required: true
  }
})

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const intervalId = ref(null)

const timeUnits = computed(() => [
  { label: 'Days', value: days.value < 10 ? `0${days.value}` : days.value },
  { label: 'Hours', value: hours.value < 10 ? `0${hours.value}` : hours.value },
  { label: 'Minutes', value: minutes.value < 10 ? `0${minutes.value}` : minutes.value },
  { label: 'Seconds', value: seconds.value < 10 ? `0${seconds.value}` : seconds.value }
])

const updateCountdown = () => {
  const now = new Date()
  const end = new Date(props.endDate)
  
  if (now >= end) {
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
    
    if (intervalId.value) {
      clearInterval(intervalId.value)
    }
    return
  }
  
  days.value = differenceInDays(end, now)
  hours.value = differenceInHours(end, now) % 24
  minutes.value = differenceInMinutes(end, now) % 60
  seconds.value = differenceInSeconds(end, now) % 60
}

onMounted(() => {
  updateCountdown()
  intervalId.value = setInterval(updateCountdown, 1000)
})

onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
})
</script> 