<template>
  <div class="p-6 max-w-md mx-auto">

    <h1 class="text-center text-2xl font-bold mb-6">Login</h1>

    <!-- Manual Login Form -->
    <form @submit.prevent="loginManual" class="space-y-4 border p-4 rounded">

      <input v-model="email" type="email" placeholder="Enter Email"
             class="w-full border px-3 py-2 rounded" />

      <p class="text-red-500 text-sm" v-if="errors.email">{{ errors.email }}</p>

      <input v-model="password" type="password" placeholder="Enter Password"
             class="w-full border px-3 py-2 rounded" />

      <p class="text-red-500 text-sm" v-if="errors.password">{{ errors.password }}</p>

      <button class="bg-blue-500 w-full py-2 text-white rounded">Login</button>

    </form>

    <p class="text-center my-4">OR</p>

    <!-- Google Login -->
    <div class="text-center">
      <button class="bg-red-500 w-full py-2 text-white rounded" @click="signInWithGoogle">
        Login with Google
      </button>
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

// You do not need this separate CheckUser call now, but if you keep it:
// onMounted(() => CheckUser())

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
  router.replace("/")
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
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push("/")
  } catch (err) {
    errors.value.email = "Invalid email or password"
    console.error(err)
  }
}
</script>


<style></style>