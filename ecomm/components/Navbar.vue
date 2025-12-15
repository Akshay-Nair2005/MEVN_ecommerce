<template>
  <header
    class="border border-black sticky top-0 z-40 px-8 py-4 dark:bg-[#19193f]/80 backdrop-blur-md border-b dark:border-gray-700 shadow-sm">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
      <!-- Brand -->
      <NuxtLink to="/" class="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
        <svg class="w-7 h-7 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h18v4H3zM3 8h18v13H3z" />
        </svg>
        ShopMate
      </NuxtLink>

      <!-- Burger (Mobile) -->
      <button class="md:hidden text-gray-800 dark:text-gray-100 focus:outline-none" @click="mobileOpen = !mobileOpen"
        aria-label="Toggle menu">
        <svg v-if="!mobileOpen" class="w-6 h-6" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="w-6 h-6" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" d="M6 6l12 12M6 18L18 6" />
        </svg>
      </button>

      <!-- Navigation -->
      <nav :class="[
        'flex flex-col md:flex-row md:items-center md:gap-6 md:static absolute top-full left-0 w-full md:w-auto bg-white dark:bg-[#19193f] md:bg-transparent md:dark:bg-transparent border-t md:border-0 border-gray-200 dark:border-gray-700 md:opacity-100 transition-all duration-300',
        mobileOpen ? 'opacity-100 visible p-4' : 'opacity-0 invisible md:opacity-100 md:visible'
      ]">

        <!-- Navigation Links -->
        <div class="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
          <NuxtLink 
            v-if="currentUser" 
            :to="`/myorder?userid=${currentUser.uid}`" 
            class="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200"
          >
            📦 My Orders
          </NuxtLink>
        </div>

        <!-- Right Icons + Theme -->
        <div class="flex items-center space-x-6 md:ml-4 mt-4 md:mt-0">
          <button class="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a5a] transition"
            aria-label="Cart">
            <NuxtLink :to="currentUser ? `/cart?userid=${currentUser.uid}` : '/login'">
              🛒
            </NuxtLink>

            <!-- Cart Count Badge -->
            <span v-if="cartCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
              {{ cartCount }}
            </span>
          </button>


          <!-- Auth Buttons -->
          <div v-if="user" class="flex items-center gap-4">
             <img :src="user.photoURL" alt="Profile" class="w-8 h-8 rounded-full border border-indigo-500" />
            <button class="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
              @click="handleSignout">Logout</button>
          </div>

          <div v-else>
            <button class="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
              @click="signInWithGoogle">Login</button>
          </div>

          <button 
            @click="toggleTheme"
            class="p-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            :title="colorMode.preference === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <svg v-if="colorMode.preference === 'dark'" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
            </svg>
            <svg v-else class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg>
          </button>

        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue"
import { useRouter } from "vue-router"
import { useFirebaseAuth, useCurrentUser } from "vuefire"
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { getAuth, onAuthStateChanged } from "firebase/auth";

const currentUser = ref(null);
const mobileOpen = ref(false)
const searchQuery = ref("")
const colorMode = useColorMode()
const auth = useFirebaseAuth()
const user = useCurrentUser()
const router = useRouter()
const toast = useToast();

// --- CART state ---
const cartItems = ref([]);
const cartCount = computed(() => cartItems.value.length);

// derived uid (safe)
const userUid = computed(() => currentUser.value?.uid || null);

// fetch cart using correct uid and robust handling
const fetchCartItems = async () => {
  try {
    if (!userUid.value) {
      cartItems.value = [];
      return;
    }

    const resp = await fetch(`http://localhost:2500/server/ecommerce/GetCartItems?uid=${encodeURIComponent(userUid.value)}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    console.log("raw cart response:", data);

    if (Array.isArray(data)) {
      // If backend returns only items for the uid, use as-is.
      // If backend returns all items, filter by uid.
      if (data.length && data.every(i => typeof i.uid !== "undefined")) {
        // If server already filtered by uid (likely), this will just set the array.
        cartItems.value = data.filter(item => item.uid === userUid.value);
      } else {
        // Server returned something else - try to set directly
        cartItems.value = data;
      }
    } else if (data && typeof data === "object") {
      // If server returns an object with items property
      cartItems.value = Array.isArray(data.items) ? data.items.filter(i => i.uid === userUid.value) : [];
    } else {
      cartItems.value = [];
    }

    console.log("cartItems:", cartItems.value);
  } catch (err) {
    console.error("Error fetching cart:", err);
    cartItems.value = [];
  }
};

// Fetch when UID becomes available (and also on mount if already available)
watch(userUid, (val) => {
  if (val) fetchCartItems();
}, { immediate: true });

// Optionally keep a safety onMounted call (will do nothing if uid not present)
onMounted(() => {
  if (userUid.value) fetchCartItems();
});

// --- Auth handling (keeps currentUser in sync) ---
const authh = getAuth();
onAuthStateChanged(authh, (user) => {
  currentUser.value = user;
  if (user) {
    console.log("UID:", user.uid);
  } else {
    console.log("No user logged in");
    cartItems.value = []; // clear cart when logged out
  }
});

// --- Theme toggle ---
function toggleTheme() {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}

// --- Auth helpers (unchanged) ---
async function signInWithGoogle() {
  try {
    // await signInWithPopup(auth, new GoogleAuthProvider())
    router.replace("/login")
  } catch (err) {
    console.error("Error signing in:", err)
  }
}

async function handleSignout() {
  try {
    await signOut(auth)
    toast.info({
      title:"SignOut",
      message:"Signing Out",
      timeout:3000
    })
  } catch (err) {
    console.error("Error signing out:", err)
  }
}
</script>

