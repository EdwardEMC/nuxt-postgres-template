<script setup lang="ts">
definePageMeta({
    middleware: 'auth'
});

import type { User } from '~/interfaces/user';

const { clearCookie: clearAuthToken } = useCookieManager<string>('authToken');
const router = useRouter();

const { t } = useI18n();
const localePath = useLocalePath();
const globalStore = useGlobalStore();
const user = computed(() => globalStore.user);
const { getCookie: getAuthToken } = useCookieManager<string>('authToken');
const { clearCookie: clearUserCookie } = useCookieManager<User>('user');

const message = ref();

const deleteAccount = async () => {
  try {
    const response = await $fetch(`/api/users/${ user.value?.id}/delete`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
      body: {}
    });

    message.value = response?.message;
    logoutUser();
  } catch (err: any) {
    console.error('API request failed:', err);
    message.value = err?.data?.message || 'An unexpected error occurred';
  }
};

const logoutUser = () => {
  clearAuthToken();
  clearUserCookie();
  useGlobalStore().setUser(null);
  router.push(localePath('/auth/login'));
};
</script>

<template>
  <div>
    <div class="text-3xl md:text-4xl font-bold mb-6">{{ $t('settings') }}</div>

    <div class="flex flex-col space-y-4">
      <div class="bg-background-secondary shadow-md rounded-lg p-2 md:p-6 w-full space-y-6">
        <div class="space-y-2">
          <label class="text-md md:text-lg font-bold">{{$t('change_language')}}</label>
          <SettingsLanguageToggle/>
        </div>


        <div class="space-y-2">
          <label class="text-md md:text-lg font-bold">{{$t('change_theme')}}</label>
          <SettingsLightDarkToggle/>
        </div>
      </div>

      <div class="bg-background-secondary shadow-md rounded-lg p-2 md:p-6 w-full">
        <div class="text-xl md:text-2xl font-bold mb-6">
          {{ $t('delete_account') }}
        </div>

        <ModalConfirmationModal 
          :title="t('delete_account')"
          :message="t('are_you_sure_you_want_to_delete_your_account')"
          :button-title="t('delete')"
          :disabled="false"
          :callback="deleteAccount">

          <ButtonBasic
            class="max-w-md"
            design="danger"
            type="button"
            :label="t('delete')"
          />

        </ModalConfirmationModal>

        <div v-if="message" class="text-right text-sm mt-4">
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
