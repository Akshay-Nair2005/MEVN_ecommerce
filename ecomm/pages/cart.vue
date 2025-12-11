<template>
  <themeb />
  <Navbar />
  <div class="min-h-screen bg-gradient-to-br  dark:from-[#151528] dark:to-[#1a1a2e] py-8">
    <div class="mx-auto px-4">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold mb-4 dark:text-white">
          Your <span class="text-transparent text-3xl bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Shopping</span> Cart
        </h1>
        <p class="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Review your items and proceed to checkout. Your perfect products are just a click away!
        </p>
      </div>

      <!-- Empty Cart -->
      <div
        v-if="cartItems.length === 0"
        class="flex flex-col items-center justify-center text-center py-16 px-6 max-w-2xl mx-auto"
      >
        <div class="w-48 h-48 mb-6 relative">
          <div class="absolute inset-0 bg-gradient-to-r from-amber-200 to-orange-200 rounded-full opacity-20 animate-pulse"></div>
          <svg class="w-full h-full text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-semibold mb-4 dark:text-white">Your cart is empty</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Start shopping to add amazing products to your cart!</p>
        <NuxtLink 
          to="/" 
          class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition duration-200 transform hover:-translate-y-1"
        >
          Start Shopping
        </NuxtLink>
      </div>

      <!-- Cart Items -->
      <div v-else class="max-w-6xl mx-auto">
        <div class="grid gap-6">
          <div
            v-for="item in cartItems"
            :key="item._id"
            class="group flex flex-col md:flex-row items-center gap-6 p-6 bg-white dark:bg-[#0d0d20] rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <!-- Product Image -->
            <div class="relative">
              <img
                :src="item.product.image"
                class="w-32 h-32 md:w-40 md:h-36 rounded-xl object-cover shadow-lg border-2 border-amber-100 dark:border-amber-900 group-hover:scale-105 transition duration-300"
              />
              <div class="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                {{ item.quantity }}
              </div>
            </div>

            <!-- Product Details -->
            <div class="flex-1 text-center md:text-left">
              <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">{{ item.product.title }}</h3>
              <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3 justify-center md:justify-start">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  {{ item.product.category }}
                </span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                  Qty: {{ item.quantity }}
                </span>
              </div>
              <p class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                ₹{{ item.product.price * item.quantity }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">₹{{ item.product.price }} per item</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-3 w-full md:w-auto">
              <button
                @click="removeFromCart(item._id)"
                class="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition duration-200 transform hover:-translate-y-0.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Remove
              </button>

              <button
                @click="onClickPay(item.product.price * item.quantity, item)"
                class="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition duration-200 transform hover:-translate-y-0.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                Pay ₹{{ item.product.price * item.quantity }}
              </button>
            </div>
          </div>
        </div>

        <!-- Total Payment Section -->
        <div class="mt-12 p-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-2xl text-white">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="text-center md:text-left">
              <h3 class="text-2xl font-bold mb-2">Ready to Checkout?</h3>
              <p class="text-amber-100 opacity-90">Complete your purchase and get your items delivered!</p>
              <div class="mt-4 text-3xl font-bold">
                Total: ₹{{ totalPrice }}
              </div>
            </div>
            <button
              @click="onClickPay(totalPrice, 'all')"
              class="bg-white text-amber-600 hover:bg-amber-50 px-10 py-4 rounded-xl shadow-lg text-xl font-bold transition duration-200 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-3"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Pay Total ₹{{ totalPrice }}
            </button>
          </div>
        </div>
      </div>

      <!-- ADDRESS FORM -->
      <div v-if="showAddressForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-[#0d0d20] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-bold dark:text-white">Shipping Address</h3>
              <button @click="showAddressForm = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Enter your delivery details to continue</p>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <input v-model="address.phone" placeholder="Enter your phone number" 
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-[#151528] dark:text-white transition duration-200" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pincode</label>
                <input v-model="address.pincode" placeholder="Enter pincode" 
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-[#151528] dark:text-white transition duration-200" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">House/Flat No.</label>
                <input v-model="address.house" placeholder="House/Flat number" 
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-[#151528] dark:text-white transition duration-200" />
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Area/Landmark</label>
                <input v-model="address.area" placeholder="Area, street, landmark" 
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-[#151528] dark:text-white transition duration-200" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                <input v-model="address.city" placeholder="Enter city" 
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-[#151528] dark:text-white transition duration-200" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State</label>
                <input v-model="address.state" placeholder="Enter state" 
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-[#151528] dark:text-white transition duration-200" />
              </div>
            </div>

            <p id="address-error" class="text-red-500 text-sm mt-4 text-center"></p>

            <div class="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button @click="showAddressForm = false" type="button" 
                class="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200">
                Cancel
              </button>
              <button @click="confirmAddressAndPay" :disabled="isProcessing" 
                class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none">
                <span v-if="isProcessing" class="flex items-center justify-center gap-2">
                  <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828m0-11.314l2.828 2.828m9.172 9.172l2.828 2.828"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Save & Continue to Pay
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Section -->
      <div v-if="showPaymentForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
        <div class="bg-white dark:bg-[#0d0d20] rounded-2xl shadow-2xl max-w-lg w-full my-8">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-[#0d0d20] z-10">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-2xl font-bold dark:text-white">Secure Payment</h3>
                <p class="text-gray-600 dark:text-gray-400 mt-2">Complete your payment securely</p>
              </div>
              <button 
                @click="showPaymentForm = false" 
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6">
            <div class="mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p class="text-sm font-medium text-amber-800 dark:text-amber-200">Payment Amount</p>
                  <p class="text-lg font-bold text-amber-600 dark:text-amber-400">₹{{ selectedAmount }}</p>
                </div>
              </div>
            </div>

            <form @submit.prevent="pay">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Details
                </label>
                <div id="payment-element" class="border-2 border-gray-200 dark:border-gray-600 p-4 rounded-xl bg-gray-50 dark:bg-[#151528] min-h-[120px] max-h-[200px] overflow-y-auto"></div>
              </div>
              
              <p id="payment-error" class="text-red-500 text-center text-sm mb-4 min-h-[20px]"></p>
              
              <button
                type="submit"
                :disabled="isProcessing"
                class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 rounded-xl text-lg shadow-lg transition duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-3"
              >
                <span v-if="isProcessing" class="flex items-center gap-2">
                  <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828m0-11.314l2.828 2.828m9.172 9.172l2.828 2.828"></path>
                  </svg>
                  Processing Payment...
                </span>
                <span v-else class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  Pay ₹{{ selectedAmount }}
                </span>
              </button>
            </form>

            <!-- Security Badges -->
            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <span>Secure</span>
                </div>
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  <span>Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    const payload = {
      uid: userUid.value,
      orders: items.map((item) => ({
        productId: item.product._id || item.productId, // adjust if your field is different
        quantity: item.quantity,
      })),
    };

    await fetch("http://localhost:2500/server/ecommerce/AddOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #fed7aa;
}

::-webkit-scrollbar-thumb {
  background: #f59e0b;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #d97706;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, transform, box-shadow;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}


/* Custom scrollbar for payment element */
#payment-element::-webkit-scrollbar {
  width: 4px;
}

#payment-element::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

#payment-element::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

#payment-element::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dark #payment-element::-webkit-scrollbar-track {
  background: #2d2d2d;
}

.dark #payment-element::-webkit-scrollbar-thumb {
  background: #555;
}

.dark #payment-element::-webkit-scrollbar-thumb:hover {
  background: #777;
}

/* Smooth modal animations */
.fixed {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}


</style>