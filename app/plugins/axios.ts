import axios from 'axios'
import { defineNuxtPlugin, navigateTo } from 'nuxt/app'

export default defineNuxtPlugin(() => {
  const api = axios.create({
    baseURL: '/api' // Будет перехвачено MSW
  })

  api.interceptors.request.use(config => {
    // В браузере (на клиенте) берем токен
    if (import.meta.client) {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  })

  api.interceptors.response.use(
    r => r,
    async error => {
      if (error.response?.status === 401) {
        if (import.meta.client) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
        await navigateTo('/login')
      }
      return Promise.reject(error)
    }
  )

  return {
    provide: { api }
  }
})
