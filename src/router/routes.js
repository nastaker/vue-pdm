const routes = [
  {
    path: '/helloworld', component: () => import('@/pages/HelloWorld.vue')
  },
  {
    path: '/login', component: () => import('@/pages/Login.vue')
  },
  {
        path: '/',
        component: () => import('@/pages/Index.vue'),
        children: [
          {
            path: '/test', component: () => import('@/components/custom/Explorer.vue')
          },
          {
            path: '/listpage/:pageid',
            component: () => import('@/pages/ListPage.vue')
          }
        ]
  },
  {
    path: '/detail',
    component: () => import('@/pages/ProjectDetail.vue')
  },
  {
    path: '/view',
    component: () => import('@/pages/Frame.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('@/pages/Error404.vue')
  })
}

export default routes
