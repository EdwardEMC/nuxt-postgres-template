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
  password_current: "",
  password_new: "",
  password_confirm: "",
});

const rules = {
  password_current: { required },
  password_new: { required, minLength: minLength(6) },
  password_confirm: {
    required,
    sameAs: sameAs(computed(() => state.password_new)), // Validate that it matches the password
  },
};

const v$ = useVuelidate(rules, state);

/**
 * Updates the user's password after validating the input.
 * 
 * - Validates the form using Vuelidate. If invalid, marks fields as touched and exits.
 * - Sends a POST request to update the password, including current and new passwords, with the user's ID and auth token.
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
    const response = await $fetch(`/api/users/${ user.value?.id}/password/edit`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
      body: {
        currentPassword: state.password_current,
        newPassword: state.password_new
      }
    });

    message.value = response.message;

    //Reset the password entries
    state.password_current = "";
    state.password_new = "";
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
      {{ $t('change_password') }}
    </div>

    <InputText
      v-model="v$.password_current.$model"
      :v$="v$.password_current"
      name="password_current"
      :label="t('current_password')"
      type="password"
      :placeholder="t('enter_your_password')"
    />

    <InputText
      v-model="v$.password_new.$model"
      :v$="v$.password_new"
      name="password_new"
      :label="t('new_password')"
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
