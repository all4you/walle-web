import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getUserInfo } from '@/utils/dataStorage' // get token from cookie
import getPageTitle from '@/utils/getPageTitle'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/register', '/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // 查看是否已有token来判断是否登录过
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已经登录，跳转到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 先从内存中获取用户信息
      let userInfo = store.getters.userInfo
      if (!userInfo) {
        // 内存中获取不到再从本地获取
        userInfo = getUserInfo();
        // 然后再将数据回写到内存中
        store.dispatch('user/setUserInfoAction', userInfo);
      }
      if (userInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getUserInfoAction')
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetTokenAction')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 如果没有登录过，过滤白名单 */
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
