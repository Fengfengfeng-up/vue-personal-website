import axios from 'axios'
import Vue from 'vue'

const service = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 5000
})

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = 'Bearer ' + JSON.parse(token)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const res = response.data
    return res
  },
  (error) => {
    const { message, statusCode } = error.response.data
    if (message) {
      Vue.prototype.$message({ message })
    }

    if (statusCode === 401) {
      Vue.prototype.$login()
    }

    return Promise.reject(error)
  }
)

export default service
