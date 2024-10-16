<script setup lang="ts">
definePageMeta({
    middleware: 'auth'
})
</script>

<template>
  <div>
    <div class="text-3xl md:text-4xl font-bold">{{ $t('home') }}</div>
  </div>
</template>
