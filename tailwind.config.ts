import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'poker-green': '#1a472a',
        'poker-felt': '#35654d',
        'card-red': '#c41e3a',
        'card-black': '#1a1a2e',
      },
    },
  },
  plugins: [],
}

export default config
