<template>
    <Navbar />
  <div class="max-w-3xl mx-auto py-12 px-6">
    <h1 class="text-3xl font-bold mb-6">Your Profile</h1>

    <div v-if="loading" class="py-10 text-center">Loading...</div>

    <form v-else @submit.prevent="onSubmit" class="space-y-6 bg-white dark:bg-[#0b0b1b] p-6 rounded-2xl shadow">
      <div>
        <label class="block text-sm font-medium mb-1">Full name</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-gray-50 dark:bg-[#0a0a1a]"
          placeholder="Your full name"
        />
        <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <input
          v-model="form.email"
          type="email"
          class="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-gray-50 dark:bg-[#0a0a1a]"
          placeholder="you@example.com"
        />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Address</label>
        <textarea
          v-model="form.address"
          rows="4"
          class="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-gray-50 dark:bg-[#0a0a1a]"
          placeholder="Your shipping address"
        ></textarea>
        <p v-if="errors.address" class="text-red-500 text-sm mt-1">{{ errors.address }}</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          :disabled="saving"
          type="submit"
          class="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-50"
        >
          <span v-if="!saving">Save</span>
          <span v-else>Saving...</span>
        </button>

        <button type="button" @click="resetForm" class="px-4 py-2 rounded-lg border">Reset</button>

        <div v-if="message" :class="['ml-auto text-sm font-medium', messageType === 'error' ? 'text-red-500' : 'text-green-600']">{{ message }}</div>
      </div>

      <div v-if="needsReauth" class="text-yellow-600 text-sm">
        For security, changing your email requires you to re-authenticate. Please sign in again and then retry.
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged, updateProfile, updateEmail } from 'firebase/auth'

// Simple profile page that supports updating displayName, email and an address field (saved to your backend).
// Paste this as pages/user/profile.vue (Nuxt 3). Adjust backend API endpoints to match your server.

const router = useRouter()
const auth = getAuth()

const loading = ref(true)
const saving = ref(false)
const message = ref('')
const messageType = ref('') // 'success' | 'error'
const needsReauth = ref(false)

const user = ref(null)

const form = reactive({
  name: '',
  email: '',
  address: ''
})

const original = reactive({ name: '', email: '', address: '' })

const errors = reactive({ name: '', email: '', address: '' })

// Replace these endpoints with your real backend routes
const PROFILE_GET = (uid) => `http://localhost:2500/server/user/getProfile?uid=${encodeURIComponent(uid)}`
const PROFILE_UPSERT = () => `http://localhost:2500/server/user/upsertProfile`

function resetForm() {
  form.name = original.name
  form.email = original.email
  form.address = original.address
  clearMessages()
}

function clearMessages() {
  message.value = ''
  messageType.value = ''
  needsReauth.value = false
}

function validate() {
  let ok = true
  errors.name = ''
  errors.email = ''
  errors.address = ''

  if (!form.name || form.name.trim().length < 2) {
    errors.name = 'Please enter your full name (at least 2 characters)'
    ok = false
  }
  if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address.'
    ok = false
  }
  if (!form.address || form.address.trim().length < 6) {
    errors.address = 'Please enter a valid address.'
    ok = false
  }

  return ok
}

async function fetchProfile(uid) {
  try {
    const res = await fetch(PROFILE_GET(uid))
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    // Expected shape: { uid, name, email, address }
    form.name = data.name || auth.currentUser?.displayName || ''
    form.email = data.email || auth.currentUser?.email || ''
    form.address = data.address || ''

    original.name = form.name
    original.email = form.email
    original.address = form.address
  } catch (err) {
    // If backend missing or returns 404, populate from auth as fallback
    form.name = auth.currentUser?.displayName || ''
    form.email = auth.currentUser?.email || ''
    form.address = ''
    original.name = form.name
    original.email = form.email
    original.address = form.address
    console.warn('Could not load profile from server:', err)
  }
}

onAuthStateChanged(auth, async (u) => {
  if (!u) {
    // Not logged in -> redirect to login
    router.push('/login')
    return
  }
  user.value = u
  // load profile from server (address stored server-side)
  await fetchProfile(u.uid)
  loading.value = false
})

async function onSubmit() {
  clearMessages()
  if (!validate()) return

  saving.value = true

  try {
    const updates = {}
    const promises = []

    // update displayName if changed
    if (form.name !== original.name) {
      promises.push(updateProfile(auth.currentUser, { displayName: form.name }))
      updates.displayName = form.name
    }

    // update email if changed
    if (form.email !== original.email) {
      // updateEmail can fail with requires-recent-login
      try {
        await updateEmail(auth.currentUser, form.email)
        updates.email = form.email
      } catch (err) {
        console.error('updateEmail error', err)
        if (err.code === 'auth/requires-recent-login') {
          needsReauth.value = true
          throw new Error('Please re-authenticate and try again (security requirement)')
        } else {
          throw err
        }
      }
    }

    // wait for displayName update (if any)
    if (promises.length) await Promise.all(promises)

    // Upsert address and any profile fields to backend
    // Send uid, name, email, address
    const body = {
      uid: user.value.uid,
      name: form.name,
      email: form.email,
      address: form.address
    }

    const resp = await fetch(PROFILE_UPSERT(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!resp.ok) {
      const text = await resp.text()
      throw new Error(`Server error: ${resp.status} ${text}`)
    }

    // Success
    messageType.value = 'success'
    message.value = 'Profile updated successfully.'

    // update original snapshot
    original.name = form.name
    original.email = form.email
    original.address = form.address
  } catch (err) {
    messageType.value = 'error'
    message.value = err.message || String(err)
    console.error('Failed to update profile:', err)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* Small responsive niceties */
@media (min-width: 768px) {
  .max-w-3xl { max-width: 768px }
}
</style>