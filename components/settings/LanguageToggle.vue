<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale, setLocale } = useI18n();

/**
 * Define available languages.
 */
const languages = [
  { code: 'en', name: 'English' },
  { code: 'sp', name: 'Spanish' }
]

/**
 * Watch for locale changes to update the select element.
 */
const selectedLanguage = ref(locale.value);
watch(locale, (newLocale) => {
  selectedLanguage.value = newLocale;
});

/**
 * Handle switching to a new language.
 */
const switchLanguage = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const selectedCode = target.value;
  setLocale(selectedCode);
}
</script>

<template>
  <div>
    <select id="language-select" class="px-2" v-model="selectedLanguage" @change="switchLanguage">
      <option
          v-for="lang in languages"
          class="text-black"
          :key="lang.code"
          :value="lang.code"
      >
        {{ lang.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
#language-select {
  background: no-repeat left center;
}
</style>
