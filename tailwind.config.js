// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Ensure this points to your source files
  ],
  theme: {
    extend: {
      colors: {
        'scrollbar-thumb': '#4b5563',
        'scrollbar-track': '#1f2937',
      },
      width: {
        'scrollbar': '8px',
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.custom-scrollbar::-webkit-scrollbar': {
          width: '8px', // width of the scrollbar
        },
        '.custom-scrollbar::-webkit-scrollbar-track': {
          backgroundColor: '#1f2937', // background color of the track
          borderRadius: '50px',
        },
        '.custom-scrollbar::-webkit-scrollbar-thumb': {
          backgroundColor: '#4b5563', // thumb color
          borderRadius: '50px',
          border: '2px solid #1f2937', // thumb border
        },
        '.custom-scrollbar::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#6b7280', // thumb color when hovered
        },
        '.custom-scrollbar': {
          scrollbarWidth: 'thin', // Firefox custom scrollbar width
          scrollbarColor: '#4b5563 #1f2937', // Firefox thumb and track color
        },
      });
    },
  ],
}
