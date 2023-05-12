import type { Router } from 'vue-router'
import { useAuthStoreWithout } from '@/store/modules/auth'

// 白名单
const whiteBlankList = ['/login', '/register']

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStoreWithout()
    if (!authStore.token) {
      if (!whiteBlankList.includes(to.path))
        next('/login')

      else
        next()
    }
    else {
      if (whiteBlankList.includes(to.path))
        next('/')

      else
        next()
    }
  })
}
