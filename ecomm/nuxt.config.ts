export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: {
    "./runtimeConfig": "./runtimeConfig.browser"
  },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/color-mode","nuxt-vuefire"],
  colorMode: {
    classSuffix: "",
  },
  ssr: false,
  vite: {
    define: {
      "window.global": {}
    }
  },
  vuefire:{
    auth:{
      enabled:true,
      sessionCookie:false,
    },
    config:{
        apiKey: "AIzaSyCk4SWuOFJGcCNi8VmaC6qBCnTUr8_mluw",
        authDomain: "nuxtauth-ba1e8.firebaseapp.com",
        projectId: "nuxtauth-ba1e8",
        storageBucket: "nuxtauth-ba1e8.appspot.com",
        messagingSenderId: "1068239361001",
        appId: "1:1068239361001:web:9a8abf410ca509c31b7178",
        measurementId: "G-PHEM9RDYJF"
      
    },
  },
  runtimeConfig: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    public: {
      NUXT_STRIPE_PUBLIC_KEY: process.env.NUXT_STRIPE_PUBLIC_KEY, // ✅ match this name
    },
  },

  
});
