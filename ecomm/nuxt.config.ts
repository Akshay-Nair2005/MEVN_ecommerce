export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: {
    "./runtimeConfig": "./runtimeConfig.browser"
  },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/color-mode"],
  colorMode: {
    classSuffix: "",
  },
  ssr: false,
  vite: {
    define: {
      "window.global": {}
    }
  },
  runtimeConfig: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    public: {
      NUXT_STRIPE_PUBLIC_KEY: process.env.NUXT_STRIPE_PUBLIC_KEY, // ✅ match this name
    },
  },
});
