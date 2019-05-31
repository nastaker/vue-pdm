import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function ({ store }) {

  const Router = new VueRouter({
    routes
  })
  
  Router.beforeEach((to, from, next) => {
    //未登录时强制跳转回登录页面
    if (to.path.indexOf('/login') < 0) {
      if (!store.getters['user/getUser']) {
        next({path: '/login'})
        return
      }
    }
    next()
  })
  return Router
}
