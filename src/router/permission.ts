import type { Router } from 'vue-router'
import { getToken } from '@/store/modules/auth/helper'

// 白名单
const whiteBlankList = ['/login', '/register']

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const token = getToken()
    if (!token) {
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
