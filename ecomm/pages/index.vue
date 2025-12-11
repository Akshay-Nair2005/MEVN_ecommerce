<template>
   <themeb />
  <div class="min-h-screen bg-white dark:bg-[#19193f] transition-colors duration-500">
    <!-- Header -->
    <Navbar />

    <!-- Products Section -->
    <main class="px-6 md:px-10 lg:px-20 mt-10 pb-10">
      <h2 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Featured Products</h2>

      <div class="">
        <Items />
        <div class="">
          <Chatbot />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>


</script>
