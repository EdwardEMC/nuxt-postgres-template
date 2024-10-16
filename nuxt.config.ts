export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: "nuxt-postgres-template",
      script: [
        {
          src: 'https://accounts.google.com/gsi/client',
        },
      ],
    }
  },
  css: ['~/assets/css/main.css', '~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  i18n: {
    locales: [
        { code: "en", language: "en", dir: "ltr" },
        { code: "sp", language: "sp", dir: "ltr" },
    ],
    defaultLocale: 'en',
    lazy: true,
    detectBrowserLanguage: false,
    vueI18n: './i18n.config.ts'
  },
  compatibilityDate: '2024-04-03',
  modules: [
    '@nuxtjs/tailwindcss',
    "@pinia/nuxt",
    'nuxt-icons',
    '@nuxtjs/i18n',
    '@vite-pwa/nuxt'
  ],
  pwa: {
    manifest: {
      name: 'Your App Name',
      short_name: 'App',
      description: 'Your app description',
      theme_color: '#ffffff', // Customize with your app’s theme color
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: "512x512",
          type: "image/png"
        },
      ],
      start_url: '/',
      display: 'standalone', // Enables the app to open as a standalone window
      background_color: '#ffffff' // Customize background color
    },
    client: {
      installPrompt: true
    },
    workbox: {

    },
    devOptions: {
      enabled: true, 
      type: "module"
    }

  },
  devServer: {
    host: '0.0.0.0',    // Allow connections from any device on the network
    port: 3000          // Keep your desired port
  }
});
