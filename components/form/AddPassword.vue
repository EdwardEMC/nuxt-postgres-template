<script setup lang="ts">
import { required, minLength, sameAs } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';

const globalStore = useGlobalStore();
const user = computed(() => globalStore.user);
const { getCookie: getAuthToken } = useCookieManager<string>('authToken');

const { t } = useI18n();

const message = ref('');
const state = reactive({
  password: "",
  password_confirm: "",
});

const rules = {
  password: { required, minLength: minLength(6) },
  password_confirm: {
    required,
    sameAs: sameAs(computed(() => state.password)), // Validate that it matches the password
  },
};

const v$ = useVuelidate(rules, state);

/**
 * Updates the user's password after validating the input.
 * 
 * - Validates the form using Vuelidate. If invalid, marks fields as touched and exits.
 * - Sends a POST request to update the password, including the user's ID and auth token.
 * - On success, sets a message and resets the password fields.
 * - On failure, logs the error and displays an error message.
 */
const update = async (): Promise<void> => {
  await v$.value.$validate();

  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }
  
  try {
    const response = await $fetch(`/api/users/${ user.value?.id}/password/create`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
      body: {
        newPassword: state.password
      }
    });

    message.value = response.message;

    //Reset the password entries
    useGlobalStore().updateUserAttribute("has_password", true);
    state.password = "";
    state.password_confirm = "";
  } catch (err: any) {
    console.error('API request failed:', err);
    message.value = err?.data?.message || 'An unexpected error occurred';
  }
}
</script>

<template>
  <form @submit.prevent="update" class="space-y-6">
    <div class="text-xl md:text-2xl font-bold mb-6">
      {{ $t('add_password') }}
    </div>

    <div>
      {{ $t('add_password_description') }}
    </div>

    <InputText
      v-model="v$.password.$model"
      :v$="v$.password"
      name="password"
      :label="t('password')"
      type="password"
      :placeholder="t('enter_your_password')"
    />

    <InputText
      v-model="v$.password_confirm.$model"
      :v$="v$.password_confirm"
      name="password_confirm"
      :label="t('confirm_password')"
      type="password"
      :placeholder="t('confirm_your_password')"
    />

    <div class="flex justify-end mt-4">
      <ButtonBasic
        class="max-w-md"
        design="danger"
        type="submit"
        :label="t('update')"
      />
    </div>

    <div v-if="message" class="text-right text-sm mt-4">
      <p>{{ message }}</p>
    </div>
  </form>
</template>
