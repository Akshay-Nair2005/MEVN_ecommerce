<template>
  <themeb />
    <div class="container mx-auto dark:bg-[#19193f]">
      <h2 class="text-4xl font-bold mb-4 ml-12 dark:text-white"><span class="text-coral-red">Shopping</span> Cart</h2>
      <div v-if="cartItems.length === 0"
        class="flex max-md:flex-col max-sm:flex-col ml-8 max-sm:text-center max:md-text-center border-b border-gray-300 py-4 border-4 border-transparent shadow-lg mt-8 rounded-lg w-[80%] text-3xl">
        <p class="text-center dark:text-white">
          Your cart is empty.
        </p>
      </div>
      <div v-else>
        <div v-for="(item, index) in cartItems" :keys="item"
          class="flex max-md:flex-col gap-12 ml-8 max-sm:flex-col max-sm:text-center max:md-text-center items-center justify-between border-4 border-gray-300 py-4 dark:bg-black dark:border-white/10 border-transparent shadow-lg mt-8 rounded-lg w-[90%]">
          <!-- {{item._id}} -->
          <div>
            <img :src="item.product.image" class="w-[200px] h-[180px] ml-8 border-4 border-white/10 dark:border-white/10  rounded-lg" />
          </div>
          <div class="text-center ml-24">
            <h3 class="text-2xl font-semibold text-coral-red">{{ item.product.title }}</h3><br>
            <p class="dark:text-white">Category: {{ item.product.category }}</p>
            <p class="dark:text-white">Quantity: {{ item.quantity }}</p><br>
          </div>
          <div class="mt-4">
            <h3 class="text-xl font-semibold">Total Price: ${{ item.product.price * item.quantity }}</h3>
          </div>
          <div>
            <br>
          </div>
          <div class="bg-red-500 p-3 rounded-lg">
            <button @click="removeFromCart(item._id)" class="text-white font-semibold">Remove</button>
          </div>
          <br><br>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const cartItems = ref([])
  let totalPrice = ref(0)
  
  const fetchCartItems = async () => {
  try {
    const response = await fetch('http://localhost:2500/server/ecommerce/GetCartItems') 
    const data = await response.json()
    cartItems.value = data
    console.log(cartItems.value)
    updateTotalPrice()
  } catch (error) {
    console.error('Error fetching cart items:', error)
  }
}

const updateTotalPrice = () => {
    totalPrice.value = cartItems.value.reduce((acc, curr) => {
      return acc + (curr.product.price * curr.quantity)
    }, 0)
}
  
  onMounted(() => {
    fetchCartItems()
  })
  
  const removeFromCart = async (productId,quantity) => {
    try {
      const response = await fetch(`http://localhost:2500/server/ecommerce/DeleteCartItem?id=${productId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        cartItems.value = cartItems.value.filter(item => item.productId !== productId  ) 
        // updateTotalPrice()
        fetchCartItems()
        
      } else {
        console.error('Failed to remove item from cart:', response.statusText)
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error.message)
    }
  }
  </script>
  
  <style lang="scss" scoped>
  
  </style>
  