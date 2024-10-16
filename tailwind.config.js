/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: 'var(--color-background-primary)',
          secondary: 'var(--color-background-secondary)',
          tertiary: 'var(--color-background-tertiary)',
          input: 'var(--color-background-input)',
          blur: 'var(--color-background-blur)',
        },
        menu: {
          primary:  'var(--color-menu-primary)',
          secondary:  'var(--color-menu-secondary)',
        },
        content: {
          primary:  'var(--color-content-primary)',
          secondary:  'var(--color-content-secondary)',
          menu:  'var(--color-content-menu)',
          notification:  'var(--color-content-notification)',
          danger:  'var(--color-content-danger)',
        },
        icon: {
          primary:  'var(--color-icon-primary)',
          secondary:  'var(--color-icon-secondary)',
        },
        button: {
          primary:  'var(--color-button-primary)',
          secondary:  'var(--color-button-secondary)',
          outline:  'var(--color-button-outline)',
        },
        danger: {
          primary:  'var(--color-danger-primary)',
          secondary:  'var(--color-danger-secondary)',
        },
        'modal-site-background': 'rgb(0,0,0,0.4)'
      }
    },
  },
  plugins: [],
}
