import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
import settings from './settings'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

const getPageTitle = (key: string) => {
  return `${key} - ${settings.title}`
}

router.beforeEach(async(to: Route, _: Route, next: any) => {
  // Start progress bar
  NProgress.start()

  // 确定用户是否已经登录
  if (UserModule.token) {
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 检查用户是否已获得其权限角色
      if (UserModule.roles.length === 0) {
        try {
          // 注意:角色必须是一个对象数组!例如:['admin']或['developer'， 'editor']
          await UserModule.GetUserInfo()
          const roles = UserModule.roles
          // 根据角色生成可访问路线图
          PermissionModule.GenerateRoutes(roles)
          // 动态添加访问路线
          router.addRoutes(PermissionModule.dynamicRoutes)
          // Hack: ensure addRoutes is complete
          // 设置replace: true，这样导航将不会留下历史记录
          next({ ...to, replace: true })
        } catch (err) {
          // 删除令牌并重定向到登录页面
          UserModule.ResetToken()
          Message.error(err || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      } else {
        next()
      }
    }
  } else {
    // Has no token
    if (whiteList.indexOf(to.path) !== -1) {
      // In the free login whitelist, go directly
      next()
    } else {
      // Other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to: Route) => {
  // Finish progress bar
  // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
  NProgress.done()

  // set page title
  document.title = getPageTitle(to.meta.title)
})
