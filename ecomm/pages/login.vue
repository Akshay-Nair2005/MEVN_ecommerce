<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-w-md w-full border border-gray-200 dark:border-gray-700">
      <!-- Header with decorative element -->
      <div class="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-700 p-6 text-center relative">
        <div class="absolute top-0 left-0 w-full h-1 bg-amber-300 dark:bg-amber-400"></div>
        <div class="w-20 h-20 mx-auto mb-4 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg">
          <svg class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white">Welcome Back</h1>
        <p class="text-amber-100 mt-2">Sign in to continue your journey</p>
      </div>

      <div class="p-8">
        <!-- Manual Login Form -->
        <form @submit.prevent="loginManual" class="space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 flex items-center">
              <svg class="w-4 h-4 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
              </svg>
              Email Address
            </label>
            <input 
              v-model="email" 
              type="email" 
              placeholder="Enter your email"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200"
            />
            <p class="text-red-500 text-sm mt-1 flex items-center" v-if="errors.email">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              {{ errors.email }}
            </p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 flex items-center">
              <svg class="w-4 h-4 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Password
            </label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="Enter your password"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200"
            />
            <p class="text-red-500 text-sm mt-1 flex items-center" v-if="errors.password">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              {{ errors.password }}
            </p>
          </div>

          <button 
            type="submit"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition duration-200 transform hover:-translate-y-0.5"
          >
            Sign In
          </button>
        </form>

        <!-- Divider -->
        <div class="my-8 flex items-center">
          <div class="flex-1 border-t border-gray-300"></div>
          <span class="px-4 text-gray-500 text-sm font-medium">OR</span>
          <div class="flex-1 border-t border-gray-300"></div>
        </div>

        <!-- Google Login -->
        <div>
          <button 
            @click="signInWithGoogle"
            class="w-full border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg font-medium shadow-sm hover:shadow-md transition duration-200 flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <!-- Additional Links -->
        <div class="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
          <p>Don't have an account? 
            <NuxtLink to="/signup" class="text-amber-600 hover:text-amber-700 font-medium transition duration-200">Sign up here</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, updateEmail } from 'firebase/auth'

// use a single auth instance (either getAuth() or your useFirebaseAuth() wrapper)
const auth = getAuth() // or: const auth = useFirebaseAuth()
const router = useRouter()

const currentUser = ref(null)
const uid = computed(() => currentUser.value?.uid ?? null)

// Keep onAuthStateChanged as the source of truth and do redirect there
onAuthStateChanged(auth, (user) => {
  currentUser.value = user
  if (user) {
    // user is signed in -> redirect to home
    router.replace('/')
  } else {
    // not signed in — keep on the page (or redirect to login if needed)
    // router.replace('/login')
  }
})

// Check if user is admin from MongoDB
async function checkAdminAndRedirect(uid) {
  try {
    const response = await $fetch(`http://localhost:2500/server/ecommerce/GetUser/${uid}`)
    
    if (response && response.isAdmin === true) {
      router.replace('/admin')
      return
    }
    
    router.replace('/')
  } catch (error) {
    console.error('Error checking admin status:', error)
    // If user not found in MongoDB, redirect to home
    router.replace('/')
  }
}

// --- Auth functions (unchanged, but using `auth` above) ---
async function signInWithGoogle() {
  const result = await signInWithPopup(auth, new GoogleAuthProvider())
  const user = result.user
  await saveUserInDB(user.uid, user.email, user.displayName)
  // backend store (duplicate but kept from your code)
  await $fetch("http://localhost:2500/server/ecommerce/StoreUser", {
    method: "POST",
    body: { uid: user.uid, email: user.email, name: user.displayName }
  })
  await checkAdminAndRedirect(user.uid)
}

async function saveUserInDB(uid, email, name) {
  await $fetch("http://localhost:2500/server/ecommerce/StoreUser", {
    method: "POST",
    body: { uid, email, name }
  })
}

// Form Data
const email = ref("")
const password = ref("")
const errors = ref({ email: "", password: "" })

function validateForm() {
  let valid = true
  errors.value = { email: "", password: "" }
  if (!email.value) { errors.value.email = "Email is required"; valid = false }
  if (!password.value) { errors.value.password = "Password is required"; valid = false }
  else if (password.value.length < 6) { errors.value.password = "Password must be at least 6 characters"; valid = false }
  return valid
}

async function loginManual() {
  if (!validateForm()) return
  try {
    const result = await signInWithEmailAndPassword(auth, email.value, password.value)
    await checkAdminAndRedirect(result.user.uid)
  } catch (err) {
    errors.value.email = "Invalid email or password"
    console.error(err)
  }
}
</script>

<style scoped>
/* Custom scrollbar for the entire page */
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
</style>