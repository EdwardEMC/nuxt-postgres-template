<script setup lang="ts">
import { useGlobalStore } from './stores/global';

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

onMounted(() => {
  useGlobalStore().loadUserFromCookie();
  loadDarkModePreference();
});
</script>

<template>
  <div class="flex flex-col flex-grow text-content-primary">
    <NuxtPwaManifest/>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
