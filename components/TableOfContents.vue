<template>
  <aside class="lg:w-full sticky top-24 h-fit">
    <nav class="space-y-2 bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700">
      <h3 class="text-xl font-semibold mb-3 text-white flex items-center">
        <span class="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </span>
        Contents
      </h3>
      
      <div class="space-y-1">
        <a 
          v-for="section in sections" 
          :key="section.id"
          :href="`#${section.id}`" 
          @click.prevent="smoothScrollTo(`#${section.id}`)"
          class="block px-3 py-2 rounded-lg transition-all duration-200 flex items-center"
          :class="{ 
            'text-white bg-gradient-to-r from-indigo-600 to-indigo-800 font-semibold shadow-md transform scale-102': activeSection === section.id, 
            'text-gray-400 hover:text-white hover:bg-gray-700': activeSection !== section.id 
          }"
        >
          <span class="flex-1">{{ section.title }}</span>
          <svg v-if="activeSection === section.id" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  sections: {
    type: Array,
    required: true
  },
  activeSection: {
    type: String,
    required: true
  },
  smoothScrollTo: {
    type: Function,
    required: true
  }
});
</script> 