import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const userRoutes: RouteConfig = {
  path: '/user-manage',
  component: Layout,
  redirect: '/user-list',
  name: 'UserManage',
  meta: {
    title: '用户管理',
    icon: 'user',
    alwaysShow: true
  },
  children: [
    {
      path: 'user-list',
      component: () => import(/* webpackChunkName: "user-manage" */ '@/views/user-manage/list.vue'),
      name: 'UserList',
      meta: { title: '用户列表' }
    },
    {
      path: 'user-detail',
      component: () => import('@/views/user-manage/detail.vue'),
      name: 'UserDetail',
      meta: { title: '用户详情', icon: 'documentation', hidden: true }
    }
  ]

}

export default userRoutes
