<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Admin Header -->
    <header class="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">Manage products and users</p>
            </div>
          </div>
          <NuxtLink to="/" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200">
            Back to Store
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Tabs -->
      <div class="mb-8">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'products'"
              :class="[
                activeTab === 'products'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200'
              ]"
            >
              Products Management
            </button>
            <button
              @click="activeTab = 'users'"
              :class="[
                activeTab === 'users'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200'
              ]"
            >
              Users Management
            </button>
          </nav>
        </div>
      </div>

      <!-- Products Tab -->
      <div v-if="activeTab === 'products'" class="space-y-6">
        <!-- Add Product Button -->
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">All Products</h2>
          <button
            @click="openAddProductModal"
            class="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-medium shadow-lg transition-all duration-200"
          >
            + Add New Product
          </button>
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="product in products"
            :key="product._id"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div class="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-4">
              <img :src="product.image" :alt="product.title" class="max-h-full max-w-full object-contain" />
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{{ product.title }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{{ product.description }}</p>
              <div class="flex items-center justify-between mb-4">
                <span class="text-lg font-bold text-purple-600 dark:text-purple-400">${{ product.price }}</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ product.category }}</span>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="editProduct(product)"
                  class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  @click="deleteProduct(product._id)"
                  class="flex-1 px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'" class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">All Users</h2>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Admin</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="user in users" :key="user._id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ user.name || 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      user.isAdmin
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                    ]"
                  >
                    {{ user.isAdmin ? 'Yes' : 'No' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    @click="toggleAdmin(user)"
                    class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 font-medium mr-4"
                  >
                    Toggle Admin
                  </button>
                  <button
                    @click="deleteUser(user._id)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Product Modal -->
    <div v-if="showProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ editingProduct ? 'Edit Product' : 'Add New Product' }}
            </h3>
            <button @click="closeProductModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveProduct" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product ID</label>
              <input
                v-model.number="productForm.id"
                type="number"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
              <input
                v-model="productForm.title"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price</label>
              <input
                v-model.number="productForm.price"
                type="number"
                step="0.01"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                v-model="productForm.description"
                rows="4"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                v-model="productForm.category"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Category</option>
                <option value="men's clothing">Men's Clothing</option>
                <option value="women's clothing">Women's Clothing</option>
                <option value="jewelery">Jewelery</option>
                <option value="electronics">Electronics</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
              <input
                v-model="productForm.image"
                type="url"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                <input
                  v-model.number="productForm.rating.rate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating Count</label>
                <input
                  v-model.number="productForm.rating.count"
                  type="number"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div class="flex space-x-4 pt-4">
              <button
                type="submit"
                class="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all duration-200"
              >
                {{ editingProduct ? 'Update Product' : 'Add Product' }}
              </button>
              <button
                type="button"
                @click="closeProductModal"
                class="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-semibold transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const auth = getAuth()
const router = useRouter()

const activeTab = ref('products')
const products = ref([])
const users = ref([])
const showProductModal = ref(false)
const editingProduct = ref(null)

const productForm = ref({
  id: null,
  title: '',
  price: 0,
  description: '',
  category: '',
  image: '',
  rating: {
    rate: 0,
    count: 0
  }
})

// Check if user is admin from MongoDB
onMounted(async () => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      router.replace('/login')
      return
    }

    try {
      const response = await $fetch(`http://localhost:2500/server/ecommerce/GetUser/${user.uid}`)
      
      if (!response || response.isAdmin !== true) {
        router.replace('/')
        return
      }

      // Load data
      await loadProducts()
      await loadUsers()
    } catch (error) {
      console.error('Error checking admin status:', error)
      router.replace('/')
    }
  })
})

async function loadProducts() {
  try {
    const response = await $fetch('http://localhost:2500/server/ecommerce/GetProducts')
    products.value = response
  } catch (error) {
    console.error('Error loading products:', error)
  }
}

async function loadUsers() {
  try {
    const response = await $fetch('http://localhost:2500/server/ecommerce/GetUsers')
    users.value = response
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

function openAddProductModal() {
  editingProduct.value = null
  productForm.value = {
    id: null,
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    rating: {
      rate: 0,
      count: 0
    }
  }
  showProductModal.value = true
}

function editProduct(product) {
  editingProduct.value = product
  productForm.value = {
    id: product.id,
    title: product.title,
    price: product.price,
    description: product.description,
    category: product.category,
    image: product.image,
    rating: {
      rate: product.rating?.rate || 0,
      count: product.rating?.count || 0
    }
  }
  showProductModal.value = true
}

function closeProductModal() {
  showProductModal.value = false
  editingProduct.value = null
}

async function saveProduct() {
  try {
    if (editingProduct.value) {
      // Update existing product
      await $fetch(`http://localhost:2500/server/ecommerce/UpdateProduct/${editingProduct.value._id}`, {
        method: 'PUT',
        body: productForm.value
      })
    } else {
      // Add new product
      await $fetch('http://localhost:2500/server/ecommerce/AddProduct', {
        method: 'POST',
        body: productForm.value
      })
    }
    await loadProducts()
    closeProductModal()
  } catch (error) {
    console.error('Error saving product:', error)
    alert('Failed to save product')
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return

  try {
    await $fetch(`http://localhost:2500/server/ecommerce/DeleteProduct/${id}`, {
      method: 'DELETE'
    })
    await loadProducts()
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Failed to delete product')
  }
}

async function toggleAdmin(user) {
  try {
    await $fetch(`http://localhost:2500/server/ecommerce/UpdateUser/${user._id}`, {
      method: 'PUT',
      body: { isAdmin: !user.isAdmin }
    })
    await loadUsers()
  } catch (error) {
    console.error('Error updating user:', error)
    alert('Failed to update user')
  }
}

async function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user?')) return

  try {
    await $fetch(`http://localhost:2500/server/ecommerce/DeleteUser/${id}`, {
      method: 'DELETE'
    })
    await loadUsers()
  } catch (error) {
    console.error('Error deleting user:', error)
    alert('Failed to delete user')
  }
}
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
