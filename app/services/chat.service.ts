import { createApiClient } from './api'
import type { ChatMessage } from '~/types/chat'

export const chatService = {
  async getMessages(orderId: string): Promise<ChatMessage[]> {
    const api = createApiClient()
    const response = await api.get<ChatMessage[]>(`/orders/${orderId}/messages`)
    return response.data
  },
}