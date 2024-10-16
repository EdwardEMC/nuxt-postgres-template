# nuxt-postgres-template

This template integrates Nuxt 3, PostgreSQL, and Google Single Sign-On (SSO) capabilities.

The application features:
- Pinia stores for state management
- Internationalisation (i18n)
- Support for multiple color themes
- User registration and session management
  - Includes authenticated routes and API access
- Basic Progressive Web App (PWA) configuration

## Setup Instructions

1. **Duplicate the `.env.example` file as `.env` and populate the required fields:**

    ```plaintext
    POSTGRES_USERNAME=
    POSTGRES_PASSWORD=
    POSTGRES_DATABASE=
    
    POSTGRES_PORT=
    DATABASE_URL=
    
    #### JWT secret for signing tokens
    JWT_SECRET=
    
    #### Google OAuth credentials
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    #### GOOGLE_REDIRECT_URI=http://yourapp.com/auth/google/callback
    
    #### Google OAuth credentials for frontend use
    VITE_GOOGLE_CLIENT_ID=
    ```

2. **Install and run Docker Desktop**

   Execute the following commands in separate terminal windows:

    ```bash
    docker-compose up --build
    ```

    ```bash
    npm install
    npm run dev
    ```

3. **(Optional) Seed the database**

   To seed the database, uncomment the API middleware option in `/server/middleware/auth.ts` and navigate to `localhost:3000/api/database/setup` in your browser:

   ```javascript
   if (url?.startsWith('/api/database')) {
       return;
   }
   ```

## useCookieManager

The cookie manager is a composable that facilitates the handling of cookie types. It is currently utilised to manage user data and authorisation tokens.

## Settings

The application supports both light and dark modes, implemented through dynamic Tailwind imports.

To add more themes, simply create a new class in the `/assets/css/tailwind.css`, such as `.sepia`. The toggle button applies the `.dark` class to the overall HTML, which loads the dark variables defined in tailwind.css. You can also replace this toggle with a dropdown to support additional themes. New variables should be declared in tailwind.css and updated in `tailwind.config.js` to become accessible.

Additionally, the application is configured for internationalisation (i18n), with English as the default and fallback language, along with an example of Spanish included.
