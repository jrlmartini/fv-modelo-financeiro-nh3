import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#03131e',
        card: '#071724',
        accent: '#275fc1',
        border: '#214059',
        textMain: '#f2f2f2',
        textSecondary: '#c1cdd9'
      }
    }
  },
  plugins: []
};

export default config;
