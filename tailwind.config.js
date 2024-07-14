module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/(tabs)/**/*.{js,jsx,ts,tsx}", // Add this line
  ],
  theme: {
    extend: {
      fontFamily: {
        dmSansBold: ["DMSans-Bold", "sans-serif"],
        dmSansRegular: ["DMSans-Regular", "sans-serif"],
        dmSansMedium: ["DMSans-Medium", "sans-serif"],
        spaceGroteskBold: ["SpaceGrotesk-Bold", "sans-serif"],
        spaceGroteskRegular: ["SpaceGrotesk-Regular", "sans-serif"],
        spaceGroteskMedium: ["SpaceGrotesk-Medium", "sans-serif"],
        s,
      },
    },
  },

  plugins: [],
};
