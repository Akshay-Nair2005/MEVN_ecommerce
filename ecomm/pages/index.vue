<template>
  <div class="min-h-screen bg-white dark:bg-[#19193f] transition-colors duration-500">
    <!-- Header -->
    <header
      class="sticky top-0 z-40 flex items-center justify-between px-8 py-4  dark:bg-[#19193f]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm"
    >

      <!-- Navbar -->
      <Navbar />

      <!-- Right Section -->
     
    </header>

    <!-- Products Section -->
    <main class="px-6 md:px-10 lg:px-20 mt-10 pb-10">
      <h2 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Featured Products</h2>

      <div class="">
        <Items />
      </div>
    </main>
  </div>
</template>

<script setup>


</script>
