<template>
  <header
    class="sticky top-0 z-50 w-full bg-white dark:bg-[#19193f] "
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
      <!-- Brand -->
      <a href="#" class="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
        <svg class="w-7 h-7 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h18v4H3zM3 8h18v13H3z" />
        </svg>
        ShopMate
      </a>

      <!-- Burger (Mobile) -->
      <button
        class="md:hidden text-gray-800 dark:text-gray-100 focus:outline-none"
        @click="mobileOpen = !mobileOpen"
        aria-label="Toggle menu"
      >
        <svg v-if="!mobileOpen" class="w-6 h-6" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="w-6 h-6" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" d="M6 6l12 12M6 18L18 6" />
        </svg>
      </button>

      <!-- Navigation -->
      <nav
        :class="[
          'flex flex-col md:flex-row md:items-center md:gap-6 md:static absolute top-full left-0 w-full md:w-auto bg-white dark:bg-[#19193f] md:bg-transparent md:dark:bg-transparent border-t md:border-0 border-gray-200 dark:border-gray-700 md:opacity-100 transition-all duration-300',
          mobileOpen ? 'opacity-100 visible p-4' : 'opacity-0 invisible md:opacity-100 md:visible',
        ]"
      >
        <ul class="flex flex-col md:flex-row gap-4 md:gap-6 font-medium text-gray-800 dark:text-gray-100">
          <li><a href="#" class="hover:text-[#e17d25]">Home</a></li>
          <li><a href="#" class="hover:text-[#e17d25]">Shop</a></li>
          <li><a href="#" class="hover:text-[#e17d25]">Categories</a></li>
        </ul>

        <!-- Search -->
        <form
          @submit.prevent="onSearch"
          class="flex items-center border border-gray-400 dark:border-gray-300 rounded-lg px-3 py-1 mt-4 md:mt-0 md:ml-4"
        >
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none w-full"
          />
          <button type="submit" aria-label="Search" class="ml-2 text-lg hover:text-[#e17d25]">🔍</button>
        </form>

        <!-- Right Icons + Theme -->
        <div class="flex items-center space-x-3 md:ml-4 mt-4 md:mt-0">
          <button
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a5a] transition"
            aria-label="Cart"
          >
            🛒
          </button>
          <button
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a5a] transition"
            aria-label="Account"
          >
            👤
          </button>

          <!-- Theme Switcher -->
          <div class="relative">
            <select
              v-model="colorMode.preference"
              class="appearance-none px-4 py-2 pr-8 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-gray-100 dark:bg-[#252552] text-gray-800 dark:text-white 
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer transition"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <span
              class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
            >
              ▼
            </span>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const mobileOpen = ref(false)
const searchQuery = ref('')
const colorMode = useColorMode()

const onSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching for:', searchQuery.value)
    mobileOpen.value = false
  }
}
</script>
