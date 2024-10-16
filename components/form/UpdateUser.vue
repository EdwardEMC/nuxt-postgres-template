<script setup lang="ts">
import { required, email } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';

const globalStore = useGlobalStore();
const user = computed(() => globalStore.user);
const { getCookie: getAuthToken } = useCookieManager<string>('authToken');

const { t } = useI18n();

const message = ref('');
const state = reactive({
  email: user.value?.email,
  name: user.value?.name,
  service: user.value?.service ?? t('free'),
  sso: user.value?.sso ?? undefined,
});

const rules = {
  email: { required, email },
  name: { required },
  service: { required },
  sso: { }
};

const v$ = useVuelidate(rules, state);

/**
 * Updates the user's profile (name and/or email) after validating the input.
 * 
 * - Validates the form using Vuelidate. If invalid, marks fields as touched and exits.
 * - Sends a POST request to update the user's name and/or email, sending only fields that have changed.
 * - On success, sets a message with the response.
 * - On failure, logs the error and displays an error message.
 */
const update = async (): Promise<void> => {
  await v$.value.$validate();

  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }
  
  try {
    const response = await $fetch(`/api/users/${ user.value?.id}/edit`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
      body: {
        name: isNameDifferent ? state.name : undefined, // Send only if different
        email: isEmailDifferent ? state.email : undefined // Send only if different
      }
    });

    message.value = response.message;
  } catch (err: any) {
    console.error('API request failed:', err);
    message.value = err?.data?.message || 'An unexpected error occurred';
  }
}

const isEmailDifferent = computed(() => user.value?.email === state.email);
const isNameDifferent = computed(() => user.value?.name === state.name);

watch(user, (newUser) => {
  state.email = newUser?.email || '';
  state.name = newUser?.name || '';
  state.service = newUser?.service ?? 'free';
  state.sso = newUser?.sso ?? undefined;
}, { immediate: true });
</script>

<template>
  <form @submit.prevent="update" class="space-y-6">
    <div class="text-xl md:text-2xl font-bold mb-6">
      {{ $t('account_details') }}
    </div>
  
    <InputText
      v-model="v$.name.$model"
      :v$="v$.name"
      name="name"
      :label="t('name')"
      :placeholder="t('enter_your_name')"
    />

    <div>
      <InputText
        v-model="v$.email.$model"
        :v$="v$.email"
        name="email"
        :label="t('email')"
        :placeholder="t('enter_your_email')"
        :disabled="user?.sso !== undefined"
      />
      <div v-if="user?.sso !== undefined" class="text-content-notification text-xs pl-2 pt-0.5">
        {{  $t('single_sign_on_used') }}
      </div>
    </div>

    <InputText
      v-if="user?.sso !== undefined"
      v-model="v$.sso.$model"
      :v$="v$.sso"
      name="sso"
      :label="t('single_sign_on')"
      disabled
    />

    <InputText
      v-model="v$.service.$model"
      :v$="v$.service"
      name="service"
      :label="t('service')"
      disabled
    />

    <div class="flex justify-end mt-4">
      <ButtonBasic
        class="max-w-md"
        type="submit"
        :label="t('update')"
      />
    </div>

    <div v-if="message" class="text-right text-sm">
      <p>{{ message }}</p>
    </div>
  </form>
</template>