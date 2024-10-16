<script setup lang="ts">
/// <reference types='google.accounts' />

definePageMeta({
  layout: 'auth'
});

import { useGoogleSignIn } from '@/composables/useGoogleSignIn';

const localePath = useLocalePath();
const router = useRouter();

const googleButton = ref();
const { initializeGoogleSignIn } = useGoogleSignIn(router);

onMounted(() => {
  initializeGoogleSignIn(googleButton); // Call the function to initialize Google Sign-In
});
</script>

<template>
  <div class="flex flex-grow items-center justify-center bg-background-blur p-4">
    <div class="bg-background-primary shadow-md rounded-lg p-6 max-w-md w-full">
      <h1 class="text-2xl md:text-3xl font-bold mb-6 text-center">{{ $t('login') }}</h1>

      <div class="flex justify-center">
        <div ref="googleButton"></div>
      </div>

      <div class="my-6">
        <div class="flex items-center">
          <hr class="flex-grow border-t border-gray-300" />
          <span class="mx-2 pb-1">or</span>
          <hr class="flex-grow border-t border-gray-300" />
        </div>
      </div>

      <FormLogin />

      <p class="mt-4 text-center text-sm md:text-base">
        {{ $t('dont_have_an_account') }} 
        <router-link :to="localePath('/auth/register')" class="text-blue-500 hover:underline">{{ $t('register_here') }}</router-link>.
      </p>
    </div>
  </div>
</template>
