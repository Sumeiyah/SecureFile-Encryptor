/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out forwards',
        slideUp: 'slideUp 0.8s ease-out forwards',
        slideUpDelay: 'slideUp 0.8s ease-out forwards 0.2s',
        slideUpDelay2: 'slideUp 0.8s ease-out forwards 0.4s',
        slideUpDelay3: 'slideUp 0.8s ease-out forwards 0.6s',
        slideUpDelay4: 'slideUp 0.8s ease-out forwards 0.8s',
        slideUpDelay5: 'slideUp 0.8s ease-out forwards 1s',
      },
    },
  },
  plugins: [],
};
