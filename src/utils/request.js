import axios from 'axios'
import Vue from 'vue'

const instance = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 3000
})

instance.interceptors.request.use(
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

instance.interceptors.response.use(
  (response) => {
    const res = response.data
    return res
  },
  (error) => {
    const { message, statusCode } = error.response.data
    if (message) {
      Vue.prototype.$message({
        message: Array.isArray(message) ? message[0] : message
      })
    }

    if (statusCode === 401) {
      Vue.prototype.$login()
    }

    return Promise.reject(error)
  }
)

const service = (function() {
  const cache = new Map()

  const extractParamStr = (param) => {
    if (typeof param === 'object' && !Object.is(param, null)) {
      const temp = Array.isArray(param) ? param : Object.values(param)
      return temp.reduce((p, c) => p + extractParamStr(c), '')
    } else return '' + param
  }

  return async function(...data) {
    const key = extractParamStr(data)
    const needCache = data[data.length - 1]

    if (!cache.has(key)) {
      const res = await instance.apply(null, data)
      if (needCache === false) return res

      cache.size > 10 && cache.clear()
      cache.set(key, res)
      return res
    }

    return cache.get(key)
  }
})()

export default service
