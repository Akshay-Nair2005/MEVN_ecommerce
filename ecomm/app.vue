<template>
  <NuxtPage />
</template>

<script setup>
useHead({
  script: [
    {
      src: "https://checkout.razorpay.com/v1/checkout.js",
      defer: true
    }
  ]
})
</script>

