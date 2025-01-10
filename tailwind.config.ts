import { nextui } from '@nextui-org/theme';
import type { Config } from 'tailwindcss';

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}", // Include all NextUI components
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // Background variable for NextUI
        foreground: "var(--foreground)", // Foreground variable for NextUI
        primary: "var(--colors-primary)", // Optional: Add primary color for consistency
        secondary: "var(--colors-secondary)", // Optional: Add secondary color
        accent: "var(--colors-accent)", // Optional: Add accent color
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Add the Tailwind Typography plugin
    nextui(), // Add the NextUI plugin for seamless integration
  ],
} satisfies Config;
