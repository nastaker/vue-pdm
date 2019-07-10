import Vue from 'vue'
import Vuex from 'vuex'

import user from './module-user'
import exam from './module-exam'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      user,
      exam
    }
  })

  return Store
}
