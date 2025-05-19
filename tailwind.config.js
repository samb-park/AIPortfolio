/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.css',
    './src/**/*.module.css',
  ],
  safelist: [
    'rounded-lg',
    'rounded-b-md',
    'border-2',
    'border-gray-600',
    'bg-transparent',
    'p-4',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}; 