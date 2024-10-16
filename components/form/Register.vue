<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { required, email, minLength, sameAs  } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import TextInput from '~/components/input/Text.vue';

const { t } = useI18n();
const router = useRouter();

const state = reactive({
  email: '',
  name: '',
  password: '',
  passwordConfirm: ''
});

const rules = {
  email: { required, email },
  name: { required },
  password: { required, minLength: minLength(6) },
  passwordConfirm: {
    required,
    sameAs: sameAs(computed(() => state.password)), // Validate that it matches the password
  },
};

const v$ = useVuelidate(rules, state);

/**
 * Registers a new user by validating input, sending a POST request to '/api/register',
 * and redirecting to the login page on success. 
 * If validation fails, it displays errors; if registration fails, it logs an error message.
 */
 const register = async () => {
  await v$.value.$validate();
  
  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }

  try {
    const data = await $fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        email: state.email,
        name: state.name,
        password: state.password,
      },
    });

    if (data.status === 'success') {
      // Redirect to login page
      router.push('/auth/login');
    } else {
      console.error('Registration failed:', data.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
};
</script>

<template>
  <form @submit.prevent="register" class="space-y-6">
    <TextInput
      v-model="v$.email.$model"
      :v$="v$.email"
      name="email"
      :label="t('email')"
      :placeholder="t('enter_your_email')"
    />
    
    <TextInput
      v-model="v$.name.$model"
      :v$="v$.name"
      name="name"
      :label="t('name')"
      :placeholder="t('enter_your_name')"
    />

    <TextInput
      v-model="v$.password.$model"
      :v$="v$.password"
      name="password"
      :label="t('password')"
      type="password"
      :placeholder="t('enter_your_password')"
    />

    <TextInput
      v-model="v$.passwordConfirm.$model"
      :v$="v$.passwordConfirm"
      name="passwordConfirm"
      :label="t('confirm_password')"
      type="password"
      :placeholder="t('confirm_your_password')"
    />

    <ButtonBasic
      class="mt-4"
      type="submit"
      :label="t('register')"
    />
  </form>
</template>
