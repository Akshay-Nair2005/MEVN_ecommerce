<template>
  <div
    class="min-h-screen bg-gradient-to-br bg-transparent text-gray-900 dark:text-gray-100">
    <!-- Enhanced Header -->


    <main class="max-w-7xl mx-auto px-4 pb-24">
      <!-- Animated Hero Section with Video -->
      <section class="mt-8 relative overflow-hidden rounded-3xl bg-gray-900 text-white shadow-2xl group">
        <!-- Video Background -->
        <div class="absolute inset-0">
          <video autoplay muted loop playsinline
            class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            poster="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop&auto=format">
            <source src="https://cdn.pixabay.com/video/2023/02/28/160456-804305017_tiny.mp4" type="video/mp4">
          </video>
          <!-- Enhanced Overlay -->
          <div class="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 max-w-7xl mx-auto px-8 md:px-12 py-20 md:py-28">
          <div class="max-w-2xl">
            <!-- Animated Badge -->
            <div class="mb-8">
              <span
                class="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white/15 backdrop-blur-md text-sm font-semibold border border-white/30 animate-pulse-slow">
                ⭐ Premium Collection
              </span>
            </div>

            <!-- Main Heading -->
            <h1 class="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight">
              ELEVATE
              <br>
              <span class="bg-gradient-to-r from-amber-200 via-orange-300 to-red-400 bg-clip-text text-transparent">
                YOUR STYLE
              </span>
            </h1>

            <!-- Description -->
            <p class="text-xl md:text-2xl mb-10 opacity-95 leading-relaxed font-light max-w-xl">
              Discover the art of modern shopping. Where innovation meets elegance in every curated piece.
            </p>

            <!-- Enhanced CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-5 mb-16">
              <button @click="goToProducts"
                class="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:scale-105 transition-all duration-300 shadow-2xl overflow-hidden">
                <div
                  class="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                </div>
                <span class="relative flex items-center gap-3">
                  <span>Explore Collection</span>
                  <span class="group-hover:translate-x-2 transition-transform duration-300 text-xl">⟶</span>
                </span>
              </button>

              <!-- <button
                class="group px-10 py-5 rounded-2xl border-2 border-white/30 text-white font-bold hover:bg-white/15 backdrop-blur-sm transition-all duration-300 flex items-center gap-3">
                <span>View Lookbook</span>
                <span class="text-xl group-hover:rotate-180 transition-transform duration-500">👁️</span>
              </button> -->
            </div>

            <!-- Feature Highlights -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/20 pt-8">
              <div class="text-center">
                <div
                  class="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span class="text-lg">🚚</span>
                </div>
                <div class="font-semibold">Free Shipping</div>
                <div class="text-sm opacity-80">Worldwide</div>
              </div>
              <div class="text-center">
                <div
                  class="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span class="text-lg">↩️</span>
                </div>
                <div class="font-semibold">Easy Returns</div>
                <div class="text-sm opacity-80">30 Days</div>
              </div>
              <div class="text-center">
                <div
                  class="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span class="text-lg">🔒</span>
                </div>
                <div class="font-semibold">Secure Payment</div>
                <div class="text-sm opacity-80">256-bit SSL</div>
              </div>
              <div class="text-center">
                <div
                  class="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span class="text-lg">⭐</span>
                </div>
                <div class="font-semibold">5-Star Rated</div>
                <div class="text-sm opacity-80">By 10K+ Customers</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Elements -->
        <div
          class="absolute top-10 right-10 w-20 h-20 bg-amber-400/20 rounded-full mix-blend-screen filter blur-xl animate-float">
        </div>
        <div
          class="absolute bottom-20 left-10 w-16 h-16 bg-blue-400/20 rounded-full mix-blend-screen filter blur-xl animate-float delay-1000">
        </div>
        <div
          class="absolute top-1/2 right-1/4 w-12 h-12 bg-pink-400/20 rounded-full mix-blend-screen filter blur-xl animate-float delay-2000">
        </div>
      </section>

      <!-- Enhanced Featured Carousel -->
      <section class="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <!-- Main Carousel -->
        <div
          class="lg:col-span-2 bg-white dark:bg-[#0b0b1b] rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800">
          <div class="relative">
            <!-- Carousel Container -->
            <div class="relative h-96 rounded-2xl overflow-hidden">
              <div class="h-full relative">
                <div v-for="(f, i) in featured" v-show="i === currentIndex" :key="f.id"
                  class="absolute inset-0 flex items-center p-8">
                  <!-- Background Image -->
                  <div class="absolute inset-0">
                    <img :src="getHDCarouselImage(i)" class="w-full h-full object-cover transform scale-110"
                      alt="Featured background" />
                    <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                  </div>

                  <!-- Content -->
                  <div class="relative z-10 max-w-md text-white">
                    <div class="mb-4">
                      <span
                        class="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">Featured</span>
                    </div>
                    <h2 class="text-3xl md:text-4xl font-bold mb-4 leading-tight">{{ f.title }}</h2>
                    <p class="text-lg opacity-90 mb-6 line-clamp-2">{{ f.description }}</p>

                    <div class="flex items-center gap-4">
                      <div class="text-3xl font-bold text-amber-300">₹{{ f.price }}</div>

                      <NuxtLink :to="`/description?id=${f.id}`"
                        class="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
                        Shop Now
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Navigation Arrows -->
              <button @click="prev"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 shadow-lg">
                ◀
              </button>
              <button @click="next"
                class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 shadow-lg">
                ▶
              </button>

              <!-- Indicators -->
              <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <button v-for="(_, idx) in featured" :key="idx" @click="currentIndex = idx" :class="[
                  'w-3 h-3 rounded-full transition-all duration-300',
                  currentIndex === idx ? 'bg-amber-400 scale-125' : 'bg-white/50'
                ]"></button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Offers -->
        <aside class="space-y-6">
          <!-- Flash Sale Card -->
          <div
            class="bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl p-6 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span class="font-bold text-sm">FLASH SALE</span>
                </div>
                <h3 class="text-xl font-bold mb-2">Limited Time Offer!</h3>
                <p class="text-sm opacity-90 mb-4">Up to 50% off on premium collections</p>
                <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div class="text-2xl font-bold mb-1">{{ countdownTime }}</div>
                  <div class="text-xs opacity-80">Hours:Minutes:Seconds</div>
                </div>
              </div>
              <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                <span class="text-2xl">🔥</span>
              </div>
            </div>
          </div>

          <!-- Categories Quick Access -->
          <div
            class="bg-white dark:bg-[#0b0b1b] rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800">
            <h4 class="font-bold text-lg mb-4">Quick Categories</h4>
            <div class="grid grid-cols-2 gap-3">
              <button v-for="(c, i) in smallCategories" :key="i" @click="filterByCategory(c)"
                class="group p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#121227] dark:to-[#1a1a35] hover:from-blue-50 hover:to-indigo-100 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all duration-300 transform hover:scale-105">
                <div class="flex flex-col items-center text-center">
                  <div
                    class="w-12 h-12 mb-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                    <span class="text-lg">{{ getCategoryEmoji(c) }}</span>
                  </div>
                  <span class="text-sm font-medium capitalize">{{ c }}</span>
                </div>
              </button>
            </div>
          </div>
        </aside>
      </section>

      <!-- Animated Categories Grid -->
      <section class="mt-16">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4">Explore Categories</h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Discover our carefully curated
            collections designed to elevate your lifestyle</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(cat, idx) in categories" :key="cat"
            class="group relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500">
            <div class="relative h-64 overflow-hidden">
              <img :src="getHDCategoryImage(cat, idx)"
                class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                :alt="cat" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div class="absolute bottom-6 left-6 text-white">
                <h4 class="text-xl font-bold capitalize mb-2">{{ cat }}</h4>
                <button @click="filterByCategory(cat)"
                  class="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 transition-all duration-300">
                  Explore →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Enhanced Products Grid -->
      <section id="products" class="mt-20">
        <div class="flex flex-col lg:flex-row items-center justify-between mb-12">
          <div class="text-center lg:text-left mb-6 lg:mb-0">
            <h2 class="text-4xl font-bold mb-3">Featured Products</h2>
            <p class="text-lg text-gray-600 dark:text-gray-300">Handpicked selections for the discerning shopper</p>
          </div>

          <div class="flex items-center gap-4">
            <select v-model="sortBy"
              class="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0b0b1b] focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <button @click="resetFilter"
              class="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#121227] transition-all duration-300">
              Reset Filters
            </button>
          </div>
        </div>

        <div class="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          <div v-for="item in filteredAndSorted" :key="item.id"
            class="group relative bg-white dark:bg-[#0b0b1b] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 transform transition-all duration-500 hover:-translate-y-4">
            <!-- Product Image -->
            <div class="relative overflow-hidden">
              <div
                class="h-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#121227] dark:to-[#1a1a35] flex items-center justify-center p-8">
                <img :src="item.image || getHDProductImage(item.id)" :alt="item.title"
                  class="max-h-48 object-contain transform group-hover:scale-110 transition-transform duration-700" />
              </div>

              <!-- Badges -->
              <div class="absolute top-4 left-4 flex gap-2">
                <span
                  class="px-3 py-1 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm text-xs font-bold text-gray-800 dark:text-white">
                  {{ item.category }}
                </span>
                <span v-if="item.rating?.rate >= 4.5"
                  class="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
                  Premium
                </span>
              </div>

              <!-- Action Buttons -->
              <div class="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  class="w-10 h-10 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
                  ♡
                </button>
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-6">
              <h3
                class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {{ item.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                {{ item.description }}
              </p>

              <div class="flex items-center justify-between">
                <div>
                  <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">₹{{ item.price }}</div>
                  <!-- <div class="flex items-center gap-1 mt-1">
                    <div class="flex text-amber-400">
                      <span v-for="star in 5" :key="star">★</span>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">({{ item.rating?.count || 0 }})</span>
                  </div> -->
                </div>

                <NuxtLink :to="`/description?id=${item.id}`"
                  class="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
                  View Details
                </NuxtLink>
              </div>
            </div>

            <!-- Hover Effect -->
            <div
              class="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/30 rounded-3xl transition-all duration-500 pointer-events-none">
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredAndSorted.length === 0" class="text-center py-16">
          <div
            class="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <span class="text-3xl">🔍</span>
          </div>
          <h3 class="text-xl font-bold mb-2">No products found</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your filters or search terms</p>
          <button @click="resetFilter"
            class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-300">
            Reset Filters
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
// Import Vue functions
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// Original data fetch (unchanged)
const { data } = await useFetch('http://localhost:2500/server/ecommerce/GetProducts')

// Carousel & UI state
const currentIndex = ref(0)
const autoplayInterval = ref(null)

// Countdown timer state
const countdownTime = ref('06:00:00')
const countdownInterval = ref(null)

// Featured products
const featured = computed(() => {
  console.log(data.value || [])
  return (data.value || []).slice(0, Math.min(6, (data.value || []).length))
})

// Categories
const categories = computed(() => {
  if (!data.value) return []
  const arr = [...new Set(data.value.map((d) => d.category))]
  return arr
})

const smallCategories = computed(() => categories.value.slice(0, 4))

// Sorting & filtering
const selectedCategory = ref('')
const sortBy = ref('')

// Filtered and sorted products (preserved logic)
const filteredAndSorted = computed(() => {
  if (!data.value) return []

  const items = data.value.filter((item) => {
    if (!selectedCategory.value) return true
    return item.category === selectedCategory.value
  })

  if (sortBy.value === 'price-asc') {
    return items.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    return items.sort((a, b) => b.price - a.price)
  }
  return items
})

// Countdown timer function
const startCountdown = () => {
  // Set end time to 6 hours from now
  const endTime = new Date().getTime() + (6 * 60 * 60 * 1000) // 6 hours

  countdownInterval.value = setInterval(() => {
    const now = new Date().getTime()
    const distance = endTime - now

    if (distance < 0) {
      clearInterval(countdownInterval.value)
      countdownTime.value = '00:00:00'
      return
    }

    // Calculate hours, minutes, seconds
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    // Format with leading zeros
    countdownTime.value =
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, 1000)
}

// Carousel controls
const next = () => {
  if (featured.value.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % featured.value.length
}

const prev = () => {
  if (featured.value.length === 0) return
  currentIndex.value = (currentIndex.value - 1 + featured.value.length) % featured.value.length
}

// Autoplay
onMounted(() => {
  // Start carousel autoplay
  autoplayInterval.value = setInterval(() => {
    if (featured.value.length > 1) next()
  }, 5000)

  // Start countdown timer
  startCountdown()
})

onBeforeUnmount(() => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
  }
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
})

// Enhanced image getters with HD Unsplash images
const getHDCarouselImage = (index) => {
  const images = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=1200&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop&auto=format'
  ]
  return images[index % images.length]
}

const getHDCategoryImage = (category, index) => {
  const categoryImages = {
    "electronics": 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop&auto=format',
    "jewelery": 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop&auto=format',
    "men's clothing": 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=400&fit=crop&auto=format',
    "women's clothing": 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=400&fit=crop&auto=format'
  }
  return categoryImages[category] || `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&auto=format`
}

const getHDProductImage = (id) => {
  const images = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop&auto=format'
  ]
  return images[id % images.length]
}

const getCategoryEmoji = (category) => {
  const emojis = {
    "electronics": "📱",
    "jewelery": "💎",
    "men's clothing": "👔",
    "women's clothing": "👗"
  }
  return emojis[category] || "🛍️"
}

// Filter by category
const filterByCategory = (cat) => {
  selectedCategory.value = cat
  // Scroll to products section
  nextTick(() => {
    const el = document.getElementById('products')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const resetFilter = () => {
  selectedCategory.value = ''
  sortBy.value = ''
}

const goToProducts = () => {
resetFilter()
nextTick(() => {
const el = document.getElementById('products')
if (el) {
el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
})
}
</script>

<style scoped>
/* Enhanced Carousel Animations */
.carousel-slide-enter-active,
.carousel-slide-leave-active {
  transition: all 0.8s ease-in-out;
}

.carousel-slide-enter-from {
  opacity: 0;
  transform: translateX(60px) scale(0.95);
}

.carousel-slide-enter-to {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.carousel-slide-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.carousel-slide-leave-to {
  opacity: 0;
  transform: translateX(-60px) scale(0.95);
}

/* Custom Animations */
@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(50px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out;
}

.animate-pulse-slow {
  animation: pulse 3s ease-in-out infinite;
}

.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-300 {
  animation-delay: 0.3s;
}

.delay-1000 {
  animation-delay: 1s;
}

.delay-2000 {
  animation-delay: 2s;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}

/* Line clamp utility */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Glass morphism effect */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>