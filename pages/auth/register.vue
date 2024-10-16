<script setup lang="ts">
definePageMeta({
  layout: 'auth'
});

const localePath = useLocalePath();
</script>

<template>
  <div class="flex flex-col flex-grow items-center justify-center bg-background-blur p-4">
    <div class="bg-background-primary shadow-md rounded-lg p-6 max-w-md w-full">
      <h1 class="text-2xl md:text-3xl font-bold mb-8 text-center">{{ $t("register") }}</h1>

      <FormRegister />

      <p class="mt-4 text-center text-sm md:text-base">
        {{ $t("already_have_an_account") }}
        <router-link :to="localePath('/auth/login')" class="text-blue-500 hover:underline">{{ $t("login_here") }}</router-link>.
      </p>
    </div>
  </div>
</template>
