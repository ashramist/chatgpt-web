import { Cloud } from 'laf-client-sdk'
import { useAuthStoreWithout } from '@/store/modules/auth'
import { encrypt } from '@/utils/crypto/index'
const cloud = new Cloud({
  baseUrl: process.env.VITE_APP_LAF_BASE_URL, // 这个地址可以在欢迎页面中的“服务地址”中找到
  getAccessToken: () => '', // 这里不需要授权，先填空
  headers: {
    token: useAuthStoreWithout().token || '',
  },
})
export interface ResponseModel {
  status: string
  ok: boolean
  message: string
  data: any
  requestId: string
}

/**
 * 登录-云函数调用
 * @param params 用户名和密码
 */
export function login(params = { email: '', password: '' }) {
  return cloud.invokeFunction('proxy', { ...params, fc: encrypt('login') })
}

/**
 * 登录-云函数调用
 * @param params 用户名和密码
 */
export function sendCodeByEmail(params = { email: '' }) {
  return cloud.invokeFunction('proxy', { ...params, fc: encrypt('sendEmail') })
}
/**
 * 注册-云函数调用
 * @param params 用户名和密码
 */
export function register(params = { email: '', password: '', code: '' }) {
  return cloud.invokeFunction('proxy', { ...params, fc: encrypt('register') })
}

/**
 * 检索发送-云函数调用
 * @param params 用户名和密码
 */
export function search(params = { prompt: '' }) {
  return cloud.invokeFunction('proxy', { ...params, fc: encrypt('send') })
}

/**
 * 历史记录获取
 */
export function fetchHistoryLogList() {
  return cloud.invokeFunction('proxy', { fc: encrypt('queryHistoryLogList') })
}

/**
 * 聊天
 * @param prompt 客户端发送的聊天内容
 */
export function doChat(params = { prompt: '', parentMessageId: '', conversationId: '' }) {
  return cloud.invokeFunction('proxy', { ...params, fc: encrypt('chat') })
}
