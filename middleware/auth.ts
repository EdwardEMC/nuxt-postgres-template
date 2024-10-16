/**
 * Middleware for protecting routes by checking for an authentication token.
 * 
 * - Retrieves the authentication token from cookies.
 * - If the token does not exist, redirects the user to the login page.
 */
export default defineNuxtRouteMiddleware(() => {
  const { getCookie: getAuthToken } = useCookieManager<string>('authToken');
  const token = getAuthToken();

  // If no token exists, redirect to the login page
  if (!token) {
    return navigateTo('/auth/login');
  }
});
