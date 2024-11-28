module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    cssnano: {}, // This handles CSS minimization
    "postcss-preset-env": {
      stage: 0, // Enable all modern CSS features
    },
  },
};
