import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        centralPanelShadow: '4px 4px 14px 0px black, 0 0 20px 2px white',
        inputShadow: 'inset 0px 0px 3px #141f24',
        inputShadowDark: 'inset 0px 0px 3px #d7d5cf',
      },
      dropShadow: {
        textShadow: '0px 0px 2px #141f24',
        textShadowDark: '0px 0px 2px #d7d5cf',
      },
      backgroundImage: {
        'gradient-light':
          'linear-gradient(135deg, #b9bcbd 0%, #b5baba 10%, #9ea5a7 30%, #959ea2 100%)',
        'gradient-dark': 'linear-gradient(to bottom, #1a1a1a, #000000)',
        'form-gradient-light':
          'linear-gradient(150deg, #e9e6e0 0%, #dbdad6 33%, #d2d0cc 66%, #c8c6c2 100%)',
        'form-gradient-dark': 'linear-gradient(to bottom, #1a1a1a, #000000)',
      },
      colors: {
        background: 'var(--background)',
        background2: 'var(--background2)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
} satisfies Config
