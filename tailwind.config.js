/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        clouditor: '#007FC3',
        'clouditor-light': '#008CD7'
      },
      fontFamily: {
        sans: [
          'InterVariable, sans-serif',
          {
            fontFeatureSettings: '"cv11", "ss01"'
          }
        ]
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
