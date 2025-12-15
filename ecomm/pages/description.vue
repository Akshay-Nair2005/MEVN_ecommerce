<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-[#0f1028] dark:via-[#0d0e24] dark:to-[#131230] transition-all duration-500">
    <!-- New Enhanced Navbar -->
    <Navbar />
    <!-- Animated Background Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-amber-400/10 to-orange-500/10 rounded-full blur-3xl animate-float-slow"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-blue-500/10 rounded-full blur-3xl animate-float-slow delay-2000"></div>
      <div class="absolute top-3/4 left-3/4 w-64 h-64 bg-gradient-to-r from-green-400/5 to-teal-500/5 rounded-full blur-2xl animate-float delay-3000"></div>
    </div>

    <div class="container mx-auto px-4 py-8 relative z-10">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
        <NuxtLink to="/" class="hover:text-amber-600 transition-colors">Home</NuxtLink>
        <span>›</span>
        <span class="text-amber-600 font-semibold">{{ product.category }}</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
        <!-- Left: Product Image Gallery -->
        <div class="space-y-6">
          <!-- Main Image -->
          <div class="relative group">
            <div class="absolute -inset-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            <div class="relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50 transform transition-all duration-500 group-hover:scale-105">
              <img
                :src="product.image"
                :alt="product.title"
                class="w-full h-96 object-contain transform group-hover:scale-110 transition-transform duration-700"
              />
              <!-- Premium Badge -->
              <div v-if="product.rating?.rate >= 4.5" class="absolute top-4 left-4">
                <span class="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-full text-sm shadow-lg transform rotate-12">
                  ⭐ Premium
                </span>
              </div>
              <!-- Category Tag -->
              <div class="absolute top-4 right-4">
                <span class="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-semibold rounded-full text-xs">
                  {{ product.category }}
                </span>
              </div>
            </div>
          </div>

          <!-- Image Thumbnails -->
          <div class="grid grid-cols-4 gap-4">
            <div 
              v-for="n in 4" 
              :key="n"
              class="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-white/20 dark:border-gray-700/50 transform hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <img
                :src="product.image"
                :alt="`${product.title} view ${n}`"
                class="w-full h-20 object-contain"
              />
            </div>
          </div>
        </div>

        <!-- Right: Product Details -->
        <div class="space-y-8">
          <!-- Product Header -->
          <div class="space-y-4">
            <h1 class="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-800 via-amber-600 to-orange-600 dark:from-white dark:via-amber-200 dark:to-orange-200 bg-clip-text text-transparent leading-tight">
              {{ product.title }}
            </h1>
            
            <!-- Rating and Reviews -->
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <div class="flex text-amber-400 text-xl">
                  <span v-for="star in 5" :key="star">★</span>
                </div>
                <span class="text-gray-600 dark:text-gray-400 font-semibold">
                  {{ product.rating?.rate || '4.5' }} ({{ product.rating?.count || '100' }} reviews)
                </span>
              </div>
              <div class="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span class="text-green-600 font-semibold">In Stock</span>
            </div>

            <!-- Price -->
            <div class="flex items-center gap-4">
              <div class="text-5xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                ${{ product.price }}
              </div>
              <div class="text-2xl text-gray-400 line-through">${{ (product.price * 1.2).toFixed(2) }}</div>
              <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold rounded-full text-sm">
                Save 20%
              </span>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-4">
            <h3 class="text-2xl font-bold text-gray-800 dark:text-white">Description</h3>
            <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <!-- Features -->
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm">
              <div class="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <span class="text-amber-600 text-lg">🚚</span>
              </div>
              <div>
                <div class="font-semibold text-gray-800 dark:text-white">Free Shipping</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Worldwide</div>
              </div>
            </div>
            <div class="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm">
              <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <span class="text-green-600 text-lg">↩️</span>
              </div>
              <div>
                <div class="font-semibold text-gray-800 dark:text-white">Easy Returns</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">30 Days</div>
              </div>
            </div>
            <div class="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <span class="text-blue-600 text-lg">🔒</span>
              </div>
              <div>
                <div class="font-semibold text-gray-800 dark:text-white">Secure Payment</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">256-bit SSL</div>
              </div>
            </div>
            <div class="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm">
              <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <span class="text-purple-600 text-lg">⭐</span>
              </div>
              <div>
                <div class="font-semibold text-gray-800 dark:text-white">5-Star Rated</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Quality Assured</div>
              </div>
            </div>
          </div>

          <!-- Quantity and Actions -->
          <div class="space-y-6">
            <!-- Quantity Selector -->
            <div class="space-y-3">
              <label class="text-lg font-semibold text-gray-800 dark:text-white">Quantity</label>
              <div class="flex items-center gap-4">
                <div class="flex items-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <button 
                    @click="quantity > 1 ? quantity-- : null"
                    class="px-6 py-4 text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-colors text-xl font-bold"
                  >
                    -
                  </button>
                  <input
                    v-model.number="quantity"
                    type="number"
                    min="1"
                    class="w-20 text-center bg-transparent text-xl font-bold text-gray-800 dark:text-white outline-none"
                  />
                  <button 
                    @click="quantity++"
                    class="px-6 py-4 text-gray-600 dark:text-gray-400 hover:text-amber-600 transition-colors text-xl font-bold"
                  >
                    +
                  </button>
                </div>
                <div class="text-lg text-gray-600 dark:text-gray-400">
                  Total: <span class="font-bold text-amber-600">${{ (product.price * quantity).toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                @click="addToCart"
                class="flex-1 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <svg class="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Add to Cart • ${{ (product.price * quantity).toFixed(2) }}
              </button>
              
              <NuxtLink
                :to="currentUser ? `/cart?userid=${currentUser.uid}` : '/login'"
                class="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group no-underline"
              >
                <svg class="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z"/>
                </svg>
                View Cart
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Similar Items Section - NEW HOVER STYLING -->
      <div class="mt-20">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-black bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
            Similar Products
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover more amazing products from the same category
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="item in similarItems.slice(0, 4)"
            :key="item.id"
            class="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/50 transform transition-all duration-500 hover:-translate-y-4 hover:shadow-3xl"
          >
            <!-- NEW: Enhanced Background Glow Effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <!-- NEW: Border Glow Effect -->
            <div class="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-500/30 transition-all duration-500"></div>
            
            <div class="relative z-10">
              <!-- Product Image -->
              <div class="relative mb-4">
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="w-full h-48 object-contain transform group-hover:scale-110 transition-transform duration-500"
                />
                <!-- NEW: Quick View Overlay -->
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-all duration-500 flex items-center justify-center">
                  <div class="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span class="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 font-semibold rounded-full text-sm">
                      Quick View
                    </span>
                  </div>
                </div>
              </div>

              <!-- Product Info -->
              <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {{ item.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {{ item.description }}
              </p>

              <div class="flex items-center justify-between">
                <div class="text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  ${{ item.price }}
                </div>
                <NuxtLink
                  :to="`/description?id=${item.id}`"
                  class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 text-sm no-underline group-hover:shadow-2xl"
                >
                  View Details
                </NuxtLink>

              </div>
            </div>
          </div>
        </div>
        <div class="mt-2">
          <Review />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFetch } from '#app'
import { getAuth, onAuthStateChanged } from "firebase/auth";

const toast = useToast()
const route = useRoute()
const router = useRouter();
const productId = ref(route.query.id)
const product = ref({})
const quantity = ref(1)
const similarItems = ref([])
const currentUser = ref(null);
const uid = computed(() => currentUser.value?.uid || null)


const fetchProduct = async (id) => {
  const response = await fetch(`http://localhost:2500/server/ecommerce/GetProducts/${id}`)
  product.value = await response.json()

  // Fetch all products for similar items
  const { data } = await useFetch('http://localhost:2500/server/ecommerce/GetProducts')
  if (data.value) {
    similarItems.value = data.value.filter(
      (item) => item.category === product.value.categsory && item.id !== product.value.id
    )
  }
}

onMounted(() => {
  fetchProduct(productId.value)
})

// 👇 Watch for route change and refetch
watch(
  () => route.query.id,
  (newId) => {
    if (newId) {
      productId.value = newId
      fetchProduct(newId)
    }
  }
)

const addToCart = async () => {
  if (!uid.value) {
  toast.warning({title:"Login",message:"Please Login First",timeout:3000})
  router.replace('/login')
}
  const data = {
    uid:uid.value,
    productId: productId.value,
    quantity: quantity.value,
    product: {
      id: product.value.id,
      title: product.value.title,
      description: product.value.description,
      category: product.value.category,
      price: product.value.price,
      image: product.value.image
    }
  }

  try {
    const response = await fetch('http://localhost:2500/server/ecommerce/AddToCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      toast.success({
        title:'Success!',
        message:`Added ${quantity.value} item(s) to Cart. Total price: $${product.value.price * quantity.value}`,
        timeout:3000
      }
      )
    } else {
      console.error('Failed to add item to cart:', response.statusText)
    }
  } catch (error) {
    console.error('Failed to add item to cart:', error.message)
  }
}

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
     currentUser.value = user;
    if (user) {
        console.log("UID:", user.uid);
        // user.uid is available here
    } else {
        console.log("No user logged in");
    }
});
</script>

<style scoped>
/* Custom Animations */
@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(-10px) rotate(180deg); 
  }
}

@keyframes float-slow {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg); 
  }
  33% { 
    transform: translateY(-20px) translateX(10px) rotate(120deg); 
  }
  66% { 
    transform: translateY(10px) translateX(-20px) rotate(240deg); 
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 15s ease-in-out infinite;
}

.delay-1000 {
  animation-delay: 1s;
}

.delay-2000 {
  animation-delay: 2s;
}

.delay-3000 {
  animation-delay: 3s;
}

/* Glass morphism effect */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}

/* Enhanced shadows */
.shadow-3xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 25px -5px rgba(0, 0, 0, 0.1);
}

/* Line clamp utility */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, transform, box-shadow, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Navbar Link Styling */
.nav-link-premium {
  @apply relative text-gray-700 dark:text-gray-200 font-semibold transition-all duration-300 py-2 px-4 rounded-2xl hover:text-blue-600 dark:hover:text-blue-400;
}

.nav-link-premium::before {
  content: '';
  @apply absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 rounded-full transition-all duration-300 transform -translate-x-1/2;
}

.nav-link-premium:hover::before {
  @apply w-4/5;
}

/* Custom scrollbar for similar items */
.custom-scroll::-webkit-scrollbar {
  width: 8px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 8px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(249, 115, 22, 0.8);
  border-radius: 8px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(239, 68, 68, 0.8);
}

/* Firefox */
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(249, 115, 22, 0.8) transparent;
}
</style>