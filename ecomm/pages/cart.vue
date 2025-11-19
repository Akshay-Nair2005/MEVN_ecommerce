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
            @click="onClickPay(item.product.price * item.quantity, item)"
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
        @click="onClickPay(totalPrice, 'all')"
        class="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl shadow-lg text-xl font-bold"
      >
        Pay Total ₹{{ totalPrice }}
      </button>
    </div>

    <!-- ADDRESS FORM (shown before payment) -->
    <div v-if="showAddressForm" class="mt-12 border border-white/10 p-6 rounded-lg bg-white dark:bg-black max-w-2xl mx-auto shadow-xl">
      <h3 class="text-2xl font-semibold mb-4 dark:text-white">Shipping Address</h3>

      <div class="grid grid-cols-1 gap-3">
        <input v-model="address.phone" placeholder="Phone Number" class="border p-2 w-full" />
        <input v-model="address.pincode" placeholder="Pincode" class="border p-2 w-full" />
        <input v-model="address.house" placeholder="House / Flat No." class="border p-2 w-full" />
        <input v-model="address.area" placeholder="Area / Landmark" class="border p-2 w-full" />
        <input v-model="address.city" placeholder="City" class="border p-2 w-full" />
        <input v-model="address.state" placeholder="State" class="border p-2 w-full" />

        <div class="flex gap-3 mt-4">
          <button @click="showAddressForm = false" type="button" class="px-4 py-2 rounded border">Cancel</button>
          <button @click="confirmAddressAndPay" :disabled="isProcessing" class="bg-gradient-to-r from-[#FE630C] to-[#FF3200] text-white px-4 py-2 rounded">
            <span v-if="isProcessing">Processing...</span>
            <span v-else>Save & Continue to Pay</span>
          </button>
        </div>
        <p id="address-error" class="text-red-600 mt-2"></p>
      </div>
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
/* Cart + Address + Stripe (with nextTick to ensure #payment-element exists) */
import { ref, onMounted, nextTick } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import { useRuntimeConfig, useRoute } from "#app";
import { getAuth } from "firebase/auth";

const config = useRuntimeConfig();
const stripePk = config.public.NUXT_STRIPE_PUBLIC_KEY;

const route = useRoute();
const userUid = ref(route.query.userid);

const toast = useToast();
const auth = getAuth();

/* Cart state */
const cartItems = ref([]);
const totalPrice = ref(0);

/* Payment & Stripe state */
let stripe = null;
let elements = null;
let paymentElement = null;
let clientSecret = null;

const showPaymentForm = ref(false);
const isProcessing = ref(false);

/* Address states */
const showAddressForm = ref(false);
const selectedItem = ref(null); // item object or 'all'
const selectedAmount = ref(0);

const address = ref({
  phone: "",
  pincode: "",
  house: "",
  area: "",
  city: "",
  state: ""
});

/* Lifecycle */
onMounted(() => {
  fetchCartItems();
});

/* Fetch cart items and compute total */
const fetchCartItems = async () => {
  try {
    const response = await fetch(`http://localhost:2500/server/ecommerce/GetCartItems?uid=${userUid.value}`);
    const data = await response.json();
    // Filter by the UID in URL (defensive)
    cartItems.value = Array.isArray(data) ? data.filter(item => item.uid === userUid.value) : [];
    totalPrice.value = cartItems.value.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  } catch (err) {
    console.error("Error fetching cart:", err);
  }
};

/* Remove item */
const removeFromCart = async (productId) => {
  try {
    await fetch(`http://localhost:2500/server/ecommerce/DeleteCartItem?id=${productId}`, {
      method: "DELETE",
    });
    toast.info({ title: "Removed", message: "Item removed from cart", timeout: 3000 });
    await fetchCartItems();
  } catch (err) {
    console.error("Delete error:", err);
  }
};

/* Push to orders */
const pushToOrders = async (items) => {
  try {
    await fetch("http://localhost:2500/server/ecommerce/AddOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
  } catch (err) {
    console.error("AddOrder error:", err);
  }
};

/* Click Pay — first open address form */
const onClickPay = (amount, item) => {
  selectedItem.value = item;
  selectedAmount.value = amount;
  showAddressForm.value = true;
  showPaymentForm.value = false;
};

/* Validate address fields (simple) */
const validateAddress = () => {
  if (!address.value.phone || !address.value.pincode || !address.value.house || !address.value.city || !address.value.state) {
    return "Please complete the shipping address fields.";
  }
  return null;
};

/* Save address to backend (StoreUser endpoint) */
const saveAddress = async () => {
  const user = auth.currentUser;
  if (!user) {
    toast.warning({ title: "Login", message: "Please login first", timeout: 3000 });
    throw new Error("not-logged-in");
  }

  const body = {
    uid: user.uid,
    email: user.email,
    name: user.displayName || "",
    phone: address.value.phone,
    pincode: address.value.pincode,
    house: address.value.house,
    area: address.value.area,
    city: address.value.city,
    state: address.value.state
  };

  try {
    await $fetch("http://localhost:2500/server/ecommerce/StoreUser", {
      method: "POST",
      body
    });
    toast.success({ title: "Success", message: "Address saved successfully!", timeout: 3000 });
    return true;
  } catch (err) {
    console.error("Save error:", err);
    toast.error({ title: "Error", message: "Error saving address", timeout: 3000 });
    return false;
  }
};

/* Called when user confirms address and wants to pay */
const confirmAddressAndPay = async () => {
  const err = validateAddress();
  document.querySelector("#address-error").textContent = err || "";
  if (err) return;

  isProcessing.value = true;
  try {
    // Save address first
    const saved = await saveAddress();
    if (!saved) {
      isProcessing.value = false;
      return;
    }

    // Close address form and proceed to payment
    showAddressForm.value = false;
    await proceedToPayment(selectedAmount.value, selectedItem.value);
  } catch (e) {
    console.error(e);
    isProcessing.value = false;
    showAddressForm.value = false;
  }
};

/* Prepare stripe and mount payment element — ensures DOM exists before mount */
const proceedToPayment = async (amount, item) => {
  selectedItem.value = item;

  try {
    isProcessing.value = true;

    if (!stripePk) {
      toast.error({ title: "Error", message: "Stripe key missing", timeout: 3000 });
      isProcessing.value = false;
      return;
    }

    // Show payment form container and wait for DOM render
    showPaymentForm.value = true;
    await nextTick();

    // Initialize stripe if not already
    stripe = stripe || (await loadStripe(stripePk));
    if (!stripe) {
      alert("Stripe init failed");
      isProcessing.value = false;
      return;
    }

    // Create Payment Intent on your server (amount in smallest currency unit)
    const res = await fetch("http://localhost:2500/api/stripe/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(amount * 100) }),
    });
    const result = await res.json();
    if (!result.client_secret) {
      alert("Payment failed");
      isProcessing.value = false;
      return;
    }

    clientSecret = result.client_secret;

    // If an existing paymentElement was mounted earlier, unmount it to avoid duplicates
    try {
      if (paymentElement && typeof paymentElement.unmount === "function") {
        paymentElement.unmount();
      }
    } catch (e) {
      console.warn("Error unmounting previous payment element", e);
    }

    // Create elements and mount (DOM is available due to nextTick)
    elements = stripe.elements({ clientSecret });
    paymentElement = elements.create("payment");

    // small defensive check: ensure container exists
    const el = document.querySelector("#payment-element");
    if (!el) {
      console.error("No #payment-element found after nextTick()");
      isProcessing.value = false;
      return;
    }
    // clear container just in case
    el.innerHTML = "";

    paymentElement.mount("#payment-element");

    isProcessing.value = false;
  } catch (err) {
    console.error("proceedToPayment error:", err);
    isProcessing.value = false;
  }
};

/* Submit payment */
const pay = async () => {
  isProcessing.value = true;
  try {
    if (!stripe || !elements) {
      document.querySelector("#payment-error").textContent = "Payment initialization error.";
      isProcessing.value = false;
      return;
    }

    const { error } = await stripe.confirmPayment({ elements, redirect: "if_required" });

    if (error) {
      document.querySelector("#payment-error").textContent = error.message;
      isProcessing.value = false;
      return;
    }

    // PAYMENT SUCCESS ✓
    toast.success({ title: "Success", message: "Payment Successful!", timeout: 3000 });

    // Push items to My Orders then remove from cart
    if (selectedItem.value === "all") {
      await pushToOrders(cartItems.value);
      for (const c of [...cartItems.value]) {
        await removeFromCart(c._id);
      }
    } else {
      await pushToOrders([selectedItem.value]);
      await removeFromCart(selectedItem.value._id);
    }

    // Cleanup
    showPaymentForm.value = false;
    isProcessing.value = false;
    await fetchCartItems();
  } catch (err) {
    console.error("pay error:", err);
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
