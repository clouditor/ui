module.exports = {
	plugins: [
	  require('@tailwindcss/postcss')({     // neu
		config: './tailwind.config.js',     // Pfad zu deiner Tailwind-Config
	  }),
	  require('autoprefixer'),
	],
  };
