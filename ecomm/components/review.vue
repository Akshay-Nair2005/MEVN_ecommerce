<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <!-- Header -->
        <header class="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl shadow-xl mb-8 p-8">
            <div class="max-w-7xl mx-auto">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl md:text-4xl font-bold mb-2">Customer Reviews</h1>
                        <p class="text-amber-100 text-lg">Share your experience with our products</p>
                    </div>
                    <div class="hidden md:block">
                        <div class="flex items-center space-x-4">
                            <div class="text-center">
                                <div class="text-3xl font-bold">{{ averageRating.toFixed(1) }}</div>
                                <div class="flex items-center justify-center">
                                    <div v-for="i in 5" :key="i" class="w-4 h-4">
                                        <svg :class="i <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                </div>
                                <p class="text-sm mt-1">{{ reviews.length }} reviews</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <div class="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
            <!-- Left Column: Product Info & Reviews -->
            <div class="lg:w-2/3">
                <!-- Product Info Card -->
                <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
                    <div class="flex flex-col md:flex-row gap-6">
                        <!-- Product Image -->
                        <div class="md:w-1/3">
                            <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                                <img :src="selectedProduct.image" :alt="selectedProduct.title" class="w-full h-48 object-contain rounded-lg">
                            </div>
                        </div>
                        
                        <!-- Product Details -->
                        <div class="md:w-2/3">
                            <div class="flex items-start justify-between">
                                <div>
                                    <h2 class="text-2xl font-bold text-gray-900">{{ selectedProduct.title }}</h2>
                                    <p class="text-gray-600 mt-2">{{ selectedProduct.description }}</p>
                                </div>
                                <div class="text-right">
                                    <div class="text-3xl font-bold text-gray-900">${{ selectedProduct.price.toFixed(2) }}</div>
                                    <div class="flex items-center mt-2">
                                        <div class="flex">
                                            <div v-for="i in 5" :key="i" class="w-5 h-5">
                                                <svg :class="i <= selectedProduct.rating ? 'text-amber-500' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <span class="ml-2 text-gray-600">({{ selectedProduct.reviewCount }})</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Product Stats -->
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                <div class="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                                    <div class="text-xl font-bold text-gray-900">{{ reviews.length }}</div>
                                    <div class="text-sm text-gray-600">Total Reviews</div>
                                </div>
                                <div class="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                                    <div class="text-xl font-bold text-gray-900">{{ helpfulReviews }}</div>
                                    <div class="text-sm text-gray-600">Helpful Reviews</div>
                                </div>
                                <div class="text-center p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                                    <div class="text-xl font-bold text-gray-900">{{ averageRating.toFixed(1) }}</div>
                                    <div class="text-sm text-gray-600">Avg Rating</div>
                                </div>
                                <div class="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                                    <div class="text-xl font-bold text-gray-900">{{ verifiedPurchases }}</div>
                                    <div class="text-sm text-gray-600">Verified Buyers</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Reviews List -->
                <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold text-gray-900">Customer Reviews</h3>
                        <div class="flex items-center space-x-2">
                            <button 
                                v-for="filter in filters" 
                                :key="filter"
                                @click="activeFilter = filter"
                                class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                :class="activeFilter === filter 
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                            >
                                {{ filter }}
                            </button>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div 
                            v-for="(review, index) in filteredReviews" 
                            :key="index" 
                            class="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-5"
                        >
                            <!-- Review Header -->
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {{ review.author.charAt(0) }}
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-gray-900">{{ review.author }}</h4>
                                        <div class="flex items-center space-x-2 mt-1">
                                            <div class="flex">
                                                <div v-for="i in 5" :key="i" class="w-4 h-4">
                                                    <svg :class="i <= review.rating ? 'text-amber-500' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <span class="text-sm text-gray-500">{{ formatDate(review.date) }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="review.verified" class="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                    </svg>
                                    <span>Verified Purchase</span>
                                </div>
                            </div>

                            <!-- Review Content -->
                            <div class="mb-4">
                                <h5 class="font-semibold text-gray-900 mb-2">{{ review.title }}</h5>
                                <p class="text-gray-700 leading-relaxed">{{ review.content }}</p>
                            </div>

                            <!-- Review Actions -->
                            <div class="flex items-center justify-between border-t border-gray-100 pt-4">
                                <div class="flex items-center space-x-4">
                                    <button 
                                        @click="toggleHelpful(index)"
                                        class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
                                        :class="review.helpfulActive 
                                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 ring-2 ring-blue-200' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                                    >
                                        <span>👍</span>
                                        <span class="font-medium">Helpful ({{ review.helpful }})</span>
                                    </button>
                                    <button 
                                        @click="toggleUnhelpful(index)"
                                        class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
                                        :class="review.unhelpfulActive 
                                            ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-600 ring-2 ring-red-200' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                                    >
                                        <span>👎</span>
                                        <span class="font-medium">Not Helpful ({{ review.unhelpful }})</span>
                                    </button>
                                </div>

                                <!-- Report/Share -->
                                <div class="flex items-center space-x-3">
                                    <button class="text-gray-400 hover:text-gray-600 transition-colors">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                    </button>
                                    <button class="text-gray-400 hover:text-red-500 transition-colors">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- Comments Section -->
                            <div v-if="review.comments.length > 0" class="mt-4 space-y-3">
                                <div 
                                    v-for="(comment, commentIndex) in review.comments" 
                                    :key="commentIndex"
                                    class="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-200 ml-12"
                                >
                                    <div class="flex items-center space-x-2 mb-1">
                                        <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <span class="text-sm font-medium text-gray-600">Response from ShopMate</span>
                                    </div>
                                    <p class="text-gray-700">{{ comment }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Add Review & Product Selector -->
            <div class="lg:w-1/3">
                <!-- Product Selector -->
                <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">Select Product</h3>
                    <div class="space-y-3">
                        <button
                            v-for="product in products"
                            :key="product.id"
                            @click="selectProduct(product)"
                            class="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-50"
                            :class="selectedProduct.id === product.id ? 'bg-gradient-to-r from-amber-50 to-orange-50 ring-2 ring-amber-200' : ''"
                        >
                            <div class="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-2">
                                <img :src="product.image" :alt="product.title" class="w-full h-full object-contain">
                            </div>
                            <div class="flex-1 text-left">
                                <div class="font-medium text-gray-900 truncate">{{ product.title }}</div>
                                <div class="text-sm text-gray-600">${{ product.price.toFixed(2) }}</div>
                            </div>
                            <div class="flex items-center">
                                <div v-for="i in 5" :key="i" class="w-3 h-3">
                                    <svg :class="i <= product.rating ? 'text-amber-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <span class="text-xs text-gray-500 ml-1">({{ product.reviewCount }})</span>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Add Review Form -->
                <div class="sticky top-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-900">Write a Review</h2>
                        <p class="text-gray-600 mt-2">Share your experience with this product</p>
                    </div>

                    <form @submit.prevent="submitReview" class="space-y-4">
                        <!-- Rating -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Your Rating
                            </label>
                            <div class="flex space-x-1">
                                <button
                                    v-for="star in 5"
                                    :key="star"
                                    type="button"
                                    @click="newReview.rating = star"
                                    class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                                    :class="star <= newReview.rating 
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white transform scale-110' 
                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'"
                                >
                                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Title -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Review Title
                            </label>
                            <input 
                                v-model="newReview.title"
                                type="text" 
                                required
                                placeholder="Summarize your experience"
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <!-- Name -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Your Name
                            </label>
                            <input 
                                v-model="newReview.author"
                                type="text" 
                                required
                                placeholder="How should we display your name?"
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <!-- Content -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Your Review
                            </label>
                            <textarea 
                                v-model="newReview.content"
                                required
                                rows="4"
                                placeholder="Share details about your experience with this product..."
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                            ></textarea>
                        </div>

                        <!-- Verified Purchase -->
                        <div class="flex items-center space-x-3">
                            <input 
                                v-model="newReview.verified"
                                type="checkbox" 
                                id="verifiedPurchase"
                                class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label for="verifiedPurchase" class="text-sm text-gray-700">
                                I purchased this product from ShopMate
                            </label>
                        </div>

                        <!-- Submit Button -->
                        <button 
                            type="submit"
                            class="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl"
                        >
                            Submit Review
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedProduct: {
                id: 1,
                title: "Premium Wireless Headphones",
                description: "Noise-cancelling wireless headphones with 30-hour battery life",
                price: 249.99,
                rating: 4.5,
                reviewCount: 128,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
            },
            products: [
                {
                    id: 1,
                    title: "Premium Wireless Headphones",
                    price: 249.99,
                    rating: 4.5,
                    reviewCount: 128,
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w-400"
                },
                {
                    id: 2,
                    title: "Smart Watch Pro",
                    price: 399.99,
                    rating: 4.7,
                    reviewCount: 89,
                    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
                },
                {
                    id: 3,
                    title: "Ultra HD 4K Camera",
                    price: 1299.99,
                    rating: 4.8,
                    reviewCount: 45,
                    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400"
                },
                {
                    id: 4,
                    title: "Gaming Laptop",
                    price: 1799.99,
                    rating: 4.6,
                    reviewCount: 67,
                    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400"
                }
            ],
            reviews: [
                {
                    author: "Alex Johnson",
                    rating: 5,
                    title: "Best headphones I've ever owned!",
                    content: "The sound quality is incredible and the noise cancellation works perfectly. Battery life lasts me through multiple days of use.",
                    date: "2024-01-15",
                    verified: true,
                    helpful: 42,
                    unhelpful: 2,
                    helpfulActive: false,
                    unhelpfulActive: false,
                    comments: ["Thank you for your detailed review! We're glad you're enjoying the headphones."]
                },
                {
                    author: "Sarah Miller",
                    rating: 4,
                    title: "Great sound, comfortable fit",
                    content: "Very comfortable for long listening sessions. The only downside is the case could be more compact for travel.",
                    date: "2024-01-10",
                    verified: true,
                    helpful: 28,
                    unhelpful: 5,
                    helpfulActive: false,
                    unhelpfulActive: false,
                    comments: []
                },
                {
                    author: "Mike Chen",
                    rating: 5,
                    title: "Worth every penny",
                    content: "The sound isolation is amazing. I use them for work calls and the microphone quality is crystal clear.",
                    date: "2024-01-05",
                    verified: true,
                    helpful: 35,
                    unhelpful: 1,
                    helpfulActive: false,
                    unhelpfulActive: false,
                    comments: []
                },
                {
                    author: "Jessica Brown",
                    rating: 3,
                    title: "Good but has connectivity issues",
                    content: "Sound quality is great when it works, but I've had some Bluetooth connectivity problems with my phone.",
                    date: "2023-12-28",
                    verified: false,
                    helpful: 12,
                    unhelpful: 8,
                    helpfulActive: false,
                    unhelpfulActive: false,
                    comments: ["We're sorry to hear about the connectivity issues. Please contact our support team for assistance."]
                }
            ],
            newReview: {
                title: "",
                author: "",
                rating: 5,
                content: "",
                verified: false
            },
            filters: ["All", "5 Stars", "4 Stars", "3 Stars", "Verified"],
            activeFilter: "All"
        };
    },
    computed: {
        averageRating() {
            if (this.reviews.length === 0) return 0;
            const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
            return sum / this.reviews.length;
        },
        helpfulReviews() {
            return this.reviews.filter(r => r.helpful > 5).length;
        },
        verifiedPurchases() {
            return this.reviews.filter(r => r.verified).length;
        },
        filteredReviews() {
            if (this.activeFilter === "All") return this.reviews;
            if (this.activeFilter === "Verified") return this.reviews.filter(r => r.verified);
            if (this.activeFilter === "5 Stars") return this.reviews.filter(r => r.rating === 5);
            if (this.activeFilter === "4 Stars") return this.reviews.filter(r => r.rating === 4);
            if (this.activeFilter === "3 Stars") return this.reviews.filter(r => r.rating === 3);
            return this.reviews;
        }
    },
    methods: {
        selectProduct(product) {
            this.selectedProduct = product;
            // In a real app, you would fetch reviews for this product
        },
        submitReview() {
            if (!this.newReview.title.trim() || 
                !this.newReview.author.trim() || 
                !this.newReview.content.trim()) {
                alert("Please fill in all required fields.");
                return;
            }

            this.reviews.unshift({
                author: this.newReview.author,
                rating: this.newReview.rating,
                title: this.newReview.title,
                content: this.newReview.content,
                date: new Date().toISOString().split('T')[0],
                verified: this.newReview.verified,
                helpful: 0,
                unhelpful: 0,
                helpfulActive: false,
                unhelpfulActive: false,
                comments: []
            });

            this.newReview = {
                title: "",
                author: "",
                rating: 5,
                content: "",
                verified: false
            };

            // Update product review count
            this.selectedProduct.reviewCount++;
            
            // Success animation
            const submitBtn = document.querySelector('button[type="submit"]');
            submitBtn.classList.add('animate-pulse');
            setTimeout(() => submitBtn.classList.remove('animate-pulse'), 500);
        },
        toggleHelpful(index) {
            const review = this.reviews[index];
            if (!review.helpfulActive) {
                review.helpful++;
                review.helpfulActive = true;
                if (review.unhelpfulActive) {
                    review.unhelpful--;
                    review.unhelpfulActive = false;
                }
            } else {
                review.helpful--;
                review.helpfulActive = false;
            }
        },
        toggleUnhelpful(index) {
            const review = this.reviews[index];
            if (!review.unhelpfulActive) {
                review.unhelpful++;
                review.unhelpfulActive = true;
                if (review.helpfulActive) {
                    review.helpful--;
                    review.helpfulActive = false;
                }
            } else {
                review.unhelpful--;
                review.unhelpfulActive = false;
            }
        },
        formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            });
        }
    }
};
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: linear-gradient(to bottom, #f3f4f6, #e5e7eb);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #f59e0b, #ea580c);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #d97706, #c2410c);
}

/* Animations */
@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-5px);
    }
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

/* Custom focus styles */
input:focus, textarea:focus, select:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Smooth transitions */
* {
    transition: all 0.2s ease-in-out;
}

/* Gradient text */
.gradient-text {
    background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
    .flex-col.lg\:flex-row {
        flex-direction: column;
    }
    
    .lg\:w-2\/3, .lg\:w-1\/3 {
        width: 100%;
    }
}

@media (max-width: 640px) {
    .p-8 {
        padding: 1.5rem;
    }
    
    .text-3xl, .text-4xl {
        font-size: 1.875rem;
    }
    
    .grid-cols-2.md\:grid-cols-4 {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Hover effects */
.hover-lift:hover {
    transform: translateY(-4px);
}

/* Loading skeleton animation */
@keyframes shimmer {
    0% {
        background-position: -1000px 0;
    }
    100% {
        background-position: 1000px 0;
    }
}

.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
}
</style>