<script setup lang="ts">
import Appheader from '~/components/navigation/appheader.vue';
</script>

<template>
  <div class="flex flex-col flex-grow">
    <Appheader />
    <slot />
  </div>
</template>
