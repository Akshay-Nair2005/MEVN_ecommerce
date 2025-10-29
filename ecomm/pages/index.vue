<template>
  <div class="min-h-screen dark:bg-[#19193f] bg-white transition-colors duration-300">
    <!-- Header / Theme Switcher -->
    <header class="flex justify-around  items-center px-6 py-4 shadow-sm bg-white dark:bg-[#19193f]">
      <div class=""></div>
      <h2 class="text-4xl font-palaquin font-bold dark:text-white">
                The <span class="text-coral-red text-4xl font-palaquin font-bold"> Amazon </span> Store
      </h2>
      <div class="relative">
        <select
          v-model="colorMode.preference"
          class="appearance-none px-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-100 dark:bg-[#19193f] text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </header>

    <!-- Products Section -->
     <div class="mt-8 pb-8">

       <Items />
     </div>

  </div>
</template>

<script setup>
const colorMode = useColorMode();
</script>
