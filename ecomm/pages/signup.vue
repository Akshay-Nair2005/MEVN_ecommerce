<script setup>
import { ref } from "vue"
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, updateEmail } from 'firebase/auth'



const email = ref("")
const password = ref("")
const username = ref("")
const errorMessage = ref("")

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


<template>
  <div class="p-5 max-w-md mx-auto">
    <h1 class="text-xl font-bold mb-4">Create Account</h1>

    <input v-model="username" placeholder="Username"
           class="border p-2 mb-3 w-full" />

    <input v-model="email" placeholder="Email"
           class="border p-2 mb-3 w-full" type="email" />

    <input v-model="password" placeholder="Password"
           class="border p-2 mb-3 w-full" type="password" />

    <p class="text-red-500 mb-2" v-if="errorMessage">{{ errorMessage }}</p>

    <button class="bg-blue-600 text-white py-2 w-full" @click="signup">
      Sign Up
    </button>
  </div>
</template>