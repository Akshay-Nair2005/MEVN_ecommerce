<template>
  <themeb />
  <div class="container mx-auto dark:bg-[#19193f] min-h-screen">
    <h2 class="text-4xl font-bold mb-4 ml-12 dark:text-white">
      <span class="text-coral-red">Shopping</span> Cart
    </h2>

    <!-- Empty cart -->
    <div
      v-if="cartItems.length === 0"
      class="flex ml-8 border-4 border-transparent shadow-lg mt-8 rounded-lg w-[80%] text-3xl py-8 justify-center dark:text-white"
    >
      Your cart is empty.
    </div>

    <!-- Cart Items -->
    <div v-else>
      <div
        v-for="(item, index) in cartItems"
        :key="item._id"
        class="flex flex-wrap gap-12 ml-8 items-center justify-between border-4 border-gray-300 py-4 dark:bg-black dark:border-white/10 shadow-lg mt-8 rounded-lg w-[90%]"
      >
        <img
          :src="item.product.image"
          class="w-[200px] h-[180px] ml-8 border-4 border-white/10 dark:border-white/10 rounded-lg"
        />
        <div class="text-center ml-24">
          <h3 class="text-2xl font-semibold text-coral-red">
            {{ item.product.title }}
          </h3>
          <p class="dark:text-white">Category: {{ item.product.category }}</p>
          <p class="dark:text-white">Quantity: {{ item.quantity }}</p>
        </div>
        <div class="mt-4">
          <h3 class="text-xl font-semibold">
            Total: ₹{{ item.product.price * item.quantity }}
          </h3>
        </div>
        <button
          @click="removeFromCart(item._id)"
          class="bg-red-500 p-3 rounded-lg text-white font-semibold"
        >
          Remove
        </button>
        <button
          @click="startPayment(item.product.price * item.quantity)"
          class="bg-blue-500 p-3 rounded-lg text-white font-semibold"
        >
          Pay ₹{{ item.product.price * item.quantity }}
        </button>
      </div>
    </div>

    <!-- Pay Total -->
    <div v-if="cartItems.length" class="flex justify-end mt-8">
      <button
        @click="startPayment(totalPrice)"
        class="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg"
      >
        Pay Total ₹{{ totalPrice }}
      </button>
    </div>

    <!-- Stripe Payment Element -->
    <div v-if="showPaymentForm" class="mt-12 border p-6 rounded-lg bg-white dark:bg-black max-w-lg mx-auto">
      <form @submit.prevent="pay">
        <div id="payment-element" class="border p-4 rounded-md mb-3"></div>
        <p id="payment-error" class="text-red-600 text-center"></p>
        <button
          type="submit"
          :disabled="isProcessing"
          class="bg-gradient-to-r from-[#FE630C] to-[#FF3200] w-full text-white font-semibold py-2 rounded-full mt-3"
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

let stripe;
let elements;
let paymentElement;
let clientSecret = null;

onMounted(() => {
  fetchCartItems();
});

const fetchCartItems = async () => {
  try {
    const response = await fetch("http://localhost:2500/server/ecommerce/GetCartItems");
    const data = await response.json();
    cartItems.value = data;
    totalPrice.value = data.reduce(
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

// --------------------- START PAYMENT ---------------------
const startPayment = async (amount) => {
  try {
    showPaymentForm.value = true;
    isProcessing.value = true;

    // ✅ 1. Validate public key
    if (!stripePk) {
      console.error("❌ Missing Stripe public key");
      alert("Stripe public key not configured.");
      isProcessing.value = false;
      return;
    }

    // ✅ 2. Initialize Stripe
    stripe = await loadStripe(stripePk);
    if (!stripe) {
      console.error("❌ Stripe failed to initialize");
      alert("Stripe initialization failed");
      isProcessing.value = false;
      return;
    }

    // ✅ 3. Create payment intent
    console.log("Creating payment intent for:", amount);
    const res = await fetch("http://localhost:2500/api/stripe/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Stripe expects smallest currency unit → multiply INR by 100 (paise)
      body: JSON.stringify({ amount: Math.round(amount * 100) }),
    });

    const result = await res.json();
    console.log("Stripe response:", result);

    // ✅ 4. Validate client_secret
    if (!result.client_secret) {
      console.error("❌ No client_secret returned from backend");
      alert("Payment could not be started. Check server logs.");
      isProcessing.value = false;
      return;
    }

    clientSecret = result.client_secret;

    // ✅ 5. Create Stripe Elements instance
    elements = stripe.elements({ clientSecret });
    paymentElement = elements.create("payment");

    // ✅ 6. Mount payment UI
    paymentElement.mount("#payment-element");
    console.log("✅ Payment element mounted");

    isProcessing.value = false;
  } catch (err) {
    console.error("🔥 Error starting payment:", err);
    alert("Something went wrong while starting payment.");
    isProcessing.value = false;
  }
};

// --------------------- CONFIRM PAYMENT ---------------------
const pay = async () => {
  isProcessing.value = true;
  try {
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: "John Doe",
            email: "john@example.com",
          },
        },
      },
      redirect: "if_required",
    });

    if (error) {
      console.error("Payment error:", error);
      document.querySelector("#payment-error").textContent = error.message;
      isProcessing.value = false;
    } else {
      alert("✅ Payment Successful!");
      showPaymentForm.value = false;
      isProcessing.value = false;
    }
  } catch (err) {
    console.error("🔥 Payment failed:", err);
    document.querySelector("#payment-error").textContent =
      "An unexpected error occurred. Please try again.";
    isProcessing.value = false;
  }
};
</script>


<style scoped>
#payment-element {
  background: #fafafa;
}
</style>
