<template>
  <div class="chatbot-container">
    <!-- Chatbot trigger button -->
    <button
      @click="toggleChat"
      class="chatbot-trigger"
      :class="{ 'chat-open': isChatOpen }"
      aria-label="Open chatbot"
    >
      <svg
        v-if="!isChatOpen"
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      <svg
        v-else
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <!-- Chat window -->
    <transition name="slide-up">
      <div
        v-if="isChatOpen"
        class="chat-window"
        :class="{ 'processing': isProcessing }"
      >
        <!-- Chat header -->
        <div class="chat-header">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">AI Assistant</h3>
              <p class="text-sm text-gray-600">Powered by Gemini</p>
            </div>
          </div>
          <button
            @click="toggleChat"
            class="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close chat"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Messages container -->
        <div ref="messagesContainer" class="messages-container">
          <!-- Welcome message -->
          <div v-if="messages.length === 0" class="welcome-message">
            <div class="welcome-content">
              <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Hello! I'm your AI Assistant</h3>
              <p class="text-gray-600 mb-6">Ask me anything! I'm here to help you with questions, ideas, or just chat.</p>
              <div class="quick-questions">
                <button
                  v-for="question in quickQuestions"
                  :key="question"
                  @click="sendQuickQuestion(question)"
                  class="quick-question-btn"
                >
                  {{ question }}
                </button>
              </div>
            </div>
          </div>

          <!-- Chat messages -->
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="message"
            :class="{
              'user-message': message.role === 'user',
              'ai-message': message.role === 'assistant'
            }"
          >
            <div
              class="message-content"
              :class="{
                'bg-gradient-to-r from-blue-600 to-purple-600 text-white': message.role === 'user',
                'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900': message.role === 'assistant'
              }"
            >
              <div class="flex items-start gap-3">
                <div
                  class="message-avatar"
                  :class="{
                    'bg-gradient-to-r from-blue-500 to-purple-600': message.role === 'user',
                    'bg-gradient-to-r from-gray-200 to-gray-300': message.role === 'assistant'
                  }"
                >
                  <svg
                    v-if="message.role === 'user'"
                    class="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <svg
                    v-else
                    class="w-4 h-4 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="message-text" v-html="formatMessage(message.content)"></div>
                  <div class="message-time text-xs opacity-75 mt-1">
                    {{ formatTime(message.timestamp) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="isProcessing" class="typing-indicator">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p class="text-sm text-gray-600 mt-2">AI is thinking...</p>
          </div>
        </div>

        <!-- Input area -->
        <div class="input-container">
          <form @submit.prevent="sendMessage" class="flex gap-2">
            <div class="flex-1 relative">
              <input
                v-model="userInput"
                @keyup.enter="sendMessage"
                :disabled="isProcessing"
                type="text"
                placeholder="Type your message here..."
                class="chat-input"
                :class="{ 'pr-12': userInput }"
              />
              <button
                v-if="userInput"
                @click="clearInput"
                type="button"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear input"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <button
              type="submit"
              :disabled="!userInput.trim() || isProcessing"
              class="send-button"
              :class="{
                'opacity-50 cursor-not-allowed': !userInput.trim() || isProcessing,
                'hover:shadow-lg': userInput.trim() && !isProcessing
              }"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
          
          <!-- Disclaimer -->
          <p class="text-xs text-gray-500 mt-3 text-center">
            Powered by Google Gemini AI. Responses may not always be accurate.
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

// Add your Gemini API key here
const GEMINI_API_KEY = 'You api key' // Replace with your actual API key from https://makersuite.google.com/app/apikey
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

// Reactive state
const isChatOpen = ref(false)
const userInput = ref('')
const messages = ref([])
const isProcessing = ref(false)
const messagesContainer = ref(null)

// Quick questions suggestions
const quickQuestions = ref([
  'Suggest shopping items for me',
  'low price products for home',
  'whats the best suited fashion for summer?',
  'Recommend some gadgets under $100',
])

// Initialize with a welcome message
onMounted(() => {
  // Messages will be fresh for every session
})

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value
  if (isChatOpen.value) {
    // Scroll to bottom when opening
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isProcessing.value) return

  const userMessage = {
    role: 'user',
    content: userInput.value.trim(),
    timestamp: new Date()
  }
  
  messages.value.push(userMessage)
  const messageToSend = userInput.value.trim()
  userInput.value = ''
  
  // Scroll to bottom
  scrollToBottom()
  
  // Get AI response
  await getAIResponse(messageToSend)
}

const sendQuickQuestion = (question) => {
  userInput.value = question
  sendMessage()
}

const clearInput = () => {
  userInput.value = ''
}

const getAIResponse = async (userMessage) => {
  isProcessing.value = true
  
  try {
    // Check if API key is set
    if (GEMINI_API_KEY === 'YOUR_ACTUAL_API_KEY_HERE') {
      throw new Error('Please set your Gemini API key in the component')
    }

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: userMessage
          }]
        }]
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('API Error:', errorData)
      throw new Error(errorData?.error?.message || 'Failed to get response from Gemini')
    }

    const data = await response.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I could not generate a response.'

    messages.value.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    })
    
  } catch (error) {
    console.error('Error getting AI response:', error)
    messages.value.push({
      role: 'assistant',
      content: `Sorry, I encountered an error: ${error.message}. Please check your API key and try again.`,
      timestamp: new Date()
    })
  } finally {
    isProcessing.value = false
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const formatMessage = (text) => {
  // Simple formatting for URLs and basic markdown
  return text
    .replace(/\n/g, '<br>')
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="underline text-blue-400 hover:text-blue-300">$1</a>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
}

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<style >
.chatbot-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9999;
}

.chatbot-trigger {
  @apply w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95;
  
  &.chat-open {
    @apply rotate-90;
  }
}

.chat-window {
  @apply absolute bottom-20 right-0 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200;
  
  &.processing::after {
    content: '';
    @apply absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent animate-pulse pointer-events-none;
  }
}

.chat-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100;
}

.messages-container {
  @apply flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-gray-50/50;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    @apply bg-gray-100 rounded-full;
  }
  
  &::-webkit-scrollbar-thumb {
    @apply bg-gradient-to-b from-blue-400 to-purple-500 rounded-full;
  }
}

.welcome-message {
  @apply text-center py-8;
}

.welcome-content {
  @apply max-w-xs mx-auto;
}

.quick-questions {
  @apply flex flex-wrap gap-2 justify-center;
}

.quick-question-btn {
  @apply px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-lg text-sm hover:from-blue-100 hover:to-purple-100 transition-all duration-200 border border-gray-200 hover:border-blue-300;
}

.message {
  @apply animate-fade-in;
}

.message-content {
  @apply rounded-2xl p-4 max-w-[85%] shadow-sm;
  
  &.user-message {
    @apply ml-auto;
  }
  
  &.ai-message {
    @apply mr-auto;
  }
}

.message-avatar {
  @apply w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1;
}

.message-text {
  @apply leading-relaxed;
  
  :deep(a) {
    @apply underline text-blue-400 hover:text-blue-300 transition-colors;
  }
  
  :deep(strong) {
    @apply font-bold;
  }
  
  :deep(em) {
    @apply italic;
  }
}

.message-time {
  @apply text-right;
}

.user-message .message-time {
  @apply text-blue-100;
}

.ai-message .message-time {
  @apply text-gray-500;
}

.typing-indicator {
  @apply flex flex-col items-center py-4;
}

.typing-dots {
  @apply flex space-x-1;
  
  span {
    @apply w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full;
    animation: bounce 1.4s infinite ease-in-out both;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
}

.input-container {
  @apply p-4 border-t border-gray-200 bg-white;
}

.chat-input {
  @apply w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200;
}

.send-button {
  @apply w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md;
}

/* Animations */
@keyframes bounce {
  0%, 80%, 100% { 
    transform: scale(0);
  }
  40% { 
    transform: scale(1.0);
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 640px) {
  .chatbot-container {
    bottom: 1rem;
    right: 1rem;
  }
  
  .chat-window {
    width: calc(100vw - 2rem);
    height: 80vh;
    right: 0;
    bottom: 5rem;
  }
}
</style>