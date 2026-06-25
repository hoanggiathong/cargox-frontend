import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const useSocket = () => {
  const config = useRuntimeConfig()

  const connectSocket = () => {
    if (socket) return socket

    socket = io(config.public.socketUrl || 'http://localhost:3000', {
      transports: ['websocket'],
    })

    return socket
  }

  const getSocket = () => socket

  return {
    connectSocket,
    getSocket,
  }
}