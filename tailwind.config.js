/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)']
      },
      colors: {
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        muted: 'rgb(var(--muted))',
        accent: 'rgb(var(--accent))',
      },
      backgroundImage: {
        'firefly-radial': "radial-gradient(30% 30% at 50% 50%, rgba(176, 182, 189, 0.7) 0%, rgba(217,217,217, 0) 100%)"
      },
      boxShadow: {
        'glass-inset': 'inset 0 17px 5px -9px rgba(228, 140, 41, 0.37)',
        'glass-sm': '5px 5px 20px 0px rgba(190, 118, 34, 0.8)',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { 
            transform: 'rotate(0deg) translateZ(0)',
            WebkitTransform: 'rotate(0deg) translateZ(0)'
          },
          '100%': { 
            transform: 'rotate(-360deg) translateZ(0)',
            WebkitTransform: 'rotate(-360deg) translateZ(0)'
          }
        },
        'spin': {
          '0%': { 
            transform: 'rotate(0deg) translateZ(0)',
            WebkitTransform: 'rotate(0deg) translateZ(0)'
          },
          '100%': { 
            transform: 'rotate(360deg) translateZ(0)',
            WebkitTransform: 'rotate(360deg) translateZ(0)'
          }
        }
      },
      animation: {
        'spin-slow': 'spin 40s linear infinite',
        'spin-slow-reverse': 'spin-reverse 40s linear infinite',
      },
      screens: {
        xs: '480px'
      }
    },
  },
  plugins: [],
};