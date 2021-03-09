import Vue from 'vue'
import VueRouter from 'vue-router'
import Default from '@/layout'
Vue.use(VueRouter)

const checkParam = (to, from, next) => {
  if (isNaN(to.params.id)) {
    next(from.path)
  }
  next()
}

const routes = [
  {
    path: '/cat',
    name: 'Cat',
    component: () => import(/* webpackChunkName: "cat" */ '@v/cat/index'),
    meta: { title: 'Cat' }
  },
  {
    path: '/',
    component: Default,
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '@v/home'),
        meta: { title: 'Freeisms', slideBar: true }
      },
      {
        path: '/leetcode',
        name: 'LeetCode',
        props: true,
        component: () => import(/* webpackChunkName: "group-article" */ '@v/article'),
        meta: { title: 'LeetCode', slideBar: true }
      },
      {
        path: '/leetcode/:id',
        name: 'LeetCodeDetail',
        props: true,
        component: () => import(/* webpackChunkName: "group-article" */ '@c/ArticleTemplate'),
        meta: {},
        beforeEnter: checkParam
      },
      {
        path: '/blog',
        name: 'Blog',
        props: true,
        component: () => import(/* webpackChunkName: "group-article" */ '@v/article'),
        meta: { title: 'Blog', slideBar: true }
      },
      {
        path: '/blog/:id',
        name: 'BlogDetail',
        props: true,
        component: () => import(/* webpackChunkName: "group-article" */ '@c/ArticleTemplate'),
        meta: {},
        beforeEnter: checkParam
      },
      {
        path: '*',
        redirect: '/'
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const title = to.meta.title
  title && Vue.prototype.$setTitle(title)

  next()
})

export default router
