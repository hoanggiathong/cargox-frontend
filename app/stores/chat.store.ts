import { defineStore } from 'pinia'
import { chatService } from '~/services/chat.service'
import type { ChatMessage } from '~/types/chat'

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])
  const loading = ref(false)

  const fetchMessages = async (orderId: string) => {
    loading.value = true

    try {
      messages.value = await chatService.getMessages(orderId)
    } finally {
      loading.value = false
    }
  }

  const addMessage = (message: ChatMessage) => {
    messages.value.push(message)
  }

  const clearMessages = () => {
    messages.value = []
  }

  return {
    messages,
    loading,
    fetchMessages,
    addMessage,
    clearMessages,
  }
})