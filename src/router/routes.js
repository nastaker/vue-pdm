const routes = [
  {
    path: '/login', component: () => import('@/pages/Login.vue')
  },
  {
    path: '/register', component: () => import('@/pages/Register.vue')
  },
  {
    path: '/valid', component: () => import('@/page-test/Valid.vue')
  },
  {
    path: '/helloworld', component: () => import('@/pages/HelloWorld.vue')
  },
  {
    path: '/test',
    component: () => import('@/page-test/Index.vue'),
    children: [
      {
        path: 'select', component: () => import('@/page-test/SelectExam.vue')
      },
      {
        path: 'enter/:id?', component: () => import('@/page-test/Enter.vue')
      },
      {
        path: 'end', component: () => import('@/page-test/End.vue')
      },
      {
        path: 'intro', component: () => import('@/page-test/Intro.vue')
      },
      {
        path: 'intro2', component: () => import('@/page-test/Intro2.vue')
      },
      {
        path: 'mark/:id', component: () => import('@/page-test/Mark.vue'),
        children: [
          {
            path: 'table',
            component: () => import('@/page-test/Table.vue')
          },
          {
            path: 'picture/:type',
            component: () => import('@/page-test/Picture.vue')
          }
        ]
      },
      {
        path: 'view/:id', component: () => import('@/page-test/View.vue'),
        children: [
          {
            path: 'table',
            component: () => import('@/page-test/Table.vue')
          },
          {
            path: 'picture/:type',
            component: () => import('@/page-test/Picture.vue')
          }
        ]
      },
      {
        path: 'start', component: () => import('@/page-test/Start.vue'),
        children: [
          {
            path: 'table',
            component: () => import('@/page-test/Table.vue')
          },
          {
            path: 'picture/:type',
            component: () => import('@/page-test/Picture.vue')
          }
        ]
      },
      {
        path: 'view2/:id', component: () => import('@/page-test/View2.vue'),
        meta: {
          keepAlive: true // 需要被缓存
        },
        children: [
          {
            path: 'tool',
            component: () => import('@/page-test/ToolSelect.vue')
          }
        ]
      },
      {
        path: 'start2', component: () => import('@/page-test/Start2.vue'),
        meta: {
          keepAlive: true // 需要被缓存
        },
        children: [
          {
            path: 'tool',
            component: () => import('@/page-test/ToolSelect.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/pages/Index.vue'),
    children: [
      {
        path: '/test', component: () => import('@/page-test/Enter.vue')
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
