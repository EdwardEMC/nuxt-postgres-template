import type { CookieOptions } from '~/interfaces/cookie';

/**
 * Manages a specific cookie by providing functions to set, get, and clear the cookie value.
 * 
 * - Configures the cookie with options like security, CSRF protection, HTTP-only, and expiration (7 days).
 * - `setCookie`: Sets the value of the cookie.
 * - `getCookie`: Retrieves the value of the cookie.
 * - `clearCookie`: Clears the cookie by setting its value to null.
 */
export function useCookieManager<T>(cookieName: string) {
  const cookieOptions: CookieOptions = {
    secure: process.env.NODE_ENV === 'production', // Set cookies to be secure in production
    sameSite: 'lax',  // CSRF protection, adjust to 'Strict' if needed
    httpOnly: false,   // Change to true if you don't need to access from JavaScript
    maxAge: 60 * 60 * 24 * 7  // Persist cookie for 7 days (adjust as needed)
  };

  /**
   * Create or access a specific cookie
   */
  const cookie = useCookie<T | null>(cookieName, cookieOptions);

  /**
   * Set the value for the cookie
   * @param value T
   */
  const setCookie = (value: T) => {
    cookie.value = value;
  }

  /**
   * Get the value of the cookie
   * @returns T or null
   */
  const getCookie = (): T | null => {
    return cookie.value;
  }

  /**
   * Clear the cookie (set to null)
   */
  const clearCookie = () => {
    cookie.value = null;
  }

  return {
    setCookie,
    getCookie,
    clearCookie
  };
}
