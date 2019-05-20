import axios from 'axios'

export default ({ Vue, router, store, message }) => {
  let http = axios.create({
    baseURL: process.env.VUE_APP_API,
    withCredentials: true
    // timeout: 3000,
  })
  // 添加请求拦截器
  http.interceptors.request.use(function (config) {
    let user = store.getters['user/getUser']
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  })
  // 添加响应拦截器
  http.interceptors.response.use(function (response) {
    let result = response.data
    let errMsg = result.msg
    if (result.code !== '0' || errMsg) {
      const err = new Error(errMsg) 
      err.data = errMsg
      err.response = response 
      message({
        message: errMsg,
        type: 'error'
      })
      if (result.code !== '0') {
        return Promise.reject(err)
      }
    }
    response.data = result.obj
    return response
  }, function (error) {
    let errMsg = ''
    if (error && error.response) {
      if (error.response.status === 401) {
        // 判断有获取到新token，覆盖老token，重新发起上次的请求
        store.commit('user/removeUser')
        errMsg = '登录信息已失效，请重新登录'
        router.push('/login')
      } else if (error.response.data.error) {
        errMsg = error.response.data.error
      } else if (error.response.data) {
        errMsg = error.response.data
      } else {
        errMsg = '错误代码：' + error.response.status + '，请联系管理'
      }
    } else {
      store.commit('user/removeUser')
      errMsg = '网络出现异常，无法连接服务器'
    }
    message({
      message: errMsg,
      type: 'error'
    })
    return Promise.reject(error)
  })

  Vue.prototype.$http = http
}
