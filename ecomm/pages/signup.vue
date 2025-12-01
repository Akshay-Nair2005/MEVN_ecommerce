<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full">
      <!-- Header with decorative element -->
      <div class="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-center relative">
        <div class="absolute top-0 left-0 w-full h-1 bg-amber-300"></div>
        <div class="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
          <svg class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white">Join Us</h1>
        <p class="text-amber-100 mt-2">Create your account to get started</p>
      </div>

      <div class="p-8">
        <!-- Signup Form -->
        <form @submit.prevent="signup" class="space-y-6">
          <!-- Username Field -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 flex items-center">
              <svg class="w-4 h-4 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Username
            </label>
            <input 
              v-model="username" 
              placeholder="Choose a username"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200"
            />
          </div>

          <!-- Email Field -->
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
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200"
            />
          </div>

          <!-- Password Field -->
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
              placeholder="Create a password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200"
            />
            <p class="text-gray-500 text-xs mt-1">Password must be at least 6 characters</p>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-700 text-sm flex items-center">
              <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              {{ errorMessage }}
            </p>
          </div>

          <!-- Sign Up Button -->
          <button 
            type="submit"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition duration-200 transform hover:-translate-y-0.5"
          >
            Create Account
          </button>
        </form>

        <!-- Divider -->
        <div class="my-8 flex items-center">
          <div class="flex-1 border-t border-gray-300"></div>
          <span class="px-4 text-gray-500 text-sm font-medium">Already have an account?</span>
          <div class="flex-1 border-t border-gray-300"></div>
        </div>

        <!-- Alternative Sign In -->
        <div class="text-center">
          <router-link 
            to="/login"
            class="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            Sign in to existing account
          </router-link>
        </div>

        <!-- Terms -->
        <p class="mt-8 text-center text-xs text-gray-500">
          By creating an account, you agree to our 
          <a href="#" class="text-amber-600 hover:text-amber-700">Terms of Service</a> 
          and 
          <a href="#" class="text-amber-600 hover:text-amber-700">Privacy Policy</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, updateEmail } from 'firebase/auth'

const email = ref("")
const password = ref("")
const username = ref("")
const errorMessage = ref("")

const auth = getAuth()
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

// Store user in DB
async function saveUserInDB(uid, email, name) {
  try {
    await $fetch("http://localhost:2500/server/ecommerce/StoreUser", {
      method: "POST",
      body: { uid, email, name }
    })
  } catch (err) {
    console.error("DB SAVE ERROR:", err)
  }
}

async function signup() {
  errorMessage.value = ""

  try {
    // Firebase Account Create
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    const user = userCred.user

    // SAVE TO MONGO
    await saveUserInDB(
      user.uid,
      user.email,
      username.value || user.email.split("@")[0]
    )

    // Redirect
    router.push("/")

  } catch (err) {
    console.error("SIGNUP ERROR:", err)

    // Show readable error
    if (err.code === "auth/email-already-in-use") {
      errorMessage.value = "Email already exists"
    } else if (err.code === "auth/invalid-email") {
      errorMessage.value = "Invalid email format"
    } else if (err.code === "auth/weak-password") {
      errorMessage.value = "Password should be at least 6 characters"
    } else {
      errorMessage.value = "Signup failed. Check console."
    }
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

/* Smooth focus transitions */
input:focus {
  outline: none;
  ring: 2px;
}
</style>