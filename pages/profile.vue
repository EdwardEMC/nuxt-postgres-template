<script setup lang="ts">
definePageMeta({
    middleware: 'auth'
});

const globalStore = useGlobalStore();
const user = computed(() => globalStore.user);
</script>

<template>
  <div class="space-y-6">
    <div class="text-3xl md:text-4xl font-bold mb-6">{{ $t('profile') }}</div>

    <div class="bg-background-secondary shadow-md rounded-lg p-2 md:p-6 w-full">

      <FormUpdateUser />

    </div>

    <div class="bg-background-secondary shadow-md rounded-lg p-2 md:p-6 w-full">
      
      <!--todo allow user to add password if used sso-->
      <FormChangePassword v-if="user?.has_password" />
      <FormAddPassword v-else />

    </div>
  </div>
</template>
