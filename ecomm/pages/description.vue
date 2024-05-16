<template>

    <div class="flex w-[100%] max-md:flex-col max-md:w-full max-sm:flex-col dark:bg-[#19193f]">
        <div class="w-[70%] max-md:w-[100%] max-sm:w-[100%] max-md:h-[100%] max-sm:h-[100%] ">
            <img :src="product.image"
                class="w-[50%] h-[490px] dark:bg-white max-md:w-[80%] max-sm:w-[80%] max-md:ml-[12%] max-sm:[12%] pt-12 ml-8 backdrop-opacity-100 bg-transperant border-4 border-transperant shadow-lg mt-8 rounded-lg" />
            <h1
                class="mt-2 w-[80%] max-md:w-[100%] max-sm:w-[100%] font-semibold text-coral-red font-montserrat text-3xl ml-8 leading-7 max-sm:mt-8 max-md:mt-8">
                {{ product.title }}</h1>
            <p
                class="mt-2 ml-8 w-[80%] max-md:w-[80%] max-sm:w-[80%] max-md:text-center max-sm:text-center font-semibold font-montserrat text-slate-gray text-lg leading-7">
                {{ product.description }}</p>
            <p
                class="mt-2 ml-8 w-[80%] max-md:w-[80%] max-sm:w-[80%] max-md:text-center max-sm:text-centerfont-semibold font-montserrat text-slate-gray text-lg leading-7">
                {{ product.category }}</p>
            <p
                class="mt-2 ml-8 w-[80%] max-md:w-[80%] max-sm:w-[80%] max-md:text-center max-sm:text-center font-semibold font-montserrat text-coral-red text-lg leading-7">
                ${{ product.price }}</p>
        </div>

        <div class="mt-[10%] mr-4 w-[30%] max-md:w-[90%] max-sm:w-[90%]">
            <br><br>
            <div class='flex items-center max-sm:flex p-3.5 border border-slate-gray dark:border-white rounded-full'>
                <input v-model="quantity" type="number" placeholder='No of Items' id="quantity"
                    class="sm:flex-1 w-full h-[20%] max-sm:w-full text-base leading-normal text-slate-gray pl-5 max-sm:p-5 outline-none sm:border-none max-sm:rounded-full dark:bg-[#19193f] dark:text-white" />
                <div class='flex max-sm:justify-end items-center max-sm:w-full'>
                    <button @click="addToCart"
                        class="text-white bg-orange-600 border-4 border-orange-600 p-3 rounded-full font-monteserrat text-[16px] items-center hover:bg-red-500 no-underline">
                        Add to Cart
                    </button>
                </div>
            </div>
            <br><br>
            <NuxtLink :to="`/cart?productId=${product.id}&quantity=${quantity}`"
                class="text-white bg-orange-600 border-4 border-orange-600 p-3 font-monteserrat text-[16px] items-center hover:bg-red-500 no-underline ml-[35%] rounded-full">
                View Cart
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'


const route = useRoute()
const productId = ref(route.query.id)
const product = ref({})
const quantity = ref(1)

onMounted(async () => {
    const response = await fetch(`https://fakestoreapi.com/products/${productId.value}`)
    product.value = await response.json()
})

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
            alert(`Added ${quantity.value} item(s) to Cart. Total price: $${product.value.price * quantity.value}`)
        } else {
            console.error('Failed to add item to cart:', response.statusText)
        }
    } catch (error) {
        console.error('Failed to add item to cart:', error.message)
    }
}

</script>
