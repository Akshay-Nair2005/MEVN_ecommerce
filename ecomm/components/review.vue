<template>
    <div class="min-h-screen bg-gradient-to-br bg-transparent p-4 md:p-8">
        <div class="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
            <!-- Left Column: Product Info & Reviews -->
            <div class="lg:w-2/3">
                <!-- Product Info Card -->
                <div v-if="selectedProduct" class="bg-transparent rounded-2xl shadow-lg p-6 mb-6 border border-black dark:border-gray-200">
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
                                    <h2 class="text-2xl font-bold text-black dark:text-white">{{ selectedProduct.title }}</h2>
                                    <p class="text-black dark:text-white mt-2">{{ selectedProduct.description || 'No description available' }}</p>
                                </div>
                                <div class="text-right">
                                    <div class="text-3xl font-bold text-black dark:text-white">₹{{ selectedProduct.price ? selectedProduct.price.toFixed(2) : '0.00' }}</div>
                                    <div class="flex items-center mt-2">
                                        <div class="flex">
                                            <div v-for="i in 5" :key="i" class="w-5 h-5">
                                                <svg :class="i <= (selectedProduct.rating?.rate || 0) ? 'text-amber-500' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <span class="ml-2 text-gray-600">({{ reviewCount }})</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Product Stats -->
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-black">
                                <div class="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                                    <div class="text-xl font-bold text-black">{{ reviews.length }}</div>
                                    <div class="text-sm text-gray-600">Total Reviews</div>
                                </div>
                                <div class="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                                    <div class="text-xl font-bold text-black">{{ helpfulReviews }}</div>
                                    <div class="text-sm text-gray-600">Helpful Reviews</div>
                                </div>
                                <div class="text-center p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                                    <div class="text-xl font-bold text-black">{{ averageRating }}</div>
                                    <div class="text-sm text-gray-600">Avg Rating</div>
                                </div>
                                <div class="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                                    <div class="text-xl font-bold text-black">{{ verifiedPurchases }}</div>
                                    <div class="text-sm text-gray-600">Verified Buyers</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- No Product Selected -->
                <div v-else class="bg-transparent rounded-2xl shadow-lg p-12 mb-6 border border-black dark:border-gray-200 text-center">
                    <p class="text-gray-500 text-lg">Please select a product to view reviews</p>
                </div>

                <!-- Reviews List -->
                <div class="bg-transparent rounded-2xl shadow-lg p-6 border border-black dark:border-gray-200">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold text-black dark:text-white">Customer Reviews ({{ reviewCount }})</h3>
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

                    <!-- Loading state -->
                    <div v-if="loading.reviews" class="space-y-6">
                        <div v-for="i in 3" :key="i" class="skeleton h-32 rounded-xl"></div>
                    </div>
                    
                    <!-- Error state -->
                    <div v-else-if="errors.reviews" class="text-center py-12">
                        <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p class="text-red-500 text-lg mb-2">{{ errors.reviews }}</p>
                        <button @click="fetchReviews" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Retry</button>
                    </div>
                    
                    <!-- Empty state -->
                    <div v-else-if="filteredReviews.length === 0" class="text-center py-12">
                        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                        </svg>
                        <p class="text-gray-500 text-lg">No reviews yet</p>
                        <p class="text-gray-400 text-sm mt-2">Be the first to review this product!</p>
                    </div>

                    <!-- Reviews -->
                    <div v-else class="space-y-6">
                        <div 
                            v-for="(review, index) in filteredReviews" 
                            :key="review._id || index" 
                            class="bg-gradient-to-r  rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-black dark:border-gray-100 p-5"
                        >
                            <!-- Review Header -->
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {{ review.author.charAt(0) }}
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-black dark:text-white">{{ review.author }}</h4>
                                        <div class="flex items-center space-x-2 mt-1">
                                            <div class="flex">
                                                <div v-for="i in 5" :key="i" class="w-4 h-4">
                                                    <svg :class="i <= review.rating ? 'text-amber-500' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <span class="text-sm text-black dark:text-white">{{ formatDate(review.date) }}</span>
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
                                <h5 class="font-semibold text-black dark:text-white mb-2">{{ review.title }}</h5>
                                <p class="text-black dark:text-white leading-relaxed">{{ review.content }}</p>
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
                                    class="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-black dark:border-gray-200 ml-12"
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

            <!-- Right Column: Add Review -->
            <div class="lg:w-1/3">
                <!-- Add Review Form -->
                <div class="sticky top-8 bg-transparent rounded-2xl shadow-xl border border-black dark:border-gray-200 p-6">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold text-black dark:text-white">Write a Review</h2>
                        <p class="text-gray-600 dark:text-white mt-2">Share your experience with this product</p>
                    </div>

                    <form @submit.prevent="submitReview" class="space-y-4">
                        <!-- Rating -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
                                Your Rating
                            </label>
                            <div class="flex space-x-3">
                                <button
                                    v-for="star in 5"
                                    :key="star"
                                    type="button"
                                    @click="newReview.rating = star"
                                    class="w-12 h-12 rounded-xl flex  items-center justify-center transition-all duration-200 hover:scale-110"
                                    :class="star <= newReview.rating 
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white  text transform scale-110' 
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
                            <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">
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
                            <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">
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
                            <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">
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
                            <label for="verifiedPurchase" class="text-sm text-gray-700 dark:text-white">
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
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    data() {
        return {
            reviews: [],
            newReview: {
                title: "",
                author: "",
                rating: 0,
                content: "",
                verified: false
            },
            filters: ["All", "5 Stars", "4 Stars", "3 Stars", "Verified"],
            activeFilter: "All",
            loading: {
                reviews: false,
                submitting: false
            },
            errors: {
                reviews: null,
                submit: null
            },
            currentUser: null
        };
    },
    props: {
        product: {
            type: Object,
            required: true
        }
    },
    mounted(){
        this.setupAuth();
        if (this.product) {
            this.fetchReviews();
        }
    },
    watch: {
        product: {
            handler(newProduct) {
                if (newProduct) {
                    this.fetchReviews();
                }
            },
            immediate: true
        }
    },
    computed: {
        selectedProduct() {
            return this.product;
        },
        averageRating() {
            if (this.reviews.length === 0) return 0;
            const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
            return (sum / this.reviews.length).toFixed(1);
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
        },
        reviewCount() {
            return this.reviews.length;
        }
    },
    
    methods: {
        setupAuth() {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                this.currentUser = user;
                if (user) {
                    this.newReview.author = user.displayName || user.email || "";
                }
            });
        },
        
        async fetchReviews() {
            if (!this.selectedProduct) return;
            
            this.loading.reviews = true;
            this.errors.reviews = null;
            
            try {
                const data = await $fetch(`http://localhost:2500/server/ecommerce/GetReviews/${this.selectedProduct.id}`);
                this.reviews = Array.isArray(data) ? data.map(review => ({
                    ...review,
                    helpfulActive: false,
                    unhelpfulActive: false,
                    date: review.createdAt ? new Date(review.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
                })) : [];
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
                this.errors.reviews = "Failed to load reviews. Please try again later.";
                this.reviews = [];
            } finally {
                this.loading.reviews = false;
            }
        },
        
        async submitReview() {
            if (!this.newReview.title.trim() || 
                !this.newReview.author.trim() || 
                !this.newReview.content.trim()) {
                alert("Please fill in all required fields.");
                return;
            }
            
            if (!this.selectedProduct) {
                alert("Please select a product first.");
                return;
            }
            
            this.loading.submitting = true;
            this.errors.submit = null;
            
            try {
                const reviewData = {
                    productId: this.selectedProduct.id,
                    uid: this.currentUser?.uid || null,
                    author: this.newReview.author,
                    rating: this.newReview.rating,
                    title: this.newReview.title,
                    content: this.newReview.content,
                    verified: this.newReview.verified
                };
                
                const response = await $fetch('http://localhost:2500/server/ecommerce/AddReview', {
                    method: 'POST',
                    body: reviewData
                });
                
                // Reset form
                this.newReview = {
                    title: "",
                    author: this.currentUser?.displayName || this.currentUser?.email || "",
                    rating: 0,
                    content: "",
                    verified: false
                };
                
                // Refresh reviews
                await this.fetchReviews();
                
                // Success animation
                const submitBtn = document.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.classList.add('animate-pulse');
                    setTimeout(() => submitBtn.classList.remove('animate-pulse'), 500);
                }
                
                alert("Review submitted successfully!");
            } catch (error) {
                console.error("Failed to submit review:", error);
                this.errors.submit = "Failed to submit review. Please try again.";
                alert("Failed to submit review. Please try again.");
            } finally {
                this.loading.submitting = false;
            }
        },
        
        async toggleHelpful(index) {
            const review = this.filteredReviews[index];
            if (!review._id) return;
            
            try {
                const wasActive = review.helpfulActive;
                const increment = !wasActive;
                
                await $fetch(`http://localhost:2500/server/ecommerce/UpdateReviewHelpful/${review._id}`, {
                    method: 'PUT',
                    body: { type: 'helpful', increment }
                });
                
                if (!wasActive) {
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
            } catch (error) {
                console.error("Failed to update helpful count:", error);
            }
        },
        
        async toggleUnhelpful(index) {
            const review = this.filteredReviews[index];
            if (!review._id) return;
            
            try {
                const wasActive = review.unhelpfulActive;
                const increment = !wasActive;
                
                await $fetch(`http://localhost:2500/server/ecommerce/UpdateReviewHelpful/${review._id}`, {
                    method: 'PUT',
                    body: { type: 'unhelpful', increment }
                });
                
                if (!wasActive) {
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
            } catch (error) {
                console.error("Failed to update unhelpful count:", error);
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