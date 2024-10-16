<script setup lang="ts">
import { defineProps, ref } from 'vue';

const props = defineProps({
  name: String,
  label: String,
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  v$: Object,
  disabled: {
    type: Boolean,
    default: false,
  }
});

const model = defineModel({ type: String });
const showPassword = ref(false);

/**
 * Toggle the visibility of the text if the input type is password.
 */
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const inputType = computed(() => {
  return props.type === 'password' && !showPassword.value ? 'password' : 'text';
});
</script>

<template>
  <div>
    <label :for="name" class="block text-sm font-medium text-content-primary">{{ label }}</label>
    <div class="relative">
      <input
        :id="name"
        :type="inputType"
        v-model="model"
        class="mt-1 py-2 px-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        :class="{ 
          'border-red-500': v$ && v$.$error,
          'bg-background-input': !disabled
        }"
        :placeholder="placeholder"
        :disabled="disabled"
      />

      <!-- Toggle button for password visibility -->
      <button 
        v-if="type === 'password'" 
        type="button" 
        @click="togglePasswordVisibility" 
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500"
      >
        {{ showPassword ? $t('hide') : $t('show') }}
      </button>
    </div>

    <!-- Display any error messages -->
    <div v-if="v$ && v$.$error" class="text-red-600 text-xs pl-2 pt-0.5">
      <ul>
        <li v-for="(msg, index) in v$.$errors" :key="index">{{ msg.$message }}</li>
      </ul>
    </div>
  </div>
</template>
