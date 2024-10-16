<script setup lang="ts">
import Sidebar from '~/components/navigation/sidebar.vue';

const head = useLocaleHead({
  addDirAttribute: true,      // Adds dir
  addSeoAttributes: true,     // Adds lang
});
const htmlAttrs = computed(() => head.value.htmlAttrs!)
</script>

<template>
  <Html :lang="htmlAttrs.lang" :dir="htmlAttrs.dir">
    <div class="flex flex-row flex-grow">
      <!-- Sidebar component -->
      <Sidebar />

      <!-- Main content area, where <slot /> will inject the page content -->
      <div class="flex-1 p-2 md:p-6 bg-background-primary">
        <slot />
      </div>
    </div>
  </Html>
</template>
