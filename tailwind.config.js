/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        clouditor: '#007FC3'
      },
      fontFamily: {
        sans: [
          'Inter var, sans-serif',
          {
            fontFeatureSettings: '"cv11", "ss01"'
          }
        ]
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
