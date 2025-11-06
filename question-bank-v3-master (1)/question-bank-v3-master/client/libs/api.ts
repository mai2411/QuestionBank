import { treaty } from '@elysiajs/eden'
import type { app } from '@server'
import { ACCESS_TOKEN_KEY } from '../constants'

export const api = treaty<typeof app>('localhost:3000', {
  onRequest() {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (token) {
      return {
        headers: { Authorization: `Bearer ${token}` }
      }
    }
  }
})
