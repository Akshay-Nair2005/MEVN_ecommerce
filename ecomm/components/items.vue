<template>
    <section id="products" class="max-container  bg-white text-center  dark:bg-[#19193f]">

        <div class="flex flex-col justify-start gap-5">

            
            <p class=" font-montserrat text-center text-slate-gray text-2xl">
                Experience top-notch quality and style with our sought-after selections. Discover a world of
                comfort,
                design, and value
            </p>
        </div>

        <div
            class="mt-16 grid lg:grid-cols-3  md:grid-cols-2 sm:grid-cols-2 grid-cols-1 sm:gap-6 gap-20 text-center dark:border-blue[#19193f]  dark:bg-[#19193f]">

            <div class="h-[100%] group pt-8 ml-12 w-[80%] relative  border-4 bg-white border-transperant bg-white/8 overflow-hidden rounded-lg  shadow-lg hover:scale-105  dark:bg-black dark:border-white/10"
                v-for="items in data" :key="items.id">
                <img :src="items.image" alt="imgg"
                    class="w-[80%] h-[282px] pt-12  ml-[10%]  backdrop-opacity-100 bg-transperant dark:rounded-lg ">
                <br>
                <h1
                    class=" font-semibold font-montserrat text-black text-lg leading-7 mt-3 ml-12 text-center w-[70%] dark:text-white">
                    {{ items.title }}</h1>
                <!-- <h3>Description {{ items.description }}</h3> -->
                <h3 class="mt-2  font-semibold font-montserrat text-slate-gray text-lg leading-7">{{
                    items.category }}</h3>
                <h3 class="mt-2 font-semibold  text-coral-red font-montserrat text-2.5xl leading-7">Price- ${{
                    items.price }}</h3>
                <br>
                <NuxtLink
                    class="text-white bg-orange-600 border-4 border-orange-600 p-3 rounded-lg mt-4 font-monteserrat  text-[16px] items-center hover:bg-red-500 no-underline  dark:text-white"
                    :to="`/description?id=${items.id}`">
                    View More
                </NuxtLink>

                <br><br><br>
            </div>


        </div>
    </section>

</template>

<script setup>
const { data } = useFetch('https://fakestoreapi.com/products');

</script>

<style></style>
