<template>
  <div class="order-page">
    <h1>My Orders</h1>

    <!-- Loading state -->
    <div v-if="loading" class="state">
      Loading your orders...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="state error">
      {{ error }}
    </div>

    <!-- Empty state -->
    <div v-else-if="groupedOrders.length === 0" class="state">
      You have no orders yet.
    </div>

    <!-- Orders grouped by createdAt (to the second) -->
    <div v-else class="orders-list">
      <div
        v-for="group in groupedOrders"
        :key="group.key"
        class="order-group"
        :class="group.isGroup ? 'group-payment' : 'individual-payment'"
      >
        <div class="order-group-header">
          <div>
            <h2>
              {{ group.isGroup ? 'Group Payment' : 'Individual Order' }}
            </h2>
            <p class="order-date">
              Ordered on: {{ formatDate(group.createdAt) }}
            </p>
          </div>

          <button class="invoice-btn" @click="downloadInvoice(group)">
            Download Invoice (PDF)
          </button>
        </div>

        <!-- Items inside this payment group -->
        <div
          v-for="order in group.orders"
          :key="order._id || order.productId + '-' + order.createdAt"
          class="order-item"
        >
          <div class="order-header">
            <h3>
              {{ order.product?.title || 'Unknown product' }}
            </h3>
            <p class="order-id">Product ID: {{ order.productId }}</p>
          </div>

          <div class="order-body">
            <img
              v-if="order.product?.image"
              :src="order.product.image"
              :alt="order.product.title"
              class="product-image"
            />

            <div class="order-details">
              <p>Quantity: {{ order.quantity }}</p>
              <p v-if="order.product">
                Price per item: ${{ order.product.price.toFixed(2) }}
              </p>
              <p v-if="order.product" class="order-total">
                Line Total:
                ${{ (order.product.price * order.quantity).toFixed(2) }}
              </p>
              <p v-else class="missing-product">
                Product details not found (maybe deleted).
              </p>
            </div>
          </div>
        </div>

        <!-- Group grand total -->
        <div class="group-total">
          <span>Payment Total:</span>
          <strong>${{ group.grandTotal.toFixed(2) }}</strong>
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

    const uid = user.uid // Firebase UID

    try {
      // 1️⃣ Get orders for this user
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

      // 2️⃣ For each order, get its product by productId
      const productsCache = {}

      await Promise.all(
        ordersData.map(async (order) => {
          const productIdNum = Number(order.productId)

          if (!productIdNum || productsCache[productIdNum]) return

          const productRes = await fetch(
            `${API_BASE}/server/ecommerce/GetProducts/${productIdNum}`
          )

          if (!productRes.ok) {
            console.warn('Failed to fetch product', productIdNum)
            return
          }

          const product = await productRes.json()
          productsCache[productIdNum] = product
        })
      )

      // 3️⃣ Merge orders with their products
      orders.value = ordersData.map((order) => {
        const productIdNum = Number(order.productId)
        return {
          ...order,
          product: productsCache[productIdNum] || null,
        }
      })
    } catch (err) {
      console.error(err)
      error.value = err.message || 'Something went wrong while loading orders.'
    } finally {
      loading.value = false
    }
  })
})

// 🕒 Group orders by createdAt (to the second)
const groupedOrders = computed(() => {
  const map = new Map()

  orders.value.forEach((order) => {
    if (!order.createdAt) return
    const d = new Date(order.createdAt)
    // key up to seconds (YYYY-MM-DDTHH:MM:SS)
    const key = d.toISOString().slice(0, 19)

    if (!map.has(key)) {
      map.set(key, [])
    }
    map.get(key).push(order)
  })

  return Array.from(map.entries()).map(([key, groupOrders]) => {
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
})

// helper to format date
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

// 📄 Generate PDF invoice for a group (group or single)
const downloadInvoice = async (group) => {
  // dynamic import so it only runs on client & avoids SSR issues
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF()


  // Header - Shop name
  doc.setFontSize(20)
  doc.text('ShopMate', 105, 18, { align: 'center' })

  doc.setFontSize(12)
  doc.text(
    group.isGroup ? 'Group Payment Invoice' : 'Individual Order Invoice',
    105,
    26,
    { align: 'center' }
  )

  doc.setFontSize(10)
  doc.text(`Invoice Date: ${formatDate(group.createdAt)}`, 20, 36)

  let y = 46

  doc.setFontSize(12)
  doc.text('Items', 20, y)
  y += 6

  doc.setFontSize(10)

  group.orders.forEach((order) => {
    const title = order.product?.title || 'Unknown product'
    const qty = order.quantity
    const price = order.product?.price ?? 0
    const lineTotal = price * qty

    // item name (wrapped simple)
    doc.text(title, 20, y)
    y += 5

    doc.text(
      `Qty: ${qty} | Price: $${price.toFixed(
        2
      )} | Line Total: $${lineTotal.toFixed(2)}`,
      24,
      y
    )
    y += 8

    // simple safety for page overflow
    if (y > 270) {
      doc.addPage()
      y = 20
    }
  })

  y += 4
  doc.setDrawColor(0)
  doc.line(20, y, 190, y)
  y += 8

  doc.setFontSize(12)
  doc.text(`Grand Total: $${group.grandTotal.toFixed(2)}`, 20, y)

  const filename = group.isGroup
    ? `shopmate-invoice-group-${group.key}.pdf`
    : `shopmate-invoice-${group.key}.pdf`

  doc.save(filename)
}
</script>

<style scoped>
.order-page {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Group container */
.order-group {
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid #ddd;
}

/* Different UI for group vs individual */
.group-payment {
  border-color: #3498db;
  background: #f5f9ff;
}

.individual-payment {
  border-color: #2ecc71;
  background: #f6fff8;
}

.order-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.invoice-btn {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: #2d3436;
  color: #fff;
  font-size: 0.9rem;
}

.order-item {
  border-radius: 6px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  margin-bottom: 0.6rem;
  background: #fff;
}

.order-header {
  margin-bottom: 0.5rem;
}

.order-id,
.order-date {
  font-size: 0.9rem;
  color: #666;
}

.order-body {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 4px;
}

.order-details p {
  margin: 0.2rem 0;
}

.order-total {
  font-weight: 600;
}

.group-total {
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.4rem;
  font-size: 1rem;
}

.missing-product {
  color: #c0392b;
}

.state {
  margin-top: 1rem;
}

.state.error {
  color: #c0392b;
}
</style>
