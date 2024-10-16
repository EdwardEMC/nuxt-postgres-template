import { jwtDecode } from 'jwt-decode';
import type { User } from '~/interfaces/user';

/* Provides functionality for Google Sign-In, including user registration and login.
* 
* - Uses cookies to manage authentication tokens and user data.
* - `handleCredentialResponse`: Processes the response from Google, decodes the JWT, and registers or logs in the user.
* - `registerUser`: Registers a new user or verifies an existing one via the API.
* - `loginUser`: Logs in the user using their email and SSO ID.
* - `initializeGoogleSignIn`: Initializes and renders the Google Sign-In button on the specified DOM element.
*/
export const useGoogleSignIn = (router: any) => {
  const { setCookie: setAuthToken } = useCookieManager<string>('authToken');
  const { setCookie: setUserCookie } = useCookieManager<User>('user');

  /**
   * Handles the response from the Google Sign-In, decoding the JWT,
   * registering or logging in the user based on the SSO information.
   *
   * @param {Object} response - The response object from Google Sign-In.
   * @returns {void}
   */
  const handleCredentialResponse = async (response: any): Promise<void> => {
    const { credential } = response;
    const { email, name, sub: ssoId } = jwtDecode<{ email: string; name: string; sub: string }>(credential);

    // Register or verify the user
    const registerResponse = await registerUser(email, name, ssoId);
    if (!registerResponse) return;

    // Log the user in
    const loginResponse = await loginUser(email, ssoId);
    if (loginResponse) {
      const { id, email, name, service, sso_provider: sso, has_password } = loginResponse.user;
      const user: User = {
        id,
        email,
        name,
        service,
        sso,
        has_password
      }
      console.log(user);
      setUserCookie(user);
      setAuthToken(loginResponse.token);
      useGlobalStore().setUser(user);
      router.push('/');
    }
  };

  /**
   * Registers a new user or verifies an existing one using the provided email, name, and SSO ID.
   *
   * @param {string} email - The user's email address.
   * @param {string} name - The user's name.
   * @param {string} ssoId - The unique identifier from the SSO provider.
   * @returns {Object|null} The response data or null if an error occurred.
   */
  const registerUser = async (email: string, name: string, ssoId: string): Promise<any | null> => {
    try {
      const data = await $fetch('/api/auth/google/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { email, name, ssoId }, // Directly send the object instead of stringifying
      });
  
      console.log('User added/verified:', data);
      return data; // Return data on success
    } catch (error) {
      console.error('Error while adding user:', error);
      return null; // Return null on error
    }
  };

  /**
   * Logs in a user using the provided email and SSO ID.
   *
   * @param {string} email - The user's email address.
   * @param {string} ssoId - The unique identifier from the SSO provider.
   * @returns {Object|null} The response data (e.g., token) or null if an error occurred.
   */
  const loginUser = async (email: string, ssoId: string): Promise<any | null> => {
    try {
      const data = await $fetch('/api/auth/google/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { email, ssoId }, // Directly send the object instead of stringifying
      });
  
      return data; // Return data (e.g., token) on success
    } catch (error) {
      console.error('Error while logging in user:', error);
      return null; // Return null on error
    }
  };

  /**
   * Initializes the Google Sign-In button and renders it on the specified DOM element.
   *
   * @param {Object} googleButtonRef - The reference to the DOM element where the button will be rendered.
   * @returns {void}
   */
  const initializeGoogleSignIn = (googleButtonRef: { value: HTMLElement }): void => {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      google.accounts.id.renderButton(googleButtonRef.value, {
        type: 'standard',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
        logo_alignment: 'left',
        width: 250,
      });

      google.accounts.id.prompt(); // Display One Tap dialog
    } else {
      console.error("Google API not loaded");
    }
  };

  return {
    initializeGoogleSignIn,
  };
};
