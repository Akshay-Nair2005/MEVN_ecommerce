<template>
  <themeb />
  <Navbar />
  <div class="container mx-auto min-h-screen dark:bg-[#151528] py-10">
    <h2 class="text-4xl font-bold mb-10 ml-4 dark:text-white">
      <span class="text-coral-red">Shopping</span> Cart
    </h2>

    <!-- Empty Cart -->
    <div
      v-if="cartItems.length === 0"
      class="flex justify-center text-gray-700 dark:text-white text-2xl border border-white/10 rounded-xl p-10 shadow-xl mx-6 bg-white/5 backdrop-blur-md"
    >
      Your cart is empty.
    </div>

    <!-- Cart Items -->
    <div v-else class="grid gap-6 mx-4">
      <div
        v-for="item in cartItems"
        :key="item._id"
        class="flex flex-col md:flex-row items-center gap-6 p-6 bg-white dark:bg-[#0d0d20] rounded-xl shadow-lg border border-white/10"
      >
        <img
          :src="item.product.image"
          class="w-[180px] h-[160px] rounded-xl object-cover shadow-md border border-white/20"
        />

        <div class="flex-1 text-center md:text-left">
          <h3 class="text-2xl font-semibold text-coral-red">{{ item.product.title }}</h3>
          <p class="dark:text-gray-300 mt-1">Category: {{ item.product.category }}</p>
          <p class="dark:text-gray-300">Quantity: {{ item.quantity }}</p>
          <p class="font-semibold mt-2 text-xl dark:text-white">₹{{ item.product.price * item.quantity }}</p>
        </div>

        <div class="flex flex-col gap-3 w-full md:w-auto">
          <button
            @click="removeFromCart(item._id)"
            class="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg text-white font-semibold shadow"
          >
            Remove
          </button>

          <button
            @click="startPayment(item.product.price * item.quantity, item)"
            class="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg text-white font-semibold shadow"
          >
            Pay ₹{{ item.product.price * item.quantity }}
          </button>
        </div>
      </div>
    </div>

    <!-- Total Payment -->
    <div v-if="cartItems.length" class="flex justify-end mt-10 mx-4">
      <button
        @click="startPayment(totalPrice, 'all')"
        class="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl shadow-lg text-xl font-bold"
      >
        Pay Total ₹{{ totalPrice }}
      </button>
    </div>

    <!-- Payment Section -->
    <div v-if="showPaymentForm" class="mt-12 border border-white/10 p-6 rounded-lg bg-white dark:bg-black max-w-lg mx-auto shadow-xl">
      <form @submit.prevent="pay">
        <div id="payment-element" class="border p-4 rounded-md mb-3 bg-gray-50 dark:bg-[#111] text-black"></div>
        <p id="payment-error" class="text-red-600 text-center"></p>
        <button
          type="submit"
          :disabled="isProcessing"
          class="bg-gradient-to-r from-[#FE630C] to-[#FF3200] w-full text-white font-semibold py-3 rounded-full mt-3 text-lg shadow-lg"
        >
          <span v-if="isProcessing">Processing...</span>
          <span v-else>Confirm Payment</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import { useRuntimeConfig } from "#app";

const config = useRuntimeConfig();
const stripePk = config.public.NUXT_STRIPE_PUBLIC_KEY;

const cartItems = ref([]);
const totalPrice = ref(0);
const showPaymentForm = ref(false);
const isProcessing = ref(false);
let selectedItem = null; // store item for single-item purchase

const route = useRoute();
const userUid = ref(route.query.userid);

let stripe;
let elements;
let paymentElement;
let clientSecret = null;

onMounted(() => {
  fetchCartItems();
});

const fetchCartItems = async () => {
  try {
   const response = await fetch(`http://localhost:2500/server/ecommerce/GetCartItems?uid=${userUid.value}`);
    const data = await response.json();
    console.log(data)

    // Filter by the UID in URL
    console.log(userUid.value)
    cartItems.value = data.filter(item => item.uid === userUid.value);
    

    totalPrice.value = cartItems.value.reduce(
      (acc, curr) => acc + curr.product.price * curr.quantity,
      0
    );
  } catch (err) {
    console.error("Error fetching cart:", err);
  }
};

const removeFromCart = async (productId) => {
  await fetch(`http://localhost:2500/server/ecommerce/DeleteCartItem?id=${productId}`, {
    method: "DELETE",
  });
  fetchCartItems();
};

// Store to My Orders
const pushToOrders = async (items) => {
  await fetch("http://localhost:2500/server/ecommerce/AddOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
};

// --------------------- START PAYMENT ---------------------
const startPayment = async (amount, item) => {
  selectedItem = item;
  try {
    showPaymentForm.value = true;
    isProcessing.value = true;

    if (!stripePk) return alert("Stripe key missing");

    stripe = await loadStripe(stripePk);
    if (!stripe) return alert("Stripe init failed");

    const res = await fetch("http://localhost:2500/api/stripe/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(amount * 100) }),
    });

    const result = await res.json();
    if (!result.client_secret) return alert("Payment failed");

    clientSecret = result.client_secret;
    elements = stripe.elements({ clientSecret });
    paymentElement = elements.create("payment");
    paymentElement.mount("#payment-element");
    isProcessing.value = false;
  } catch (err) {
    console.error(err);
    isProcessing.value = false;
  }
};

// --------------------- CONFIRM PAYMENT ---------------------
const pay = async () => {
  isProcessing.value = true;
  try {
    const { error } = await stripe.confirmPayment({ elements, redirect: "if_required" });

    if (error) {
      document.querySelector("#payment-error").textContent = error.message;
      isProcessing.value = false;
      return;
    }

    // PAYMENT SUCCESS ✓
    alert("Payment Successful!");

    // Push items to My Orders
    if (selectedItem === "all") {
      await pushToOrders(cartItems.value);
      for (const c of cartItems.value) {
        await removeFromCart(c._id);
      }
    } else {
      await pushToOrders([selectedItem]);
      await removeFromCart(selectedItem._id);
    }

    showPaymentForm.value = false;
    isProcessing.value = false;
    fetchCartItems();
  } catch (err) {
    document.querySelector("#payment-error").textContent = "Unexpected error";
    isProcessing.value = false;
  }
};
</script>

<style scoped>
#payment-element {
  background: #f5f5f5;
}
</style>
