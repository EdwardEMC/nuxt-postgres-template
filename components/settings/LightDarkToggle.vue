<script setup lang="ts">
import { onMounted } from 'vue';
import { useGlobalStore } from '~/stores/global';

/**
 * Load the mode preference from local storage
 */
const loadDarkModePreference = () => {
  const darkModePreference = localStorage.getItem('darkMode');
  if (darkModePreference === 'enabled') {
    useGlobalStore().setIsDarkMode(true);
    document.documentElement.classList.add('dark'); // Apply dark class to root element
  }
};

/**
 * Toggle dark mode on or off.
 */
const toggleDarkMode = () => {
  useGlobalStore().toggleIsDarkMode();
  if (useGlobalStore().isDarkMode) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'enabled');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'disabled');
  }
};

onMounted(() => {
  loadDarkModePreference();
});
</script>

<template>
  <div class="flex flex-col">
    <label class="relative inline-flex items-center cursor-pointer w-14 text-black">
      <input 
        type="checkbox" 
        class="sr-only" 
        v-model="useGlobalStore().isDarkMode" 
        @click="toggleDarkMode" 
      />
      <div 
        class="w-14 h-8 bg-gray-300 rounded-full transition duration-200 ease-in-out" 
        :class="{ 'bg-gray-800': useGlobalStore().isDarkMode }"
      ></div>
      <div 
        class="absolute left-1 top-1 w-6 h-6 rounded-full bg-white shadow transition duration-200 ease-in-out flex items-center justify-center" 
        :class="{ 'translate-x-6': useGlobalStore().isDarkMode }"
      >
        <nuxt-icon v-if="useGlobalStore().isDarkMode" name="moon" filled />
        <nuxt-icon v-if="!useGlobalStore().isDarkMode" name="sun" filled class="pt-0.5 pr-0.5"/>
      </div>
    </label>
  </div>
</template>

<style scoped>
/* Add some styles for the toggle switch */
input[type="checkbox"] {
  display: none; /* Hide the default checkbox */
}

label {
  display: flex;
  align-items: center;
}

.w-14 {
  width: 3.5rem; /* Width of the toggle */
}

.h-8 {
  height: 2rem; /* Height of the toggle */
}

.rounded-full {
  border-radius: 9999px; /* Fully rounded corners */
}

.bg-gray-300 {
  background-color: #d1d5db; /* Light background */
}

.bg-gray-800 {
  background-color: #1f2937; /* Dark background */
}

.w-6 {
  width: 1.5rem; /* Width of the slider */
}

.h-6 {
  height: 1.5rem; /* Height of the slider */
}

.shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Shadow for the slider */
}

.transition {
  transition: all 0.2s ease-in-out; /* Smooth transition */
}

.translate-x-6 {
  transform: translateX(1.5rem); /* Move the slider to the right */
}
</style>
