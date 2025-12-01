<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const API_BASE = "http://localhost:2500";

// Firebase
const auth = getAuth();
const userUid = ref("");
const isAuthed = ref(false);

// Orders
const orders = ref([]);
const loading = ref(false);
const error = ref("");
const expanded = ref({});

let unsubscribeAuth = null;

// Fetch orders
const fetchOrders = async () => {
  if (!userUid.value) {
    error.value = "No user logged in. Please sign in.";
    orders.value = [];
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const res = await fetch(
      `${API_BASE}/server/ecommerce/GetOrders?uid=${encodeURIComponent(
        userUid.value
      )}`
    );

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json();
    orders.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("fetchOrders error:", err);
    error.value = err.message || "Error fetching orders.";
  } finally {
    loading.value = false;
  }
};

// Toggle expand panel
const toggle = (id) => {
  expanded.value[id] = !expanded.value[id];
};

// Format date
const formatDate = (iso) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleString();
};

// Calculate total
const getOrderTotal = (order) => {
  if (typeof order.totalAmount === "number") return order.totalAmount;

  return (order.items || []).reduce((acc, it) => {
    return acc + (it?.product?.price || 0) * (it.quantity || 1);
  }, 0);
};

// Watch auth state
onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    if (user) {
      isAuthed.value = true;
      userUid.value = user.uid;
      await fetchOrders();
    } else {
      isAuthed.value = false;
      userUid.value = "";
      orders.value = [];
    }
  });
});

// Cleanup
onUnmounted(() => {
  if (unsubscribeAuth) unsubscribeAuth();
});

// If user manually edits UID & is not authed → fetch orders
watch(userUid, (uid) => {
  if (!isAuthed.value && uid) {
    fetchOrders();
  }
});
</script>

<template>
  <themeb />
  <Navbar />

  <div class="container mx-auto py-10 min-h-screen dark:bg-[#151528]">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-3xl font-bold mb-6 dark:text-white">My Orders</h1>

      <!-- UID Input -->
      <div class="flex items-center gap-3 mb-6">
        <input
          v-model="userUid"
          :readonly="isAuthed"
          :placeholder="isAuthed ? 'Signed in — UID locked' : 'User UID (or sign in)'"
          class="border p-2 rounded w-full max-w-md"
        />
        <button @click="fetchOrders" class="px-4 py-2 bg-blue-600 text-white rounded">
          Fetch
        </button>
        <button @click="() => { orders = []; fetchOrders(); }"
                class="px-4 py-2 border rounded">
          Refresh
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="p-6 rounded bg-white/5 text-center dark:text-white">
        Loading orders…
      </div>

      <!-- Error -->
      <div v-if="error" class="p-4 rounded bg-red-600/10 text-red-600 mb-4">
        {{ error }}
      </div>

      <!-- No Orders -->
      <div v-if="!loading && orders.length === 0" class="p-6 rounded bg-white/5 text-center dark:text-white">
        No orders found.
      </div>

      <!-- ORDER CARD -->
      <div
        v-for="order in orders"
        :key="order._id"
        class="mb-6 p-5 rounded-lg bg-white dark:bg-[#0d0d20] border border-white/10 shadow"
      >
        <div class="flex justify-between items-start gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h2 class="text-xl font-semibold text-coral-red">
                Order #{{ order._id }}
              </h2>
              <span class="text-sm text-gray-400">
                • {{ formatDate(order.createdAt) }}
              </span>
            </div>

            <p class="text-sm dark:text-gray-300 mb-1">
              Items: {{ (order.items || []).length }}
            </p>
            <p class="text-sm dark:text-gray-300 mb-1">
              Total: ₹{{ getOrderTotal(order) }}
            </p>
            <p class="text-sm dark:text-gray-300">
              Payment:
              <span
                :class="order.payment?.status === 'succeeded'
                  ? 'text-green-400'
                  : 'text-yellow-300'"
              >
                {{ order.payment?.status || "pending" }}
              </span>
            </p>
          </div>

          <button
            @click="toggle(order._id)"
            class="px-3 py-1 rounded border text-sm"
          >
            {{ expanded[order._id] ? "Hide Details" : "View Details" }}
          </button>
        </div>

        <!-- Expandable Area -->
        <div
          v-if="expanded[order._id]"
          class="mt-4 border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <!-- ITEMS -->
          <div>
            <h3 class="font-medium mb-3 dark:text-white">Items</h3>
            <ul class="space-y-3">
              <li
                v-for="itm in order.items"
                :key="itm._id"
                class="flex gap-3 items-start"
              >
                <img
                  v-if="itm.product?.image"
                  :src="itm.product.image"
                  class="w-20 h-20 rounded object-cover border"
                />
                <div>
                  <div class="font-semibold text-lg dark:text-white">
                    {{ itm.product?.title || "Untitled Product" }}
                  </div>
                  <div class="text-sm dark:text-gray-300">
                    Qty: {{ itm.quantity }}
                  </div>
                  <div class="text-sm dark:text-gray-300">
                    Price: ₹{{ itm.product?.price || 0 }}
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- SHIPPING -->
          <div>
            <h3 class="font-medium mb-3 dark:text-white">Shipping Address</h3>
            <div class="text-sm dark:text-gray-300">
              <p><strong>Phone:</strong> {{ order.address?.phone || "-" }}</p>
              <p><strong>Pincode:</strong> {{ order.address?.pincode || "-" }}</p>
              <p><strong>House:</strong> {{ order.address?.house || "-" }}</p>
              <p><strong>Area:</strong> {{ order.address?.area || "-" }}</p>
              <p><strong>City:</strong> {{ order.address?.city || "-" }}</p>
              <p><strong>State:</strong> {{ order.address?.state || "-" }}</p>
            </div>

            <h4 class="font-medium mt-4 mb-2 dark:text-white">Payment Info</h4>
            <p class="text-sm dark:text-gray-300">
              <strong>Provider:</strong> {{ order.payment?.provider || "stripe" }}
            </p>
            <p class="text-sm dark:text-gray-300">
              <strong>Intent:</strong> {{ order.payment?.paymentIntentId || "-" }}
            </p>
            <p class="text-sm dark:text-gray-300">
              <strong>Status:</strong> {{ order.payment?.status || "-" }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-coral-red {
  color: #ff4b3a;
}
</style>
