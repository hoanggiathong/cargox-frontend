<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { useAuthStore } from '~/stores/auth.store'
import { useChatStore } from '~/stores/chat.store'
import { useSocket } from '~/composables/useSocket'
import type { ChatMessage } from '~/types/chat'

const props = defineProps<{
  orderId: string
  receiverId: string
}>()

const authStore = useAuthStore()
const chatStore = useChatStore()
const messageApi = useMessage()
const { connectSocket } = useSocket()

const text = ref('')
const sending = ref(false)

const getSenderName = (message: ChatMessage) => {
  if (typeof message.senderId === 'string') {
    return message.senderId
  }

  return message.senderId.fullName
}

const isMine = (message: ChatMessage) => {
  const senderId = typeof message.senderId === 'string'
    ? message.senderId
    : message.senderId._id

  return senderId === authStore.user?._id
}

const sendMessage = () => {
  const content = text.value.trim()

  if (!content) {
    messageApi.warning('Vui lòng nhập nội dung tin nhắn')
    return
  }

  if (!authStore.user?._id) {
    messageApi.error('Không xác định được người gửi')
    return
  }

  sending.value = true

  try {
    const socket = connectSocket()

    socket.emit('send_chat_message', {
      orderId: props.orderId,
      senderId: authStore.user._id,
      receiverId: props.receiverId,
      message: content,
    })

    text.value = ''
  } finally {
    sending.value = false
  }
}

onMounted(async () => {
  await chatStore.fetchMessages(props.orderId)

  const socket = connectSocket()

  socket.emit('join_chat_room', props.orderId)

  socket.off(`new_chat_message:${props.orderId}`)
  socket.off('new_chat_message')

  socket.on('new_chat_message', (payload: ChatMessage) => {
    if (payload.orderId !== props.orderId) return
    chatStore.addMessage(payload)
  })
})

onBeforeUnmount(() => {
  const socket = connectSocket()
  socket.off('new_chat_message')
})
</script>

<template>
  <NCard title="Trao đổi với đối tác">
    <div class="chat-box">
      <div
        v-for="item in chatStore.messages"
        :key="item._id || `${item.senderId}-${item.createdAt}-${item.message}`"
        class="chat-row"
        :class="{ mine: isMine(item) }"
      >
        <div class="chat-bubble">
          <div class="chat-sender">
            {{ isMine(item) ? 'Bạn' : getSenderName(item) }}
          </div>

          <div class="chat-message">
            {{ item.message }}
          </div>

          <div class="chat-time">
            {{ item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : 'Vừa xong' }}
          </div>
        </div>
      </div>

      <div v-if="chatStore.messages.length === 0" class="empty-chat">
        Chưa có tin nhắn
      </div>
    </div>

    <div class="chat-input">
      <NInput
        v-model:value="text"
        type="textarea"
        placeholder="Nhập tin nhắn..."
        :autosize="{ minRows: 1, maxRows: 3 }"
        @keyup.enter.exact.prevent="sendMessage"
      />

      <NButton type="primary" :loading="sending" @click="sendMessage">
        Gửi
      </NButton>
    </div>
  </NCard>
</template>

<style scoped>
.chat-box {
  min-height: 280px;
  max-height: 420px;
  overflow-y: auto;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 12px;
}

.chat-row {
  display: flex;
  margin-bottom: 10px;
}

.chat-row.mine {
  justify-content: flex-end;
}

.chat-bubble {
  max-width: 72%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 10px;
}

.chat-row.mine .chat-bubble {
  background: #e0f2fe;
  border-color: #bae6fd;
}

.chat-sender {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #334155;
}

.chat-message {
  white-space: pre-wrap;
  color: #111827;
}

.chat-time {
  font-size: 11px;
  color: #64748b;
  margin-top: 4px;
  text-align: right;
}

.chat-input {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.empty-chat {
  text-align: center;
  color: #64748b;
  padding: 40px 0;
}
</style>