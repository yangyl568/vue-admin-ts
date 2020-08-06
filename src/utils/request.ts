import axios from 'axios'
import { Message } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import router from '@/router'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000
  // withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    if (UserModule.token) {
      config.headers.Authorization = 'Bearer test_token' // + UserModule.token
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.errno !== 0) {
      return Promise.reject(new Error(res.errmsg || 'Error'))
    } else {
      return response.data
    }
  },
  (error) => {
    console.log('error:::', error)
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误'
          break
        case 401:
          error.message = '未授权,请登录'
          break
        case 403:
          error.message = '拒绝访问,请登录'
          UserModule.LogOut()
          router.push({
            name: 'login'
          })
          break
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器内部错误'
          break
        case 501:
          error.message = '服务未实现'
          break
        case 502:
          error.message = '网关错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网关超时'
          break
        case 505:
          error.message = 'HTTP版本不受支持'
          break
        case 100:
          error.message = '该用户权限不够'
          break
        default:
          break
      }
    }
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
