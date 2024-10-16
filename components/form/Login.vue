<script setup lang="ts">
import { required, email } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import type { User } from '~/interfaces/user';
import TextInput from '~/components/input/Text.vue';
import useVuelidate from '@vuelidate/core';

const { t } = useI18n();
const router = useRouter();
const { setCookie: setAuthToken } = useCookieManager<string>('authToken');
const { setCookie: setUserCookie } = useCookieManager<User>('user');

const state = reactive({
  email: '',
  password: ''
});

const rules = {
  email: { required, email },
  password: { required },
};

const v$ = useVuelidate(rules, state);

/**
 * Handles the server response for the login request.
 * @param response - The response object from the login API.
 * If the response contains a token, it stores it and redirects the user.
 * If there's an error in the response, it logs the error message.
 */
 const handleLoginResponse = (response: any): void => {
  if (!response) {
    console.error('Unexpected response format: Undefined');
    return;
  }

  if (response.status === 'error') {
    console.error('Login failed:', response.message);
  } else if (response.token) {
    const { id, email, name, sso_provider: sso, service, has_password } = response.user;
    const user: User = {
      id,
      email,
      name,
      sso,
      service,
      has_password
    }
    setUserCookie(user);
    setAuthToken(response.token);
    useGlobalStore().setUser(user);
    router.push('/');
  } else {
    console.error('Unexpected response format:', response);
  }
};

/**
 * Performs a login request by validating the form and sending the credentials.
 * If the validation passes, the function sends a POST request with the user's email and password.
 * Handles any errors in the request or response.
 */
 const login = async (): Promise<void> => {
  await v$.value.$validate();

  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }

  try {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        email: state.email,
        password: state.password,
      },
    });

    // Handle successful login response
    handleLoginResponse(data);
  } catch (error) {
    console.error('Login error:', error); // Log error details
  }
};
</script>

<template>
  <form @submit.prevent="login" class="space-y-6">
    <TextInput
      v-model="v$.email.$model"
      :v$="v$.email"
      name="email"
      :label="t('email')"
      :placeholder="t('enter_your_email')"
    />

    <TextInput
      v-model="v$.password.$model"
      :v$="v$.password"
      name="password"
      :label="t('password')"
      type="password"
      :placeholder="t('enter_your_password')"
    />
    
    <ButtonBasic
      class="mt-4"
      type="submit"
      :label="t('login')"
    />
  </form>
</template>
