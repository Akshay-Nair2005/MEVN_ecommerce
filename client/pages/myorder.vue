<template>
  <Navbar />
  <div class="order-page bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
          My Orders
        </h1>
        <p class="text-black-600 dark:text-white-400">View and manage your purchase history</p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="state-card dark:bg-gray-800 dark:border-gray-700 animate-pulse">
        <div class="flex items-center justify-center space-x-2">
          <div class="w-4 h-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-bounce"></div>
          <div class="w-4 h-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-bounce delay-100"></div>
          <div class="w-4 h-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-bounce delay-200"></div>
        </div>
        <p class="mt-4 text-black-600 dark:text-black-400">Loading your orders...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="state-card dark:bg-gray-800 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="font-semibold text-red-800 dark:text-red-400">Error loading orders</p>
            <p class="text-red-600 dark:text-red-300">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="groupedOrders.length === 0" class="state-card dark:bg-gray-800 dark:border-gray-700 text-center">
        <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-black-800 dark:text-white mb-2">No orders yet</h3>
        <p class="text-black-600 dark:text-black-400 mb-6">Start shopping to see your orders here</p>
        <NuxtLink to="/" class="btn-primary">
          Start Shopping
        </NuxtLink>
      </div>

      <!-- Orders list -->
      <div v-else class="space-y-8">
        <div
          v-for="group in groupedOrders"
          :key="group.key"
          class="order-group-card dark:bg-gray-800 dark:border-gray-700"
          :class="group.isGroup ? 'bg-[#19193f] border-white/30' : 'bg-[#19193f] border-white/30'"
        >
          <!-- Group header -->
          <div class="order-group-header dark:border-gray-700">
            <div>
              <div class="flex items-center gap-3 mb-2 ">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"
                      :class="group.isGroup ? 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300' : 'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 text-emerald-700 dark:text-white'">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="group.isGroup" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {{ group.isGroup ? 'Group Payment' : 'Individual Order' }}
                </span>
                <span class="text-sm text-black-500 dark:text-black-400">Order #{{ group.key.slice(0, 10) }}</span>
              </div>
              <h2 class="text-xl font-bold text-black-900 ">
                {{ formatDate(group.createdAt) }}
              </h2>
              <!-- Delivery Date -->
              <div class="mt-2 flex items-center gap-2 text-sm">
                <svg class="w-4 h-4 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span class="text-green-800 font-medium">
                  Expected Delivery: {{ getDeliveryDate(group.createdAt) }}
                </span>
              </div>
            </div>

            <button @click="downloadInvoice(group)" class="btn-primary flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Invoice
            </button>
          </div>

          <!-- Order items -->
          <div class="space-y-4 mt-6 text-black">
            <div
              v-for="order in group.orders"
              :key="order._id || order.productId + '-' + order.createdAt"
              class="order-item-card dark:bg-gray-700 dark:border-gray-600"
            >
              <div class="flex items-start gap-4">
                <!-- Product image -->
                <div class="flex-shrink-0">
                  <div class="w-20 h-20 rounded-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-1">
                    <img
                      v-if="order.product?.image"
                      :src="order.product.image"
                      :alt="order.product.title"
                      class="w-full h-full object-contain"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30">
                      <svg class="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Product details -->
                <div class="flex-grow">
                  <div class="flex justify-between items-start text-black">
                    <div>
                      <h3 class="font-semibold text-black-900  text-lg mb-1">
                        {{ order.product?.title || 'Product Unavailable' }}
                      </h3>
                      <p class="text-sm text-black-500 dark:text-black-400 mb-2">Product ID: {{ order.productId }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-lg font-bold text-black-900 ">
                        ₹{{ order.product ? (order.product.price * order.quantity).toFixed(2) : '0.00' }}
                      </p>
                      <p class="text-sm text-black-500 dark:text-black-400">{{ order.quantity }} × ₹{{ order.product?.price?.toFixed(2) || '0.00' }}</p>
                    </div>
                  </div>
                  
                  <div v-if="!order.product" class="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-700 dark:text-red-400 text-sm">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Product details unavailable
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Group total -->
          <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-black-600 dark:text-black-400">Payment status</p>
                <p class="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Completed
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm text-black-600 dark:text-black-400 mb-1">Total amount</p>
                <p class="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  ₹{{ group.grandTotal.toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// reactive state
const orders = ref([])
const loading = ref(true)
const error = ref(null)

const API_BASE = 'http://localhost:2500'

onMounted(() => {
  const auth = getAuth()

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      loading.value = false
      error.value = 'You must be logged in to see your orders.'
      return
    }

    const uid = user.uid

    try {
      // Get orders for this user
      const ordersRes = await fetch(
        `${API_BASE}/server/ecommerce/GetOrders?uid=${encodeURIComponent(uid)}`
      )

      if (!ordersRes.ok) {
        throw new Error('Failed to fetch orders')
      }

      const ordersData = await ordersRes.json()

      if (!Array.isArray(ordersData)) {
        throw new Error('Orders response is not an array')
      }

      // Get product details
      const productsCache = {}

      await Promise.all(
        ordersData.map(async (order) => {
          const productIdNum = Number(order.productId)

          if (!productIdNum || productsCache[productIdNum]) return

          const productRes = await fetch(
            `${API_BASE}/server/ecommerce/GetProducts/${productIdNum}`
          )

          if (productRes.ok) {
            const product = await productRes.json()
            productsCache[productIdNum] = product
          }
        })
      )

      // Merge orders with products
      orders.value = ordersData.map((order) => ({
        ...order,
        product: productsCache[Number(order.productId)] || null,
      }))
    } catch (err) {
      console.error(err)
      error.value = err.message || 'Something went wrong while loading orders.'
    } finally {
      loading.value = false
    }
  })
})

// Group orders by createdAt
const groupedOrders = computed(() => {
  const map = new Map()

  orders.value.forEach((order) => {
    if (!order.createdAt) return
    const d = new Date(order.createdAt)
    const key = d.toISOString().slice(0, 19)

    if (!map.has(key)) {
      map.set(key, [])
    }
    map.get(key).push(order)
  })

  return Array.from(map.entries())
    .map(([key, groupOrders]) => {
      const grandTotal = groupOrders.reduce((sum, o) => {
        const price = o.product?.price ?? 0
        return sum + price * o.quantity
      }, 0)

      return {
        key,
        createdAt: groupOrders[0].createdAt,
        isGroup: groupOrders.length > 1,
        orders: groupOrders,
        grandTotal,
      }
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// Format date helper
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Get delivery date (7 days from order date)
const getDeliveryDate = (dateStr) => {
  if (!dateStr) return '-'
  const orderDate = new Date(dateStr)
  const deliveryDate = new Date(orderDate)
  deliveryDate.setDate(deliveryDate.getDate() + 7)
  return deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Enhanced PDF generation
const downloadInvoice = async (group) => {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()

  // Colors
  const primaryColor = [251, 146, 60] // amber-500
  const accentColor = [59, 130, 246] // blue-600

  // Header with gradient effect
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(0, 0, 210, 60, 'F')
  
  // Shop logo/name
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('ShopMate', 105, 25, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('INVOICE', 105, 35, { align: 'center' })
  doc.text(`Invoice Date: ${new Date(group.createdAt).toLocaleDateString('en-US')}`, 105, 42, { align: 'center' })

  // Invoice details
  doc.setFillColor(240, 240, 240)
  doc.rect(20, 70, 170, 30, 'F')
  
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Invoice #:', 25, 80)
  doc.text('Order Date:', 25, 87)
  doc.text('Payment Type:', 25, 94)
  
  doc.setFont('helvetica', 'normal')
  doc.text(group.key.slice(0, 10).toUpperCase(), 60, 80)
  doc.text(formatDate(group.createdAt), 60, 87)
  doc.text(group.isGroup ? 'Group Payment' : 'Individual Payment', 60, 94)

  // Items table header
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2])
  doc.rect(20, 110, 170, 10, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Item', 25, 117)
  doc.text('Quantity', 120, 117)
  doc.text('Price', 140, 117)
  doc.text('Total', 175, 117)

  // Items list
  let y = 130
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  
  group.orders.forEach((order, index) => {
    const title = order.product?.title || 'Unknown Product'
    const qty = order.quantity
    const price = order.product?.price?.toFixed(2) || '0.00'
    const lineTotal = (order.product?.price * order.quantity || 0).toFixed(2)

    // Item row with alternating background
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252)
      doc.rect(20, y - 5, 170, 10, 'F')
    }

    // Wrap long product names
    const maxWidth = 90
    const lines = doc.splitTextToSize(title, maxWidth)
    doc.text(lines, 25, y)
    
    // Calculate y position based on wrapped lines
    const textHeight = lines.length * 5
    const qtyY = y + (textHeight > 10 ? textHeight - 10 : 0)
    
    doc.text(qty.toString(), 120, qtyY)
    doc.text(`Rs.${price}`, 140, qtyY)
    doc.text(`Rs.${lineTotal}`, 175, qtyY)

    y += Math.max(15, textHeight + 5)

    // Check for page break
    if (y > 250) {
      doc.addPage()
      y = 30
    }
  })

  // Divider
  y += 5
  doc.setDrawColor(200, 200, 200)
  doc.line(20, y, 190, y)
  y += 15

  // Totals
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Subtotal:', 140, y)
  doc.text(`Rs.${group.grandTotal.toFixed(2)}`, 175, y, { align: 'right' })
  
  y += 8
  doc.text('Total:', 140, y)
  doc.setFontSize(14)
  doc.text(`Rs.${group.grandTotal.toFixed(2)}`, 175, y, { align: 'right' })

  // Footer
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text('Thank you for your purchase!', 105, 280, { align: 'center' })
  doc.text('ShopMate - Your Trusted Shopping Partner', 105, 285, { align: 'center' })

  // Save PDF
  const filename = `invoice-${group.key.slice(0, 8)}.pdf`
  doc.save(filename)
}
</script>

<style scoped>
.state-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center;
}

.order-group-card {
  @apply bg-white rounded-2xl shadow-lg border-2 p-6 transition-all duration-300 hover:shadow-xl;
}

.order-group-header {
  @apply flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200;
}

.order-item-card {
  @apply bg-white rounded-xl border border-gray-200 p-4 transition-all duration-200 hover:border-amber-300 hover:shadow-md;
}

.btn-primary {
  @apply bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg;
}

/* Dark mode overrides */
:deep(.dark) .state-card {
  @apply bg-gray-800 border-gray-700;
}

:deep(.dark) .order-group-card {
  @apply bg-gray-800 border-gray-700;
}

:deep(.dark) .order-group-header {
  @apply border-gray-700;
}

:deep(.dark) .order-item-card {
  @apply bg-gray-700 border-gray-600 hover:border-amber-500;
}

/* Custom scrollbar */
.order-page ::-webkit-scrollbar {
  width: 8px;
}

.order-page ::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded-full;
}

:deep(.dark) .order-page ::-webkit-scrollbar-track {
  @apply bg-gray-800;
}

.order-page ::-webkit-scrollbar-thumb {
  @apply bg-gradient-to-b from-amber-400 to-orange-500 rounded-full;
}

.order-page ::-webkit-scrollbar-thumb:hover {
  @apply from-amber-500 to-orange-600;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .order-group-header {
    @apply flex-col items-start;
  }
  
  .btn-primary {
    @apply w-full justify-center;
  }
}
</style>