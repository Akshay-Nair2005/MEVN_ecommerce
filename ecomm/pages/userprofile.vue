<template>
  <Navbar />
  <div class="max-w-3xl mx-auto py-12 px-6">
    <h1 class="text-3xl font-bold mb-6">Your Profile</h1>

    <div v-if="loading" class="py-10 text-center">Loading...</div>

    <form v-else @submit.prevent="onSubmit" class="space-y-6 bg-white dark:bg-[#0b0b1b] p-6 rounded-2xl shadow">
      <div class="flex items-center gap-4">
        <div class="relative">
          <div class="w-28 h-28 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <img v-if="previewUrl || form.photoURL" :src="previewUrl || form.photoURL" alt="avatar" class="w-full h-full object-cover" />
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.12 17.804z"/></svg>
          </div>

          <label class="absolute -bottom-1 -right-1 bg-white dark:bg-[#0b0b1b] p-1 rounded-full border cursor-pointer">
            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 11l6 6L4 22l1-7 4-4z"/></svg>
          </label>
        </div>

        <div class="flex-1">
          <div class="text-sm text-gray-600 dark:text-gray-300">Profile photo</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Upload a square image. You can crop before uploading.</div>

          <div class="mt-3 flex gap-2">
            <button type="button" class="px-3 py-1 rounded-lg border" @click="triggerFile">Change</button>
            <button v-if="previewUrl" type="button" class="px-3 py-1 rounded-lg border" @click="cropPreview">Crop & Use</button>
            <button v-if="(form.photoURL || previewUrl)" type="button" class="px-3 py-1 rounded-lg border text-red-600" @click="removeAvatar">Remove</button>
            <div v-if="uploading" class="ml-auto text-sm">Uploading...</div>
          </div>
        </div>
      </div>

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

      <!-- Hidden canvas used for client-side crop -->
      <canvas ref="canvas" class="hidden"></canvas>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged, updateProfile, updateEmail } from 'firebase/auth'

const router = useRouter()
const auth = getAuth()

const loading = ref(true)
const saving = ref(false)
const message = ref('')
const messageType = ref('') // 'success' | 'error'
const needsReauth = ref(false)

const user = ref(null)
const uploading = ref(false)

const form = reactive({
  name: '',
  email: '',
  address: '',
  photoURL: ''
})

const original = reactive({ name: '', email: '', address: '', photoURL: '' })
const errors = reactive({ name: '', email: '', address: '' })

// Backend endpoints (replace with your server)
const PROFILE_GET = (uid) => `http://localhost:2500/server/user/getProfile?uid=${encodeURIComponent(uid)}`
const PROFILE_UPSERT = () => `http://localhost:2500/server/user/upsertProfile`
const PROFILE_UPLOAD_AVATAR = (uid) => `http://localhost:2500/server/user/uploadAvatar?uid=${encodeURIComponent(uid)}`
const PROFILE_DELETE_AVATAR = (uid) => `http://localhost:2500/server/user/deleteAvatar?uid=${encodeURIComponent(uid)}`

const fileInput = ref(null)
const previewUrl = ref('')
let selectedFile = null
const canvas = ref(null)

function triggerFile() {
  fileInput.value?.click()
}

function clearMessages() {
  message.value = ''
  messageType.value = ''
  needsReauth.value = false
}

function resetForm() {
  form.name = original.name
  form.email = original.email
  form.address = original.address
  form.photoURL = original.photoURL
  previewUrl.value = ''
  selectedFile = null
  clearMessages()
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
    // Expected shape: { uid, name, email, address, photoURL }
    form.name = data.name || auth.currentUser?.displayName || ''
    form.email = data.email || auth.currentUser?.email || ''
    form.address = data.address || ''
    form.photoURL = data.photoURL || auth.currentUser?.photoURL || ''

    original.name = form.name
    original.email = form.email
    original.address = form.address
    original.photoURL = form.photoURL
  } catch (err) {
    form.name = auth.currentUser?.displayName || ''
    form.email = auth.currentUser?.email || ''
    form.address = ''
    form.photoURL = auth.currentUser?.photoURL || ''
    original.name = form.name
    original.email = form.email
    original.address = form.address
    original.photoURL = form.photoURL
    console.warn('Could not load profile from server:', err)
  }
}

onAuthStateChanged(auth, async (u) => {
  if (!u) {
    router.push('/login')
    return
  }
  user.value = u
  await fetchProfile(u.uid)
  loading.value = false
})

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    messageType.value = 'error'
    message.value = 'Please select an image file.'
    return
  }
  selectedFile = file

  // Show local preview
  const reader = new FileReader()
  reader.onload = (ev) => {
    previewUrl.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

// Crop the preview to a square (center crop) using canvas and set as the selectedFile
function cropPreview() {
  if (!previewUrl.value) return
  const img = new Image()
  img.onload = async () => {
    const cvs = canvas.value
    const size = Math.min(img.width, img.height)
    cvs.width = size
    cvs.height = size
    const ctx = cvs.getContext('2d')
    const sx = (img.width - size) / 2
    const sy = (img.height - size) / 2
    ctx.clearRect(0, 0, size, size)
    ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size)

    // Convert to blob and update preview + selectedFile
    cvs.toBlob((blob) => {
      if (!blob) return
      const newFile = new File([blob], 'avatar.png', { type: 'image/png' })
      selectedFile = newFile
      const url = URL.createObjectURL(blob)
      previewUrl.value = url
    }, 'image/png')
  }
  img.src = previewUrl.value
}

async function uploadAvatar() {
  if (!selectedFile || !user.value) return null
  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('avatar', selectedFile)

    const res = await fetch(PROFILE_UPLOAD_AVATAR(user.value.uid), {
      method: 'POST',
      body: fd
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Upload failed: ${res.status} ${text}`)
    }
    const data = await res.json()
    // expected { url: 'https://...' }
    const url = data.url

    // update firebase profile to keep photoURL in sync
    try {
      await updateProfile(auth.currentUser, { photoURL: url })
    } catch (err) {
      console.warn('Failed to update firebase photoURL:', err)
    }

    form.photoURL = url
    original.photoURL = url
    selectedFile = null
    previewUrl.value = ''
    return url
  } catch (err) {
    messageType.value = 'error'
    message.value = err.message || 'Failed to upload avatar.'
    console.error(err)
    return null
  } finally {
    uploading.value = false
  }
}

async function removeAvatar() {
  if (!user.value) return
  try {
    const res = await fetch(PROFILE_DELETE_AVATAR(user.value.uid), { method: 'POST' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    // Update firebase (set to null or default)
    try {
      await updateProfile(auth.currentUser, { photoURL: null })
    } catch (err) {
      console.warn('Failed to update firebase photoURL:', err)
    }

    form.photoURL = ''
    original.photoURL = ''
    previewUrl.value = ''
    messageType.value = 'success'
    message.value = 'Avatar removed.'
  } catch (err) {
    messageType.value = 'error'
    message.value = err.message || 'Failed to remove avatar.'
  }
}

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

    // upload avatar if user selected a new one
    if (selectedFile) {
      const url = await uploadAvatar()
      if (url) updates.photoURL = url
    }

    if (promises.length) await Promise.all(promises)

    // Upsert address and any profile fields to backend
    const body = {
      uid: user.value.uid,
      name: form.name,
      email: form.email,
      address: form.address,
      photoURL: form.photoURL
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

    messageType.value = 'success'
    message.value = 'Profile updated successfully.'

    original.name = form.name
    original.email = form.email
    original.address = form.address
    original.photoURL = form.photoURL
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
