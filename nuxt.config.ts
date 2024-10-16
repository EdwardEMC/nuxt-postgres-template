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
    '@nuxtjs/i18n'
  ],
  devServer: {
    host: '0.0.0.0',    // Allow connections from any device on the network
    port: 3000          // Keep your desired port
  }
});
