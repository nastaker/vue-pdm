import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function ({ http, store, message }) {

  const Router = new VueRouter({
    routes
  })
  
  Router.beforeEach((to, from, next) => {
    //未登录时强制跳转回登录页面
    let user = store.getters['user/getUser']
    if (to.path.indexOf('/login') < 0) {
      if (!user) {
        // next({path: '/login'})
        // return
      } else {
        if (to.path.indexOf('/test/view') >= 0) {
          next()
        } else if (to.path.indexOf('/test/start') >= 0) {
          next()
        } else if (to.path.indexOf('/valid') >= 0) {
          next()
        } else {
          // 获取考试信息，如果有考试信息，直接进入对应考试
          http.get('/exam/getExam/' + user.userguid)
            .then(function(response){
              if (typeof(response.data) === 'object') {
                let result = response.data
                message('您有正在进行中的考试，已为您自动跳转到对应考试页面')
                if (result.Type === '测稿编绘') {
                  store.commit('exam/clearGroupUser')
                  next({path: '/test/start', query: {
                    buildId: result.BuildId
                  }})
                  return
                } else if (result.Type === '虚拟测量') {
                  next({path: '/test/start2'})
                  return
                }
              }
            })
        }
      }
    }
    next()
  })
  return Router
}
