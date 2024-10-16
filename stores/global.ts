import { defineStore } from "pinia";
import type { User } from "~/interfaces/user";

export const useGlobalStore = defineStore({
  id: 'global',
  state: () => ({
    user: {} as User|null,
    authenticated: false,
    isDarkMode: false,
  }),
  actions: {
    /**
     * Loads the user data from the cookie and updates the store state.
     * If a user exists in the cookie, it sets the user in the store.
     */
    loadUserFromCookie() {
      const cookieManager = useCookieManager<User>('user');
      const userFromCookie = cookieManager.getCookie();

      if (userFromCookie) {
        this.user = userFromCookie;
      }
    },

    /**
     * Sets the user in the store state.
     * 
     * @param value - The user object to be set or null to clear the user.
     */
    setUser(value: User | null): void {
      this.user = value;
    },

    /**
     * Updates a specific attribute of the user in the store state.
     * 
     * @param attribute - The key of the user attribute to update.
     * @param value - The new value for the specified attribute.
     */
    updateUserAttribute(attribute: keyof User, value: any): void {
      if (this.user) {
        this.user[attribute] = value;
      }
    },

    /**
     * Sets the dark mode state in the store.
     * 
     * @param value - Boolean indicating whether dark mode is enabled.
     */
    setIsDarkMode(value: boolean): void {
      this.isDarkMode = value;
    },

    /**
     * Toggles the dark mode state in the store.
     * If dark mode is currently enabled, it will be disabled, and vice versa.
     */
    toggleIsDarkMode(): void {
      this.isDarkMode = !this.isDarkMode;
    }
  },
  getters: {
    /**
     * Retrieves the current dark mode state.
     * 
     * @returns {boolean} - True if dark mode is enabled, false otherwise.
     */
    getIsDarkMode(state): boolean {
      return state.isDarkMode;
    },

    /**
     * Retrieves the user object from the store.
     * 
     * @returns {User|null} - The user object if available, or null if not.
     */
    getUser(state): User | null {
      return state.user;
    }
  }
});
