import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
    status: ''
  }),

  getters: {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
    currentUser: state => state.user
  },

  actions: {
    async login({ username, password }) {
      this.status = 'loading'
      try {
        const response = await axios.post('http://localhost:1337/api/auth/local', {
          identifier: username,
          password: password
        })

        const token = response.data.jwt
        const user = response.data.user

        localStorage.setItem('token', token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        this.token = token
        this.user = user
        this.status = 'success'
      } catch (error) {
        this.status = 'error'
        this.token = null
        this.user = null
        localStorage.removeItem('token')
        throw error
      }
    },

    logout() {
      this.status = ''
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  }
})