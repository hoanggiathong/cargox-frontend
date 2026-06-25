export interface ChatMessage {
  _id?: string

  orderId: string

  senderId: string | {
    _id: string
    fullName: string
  }

  receiverId: string

  message: string

  createdAt?: string
}