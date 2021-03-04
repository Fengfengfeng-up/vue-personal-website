import Vue from 'vue'
import VueRouter from 'vue-router'
import Default from '@/layout'
Vue.use(VueRouter)

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
        meta: { title: 'Freesism', slideBar: true }
      },
      {
        path: '/blog',
        name: 'Blog',
        component: () => import(/* webpackChunkName: "group-blog" */ '@v/blog'),
        meta: { title: 'Blog', slideBar: true }
      },
      {
        path: '/blog/:id',
        name: 'BlogDetail',
        props: true,
        component: () =>
          import(/* webpackChunkName: "group-blog" */ '@v/blog/detail'),
        meta: { slideBar: true }
      },
      {
        path: '/music',
        name: 'Music',
        component: () => import('@v/music/index'),
        meta: { title: 'Music' }
      },
      // {
      //   path: '/work',
      //   name: 'Work',
      //   component: () => import('@v/work/index'),
      //   meta: { title: 'Work' }
      // },
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

  if (['Music'].includes(to.name)) {
    Vue.prototype.$message({ message: '努力筹备中...' })
    next({ path: from.path })
  }

  next()
})

export default router
