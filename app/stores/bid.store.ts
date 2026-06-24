import { defineStore } from 'pinia'
import { bidService } from '~/services/bid.service'
import type { Bid, CreateBidPayload } from '~/types/bid'

export const useBidStore = defineStore('bid', () => {
  const orderBids = ref<Bid[]>([])
  const myBids = ref<Bid[]>([])
  const loading = ref(false)

  const createBid = async (orderId: string, payload: CreateBidPayload) => {
    loading.value = true

    try {
      return await bidService.createBid(orderId, payload)
    } finally {
      loading.value = false
    }
  }

  const fetchOrderBids = async (orderId: string) => {
    loading.value = true

    try {
      orderBids.value = await bidService.getOrderBids(orderId)
    } finally {
      loading.value = false
    }
  }

  const fetchMyBids = async () => {
    loading.value = true

    try {
      myBids.value = await bidService.getMyBids()
    } finally {
      loading.value = false
    }
  }

  const acceptBid = async (bidId: string) => {
    loading.value = true

    try {
      return await bidService.acceptBid(bidId)
    } finally {
      loading.value = false
    }
  }

  return {
    orderBids,
    myBids,
    loading,
    createBid,
    fetchOrderBids,
    fetchMyBids,
    acceptBid,
  }
})