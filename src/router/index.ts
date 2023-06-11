import { createRouter, createWebHistory } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/posts',
    name: 'posts-list',
    component: () => import('@/components/posts/Posts.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/posts/:id/edit',
    name: 'post-edit',
    component: () => import('@/components/posts/EditPost.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/posts/new',
    name: 'post-new',
    component: () => import('@/components/posts/EditPost.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/pages',
    name: 'pages-list',
    component: () => import('@/components/pages/Pages.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/pages/:id/edit',
    name: 'page-edit',
    component: () => import('@/components/pages/EditPage.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/pages/new',
    name: 'page-new',
    component: () => import('@/components/pages/EditPage.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/auth/Login.vue'),
    meta: {
      auth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
