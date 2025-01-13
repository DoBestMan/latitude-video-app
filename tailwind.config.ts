import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        primary: '#00A3FF',
        background: '#000000',
      },
      opacity: {
        '30': '0.3',
        '80': '0.8',
      }
    }
  },

  plugins: []
} satisfies Config;
