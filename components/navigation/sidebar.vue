<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router'
import type { User } from '~/interfaces/user';

const { clearCookie: clearAuthToken } = useCookieManager<string>('authToken');
const { clearCookie: clearUserCookie } = useCookieManager<User>('user');
const router = useRouter();

const { t } = useI18n();
const localePath = useLocalePath();
const expanded = ref(true);

const menuItems = computed(() => [
  { icon: 'home', text: t('home'), link: "/" },
  { icon: 'profile', text: t('profile'), link: "/profile" },
  { icon: 'settings', text: t('settings'), link: "/settings" }
]);

const logoutUser = () => {
  clearAuthToken();
  clearUserCookie();
  useGlobalStore().setUser(null);
  router.push(localePath('/auth/login'));
};

/**
 * Toggle the expanded value of the menu, this is done either manually or automatically depending 
 * on the screen size.
 */
const toggleMenu = () => {
  expanded.value = !expanded.value
}

/**
 * Check screen width and update expanded state, set expanded menu to false if the window width 
 * is less than 768 pixels.
 */
const checkScreenSize = () => {
  expanded.value = window.innerWidth >= 768;
};

/**
 * Check screen size on mount and add event listener for resize.
 */
onMounted(() => {
  checkScreenSize(); // Initial check
  window.addEventListener('resize', checkScreenSize);
});

/**
 * Cleanup the event listener on component unmount.
 */
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize);
});
</script>

<template>
  <div :class="['transition-all duration-300', expanded ? 'max-w-44 w-44' : 'max-w-16 w-16']" class="flex flex-col flex-grow bg-menu-primary text-content-menu">
    <!-- Menu Header -->
    <div @click="toggleMenu" class="flex cursor-pointer items-center py-2" 
      :class="{ 
        'justify-center pt-4': !expanded,
        'justify-between px-4': expanded  
      }"
    >
      <span v-if="expanded" class="font-semibold text-xl">{{$t('menu')}}</span>

      <button class="text-white focus:outline-none">
        <nuxt-icon v-if="expanded" name="chevron-left" filled />
        <nuxt-icon v-else name="hamburger" filled class="text-xl" />
      </button>
    </div>

    <!-- Menu Items -->
    <ul class="flex flex-col flex-grow mt-4 space-y-2">
      <NuxtLink v-for="item in menuItems" :key="item.text" 
        :to="localePath(item.link)" 
        class="flex items-center p-2 hover:bg-menu-secondary" 
        :class="{ 'pl-4': expanded }"
      >
        <div class="flex items-center w-full" :class="{ 'justify-center': !expanded }">
          <nuxt-icon :name="item.icon" filled />
          <span v-if="expanded" class="ml-4">{{ item.text }}</span> <!-- Text (shown only when expanded) -->
        </div>
      </NuxtLink>
    </ul>

    <button @click="logoutUser" class="flex w-full items-center p-2 hover:bg-menu-secondary mb-6" :class="{ 'pl-4': expanded }">
      <div class="flex items-center w-full" :class="{ 'justify-center mt-2': !expanded }">
        <nuxt-icon name="logout" filled :class="{ 'pl-0.5 justify-center': !expanded }"/>
        <span v-if="expanded" class="ml-4">{{$t('logout')}}</span>
      </div>
    </button>
  </div>
</template>
