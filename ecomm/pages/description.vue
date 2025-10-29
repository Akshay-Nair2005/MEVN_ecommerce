<template>
  <div
    class="flex w-full max-md:flex-col max-sm:flex-col dark:bg-[#19193f] min-h-screen p-6 gap-8"
  >
    <!-- Left: Product Image + Details -->
    <div
      class="w-[70%] max-md:w-full max-sm:w-full flex flex-col items-start max-md:items-center"
    >
      <img
        :src="product.image"
        alt="product image"
        class="w-[50%] h-[490px] object-contain dark:bg-white max-md:w-[70%] max-sm:w-[80%] shadow-2xl rounded-2xl mt-8"
      />
      <div class="mt-6 space-y-4 w-full max-md:text-center px-8">
        <h1
          class="font-semibold text-coral-red font-montserrat text-3xl leading-snug"
        >
          {{ product.title }}
        </h1>
        <p
          class="font-semibold font-montserrat text-slate-gray text-lg leading-7"
        >
          {{ product.description }}
        </p>
        <p
          class="font-semibold font-montserrat text-slate-gray text-lg leading-7"
        >
          {{ product.category }}
        </p>
        <p
          class="font-semibold font-montserrat text-coral-red text-xl leading-7"
        >
          ${{ product.price }}
        </p>
      </div>
    </div>

    <!-- Right: Cart Actions + Similar Items -->
    <div
      class="mt-[5%] w-[30%] max-md:w-[90%] max-sm:w-[95%] flex flex-col gap-8 items-center self-start"
    >
      <!-- Cart Actions -->
      <div
        class="flex items-center gap-3 p-3.5 border border-slate-gray dark:border-white rounded-full w-full"
      >
        <input
          v-model="quantity"
          type="number"
          placeholder="No of Items"
          id="quantity"
          class="flex-1 text-base leading-normal text-slate-gray pl-5 outline-none bg-transparent dark:bg-[#19193f] dark:text-white"
        />
        <button
          @click="addToCart"
          class="text-white bg-orange-600 border-4 border-orange-600 px-6 py-2 rounded-full font-monteserrat text-[16px] hover:bg-red-500 transition"
        >
          Add to Cart
        </button>
      </div>

      <NuxtLink
        :to="`/cart?productId=${product.id}&quantity=${quantity}`"
        class="text-white bg-orange-600 border-4 border-orange-600 px-8 py-3 rounded-full font-monteserrat text-[16px] hover:bg-red-500 transition no-underline"
      >
        View Cart
      </NuxtLink>

      <!-- Similar Items Section -->
      <div class="w-full mt-6">
        <h2 class="text-xl font-semibold font-montserrat text-coral-red mb-4">
          Similar Items
        </h2>
        <div class="grid grid-cols-1 gap-4 h-80 overflow-y-auto pr-2 custom-scroll">
          <div
            v-for="item in similarItems.slice(0, 4)"
            :key="item.id"
            class="p-4 border border-slate-gray dark:border-white rounded-lg shadow-md flex flex-col items-center gap-3"
          >
            <img
              :src="item.image"
              alt="similar product"
              class="w-24 h-24 object-contain"
            />
            <p
              class="text-slate-gray font-montserrat font-medium text-center line-clamp-2"
            >
              {{ item.title }}
            </p>
            <NuxtLink
              :to="`/description?id=${item.id}`"
              class="text-white bg-orange-600 border-2 border-orange-600 px-4 py-1 rounded-full font-monteserrat text-sm hover:bg-red-500 transition no-underline"
            >
              View
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Custom vertical scrollbar */
.custom-scroll::-webkit-scrollbar {
  width: 8px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent; /* Or use a subtle gray */
  border-radius: 8px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(249, 115, 22, 0.8); /* orange-600 */
  border-radius: 8px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(239, 68, 68, 0.8); /* red-500 hover */
}

/* Firefox */
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(249, 115, 22, 0.8) transparent;
}

</style>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFetch } from '#app'

const route = useRoute()
const productId = ref(route.query.id)
const product = ref({})
const quantity = ref(1)
const similarItems = ref([])

const fetchProduct = async (id) => {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`)
  product.value = await response.json()

  // Fetch all products for similar items
  const { data } = await useFetch('https://fakestoreapi.com/products')
  if (data.value) {
    similarItems.value = data.value.filter(
      (item) => item.category === product.value.category && item.id !== product.value.id
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
  const data = {
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
      alert(
        `Added ${quantity.value} item(s) to Cart. Total price: $${product.value.price * quantity.value}`
      )
    } else {
      console.error('Failed to add item to cart:', response.statusText)
    }
  } catch (error) {
    console.error('Failed to add item to cart:', error.message)
  }
}
</script>

