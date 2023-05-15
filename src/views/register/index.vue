<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import {
  NButton,
  NForm,
  NFormItem,
  NInput,
  NInputGroup,
  NSpace,
  NSpin,
  useMessage,
} from 'naive-ui'
import bgPng2 from '@/assets/bg4-1.jpg'
import { t } from '@/locales'
import type { ResponseModel } from '@/api/index_laf'
import { register, sendCodeByEmail } from '@/api/index_laf'
import { md5Encrypt } from '@/utils/crypto'
import { setToken } from '@/store/modules/auth/helper'

const mt = useMessage()
const router = useRouter()
interface LoginModelType {
  username: string
  password: string
  email: string
  code: string
  repeatPassword: string
}

const showLoading = ref(false)
// 获取验证码
const hasFetchCode = ref(false)
const countDownSeconds = ref(60)
const formRef = ref<FormInst | null>(null)

const modelRef = ref<LoginModelType>({
  username: '',
  password: '',
  email: '',
  code: '',
  repeatPassword: '',
})

const codeText = computed(() => {
  return hasFetchCode.value
    ? `${countDownSeconds.value}s 后获取`
    : `${t('login.fetch')}${t('login.code')}`
})

const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function emailRegTest(rule: FormItemRule, value: string): boolean {
  return emailReg.test(value)
}
const fetchEmailCodeBtnDisabled = computed(() => {
  return (
    !modelRef.value.email
    || !emailReg.test(modelRef.value.email)
    || hasFetchCode.value
  )
})

const rules: FormRules = {
  code: [
    {
      required: true,
      message: t('error.email.required'),
    },
    {
      max: 6,
      min: 6,
      message: t('error.code.valid'),
      trigger: ['input'],
    },
  ],
  email: [
    {
      required: true,
      message: t('error.email.required'),
    },
    {
      validator: emailRegTest,
      message: t('error.email.valid'),
      trigger: ['input'],
    },
  ],
  password: [
    {
      required: true,
      message: t('error.password.required'),
    },
    {
      validator(rule: FormItemRule, value: string): boolean {
        return /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*,\._])[0-9a-zA-Z!@#$%^&*,\\._]{8,12}$/.test(
          value,
        )
      },
      message: t('error.password.ruleCheck'),
      trigger: ['input'],
    },
  ],
  repeatPassword: [
    {
      required: true,
      message: t('error.password.required'),
    },
    {
      validator(rule: FormItemRule, value: string): boolean {
        return value.trim() === modelRef.value.password.trim()
      },
      message: t('error.password.repeat'),
      trigger: ['input'],
    },
  ],
}
// 获取验证码
const doFetchCode = async () => {
  if (fetchEmailCodeBtnDisabled.value)
    return
  showLoading.value = true
  const { ok, message }: ResponseModel = await sendCodeByEmail({
    email: modelRef.value.email,
  })
  showLoading.value = false
  if (ok) {
    hasFetchCode.value = true
    const timer = setInterval(() => {
      if (countDownSeconds.value === 0) {
        hasFetchCode.value = false
        timer && clearInterval(timer)
      }
      countDownSeconds.value--
    }, 1000)
    mt.success(message)
  }
  else {
    mt.error(message || '获取失败')
  }
}

// 注册
const doRegister = async () => {
  showLoading.value = true
  const {
    ok,
    message: msg,
    data,
  }: ResponseModel = await register({
    email: modelRef.value.email,
    code: modelRef.value.code,
    password: md5Encrypt(modelRef.value.password),
  })
  if (ok) {
    setToken(data.accessToken)
    mt.success(msg)
    router.replace('/')
  }
  else {
    mt.error(msg || '注册失败')
  }
  showLoading.value = false
}
// 登录form表达提交
const handlerSubmit = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors)
      doRegister()
    else mt.error('验证异常')
  })
}
</script>

<template>
  <div
    class="flex flex-col justify-center min-h-full px-6 py-5 lg:px-8"
    :style="`background-color:#f4f6f8;background-image: url(${bgPng2});background-position:0 -400px; background-size: cover;background-repeat:no-repeat;`"
  >
    <NSpace vertical>
      <NSpin :show="showLoading">
        <div class="p-6 bg-white rounded-md sm:mx-auto sm:w-full sm:max-w-sm">
          <div>
            <img
              class="w-auto h-20 mx-auto"
              src="@/assets/logo.svg"
              alt="Your Company"
            >
            <h2
              class="mt-5 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900"
            >
              {{ t("login.accountRegister") }}
            </h2>
          </div>
          <div>
            <NForm
              ref="formRef"
              :model="modelRef"
              :rules="rules"
              class="space-y-6"
            >
              <NFormItem :label="t('login.email')" path="email">
                <NInputGroup>
                  <NInput
                    v-model:value="modelRef.email"
                    type="text"
                    :placeholder="`${t('login.input')}${t('login.email')}`"
                  />
                  <NButton
                    type="primary"
                    :disabled="fetchEmailCodeBtnDisabled"
                    @click="doFetchCode"
                  >
                    {{ codeText }}
                  </NButton>
                </NInputGroup>
              </NFormItem>
              <NFormItem :label="t('login.codeText')" path="code">
                <NInput
                  v-model:value="modelRef.code"
                  type="text"
                  :placeholder="`${t('login.input')}${t('login.codeText')}`"
                />
              </NFormItem>

              <NFormItem :label="t('login.password')" path="password">
                <NInput
                  v-model:value="modelRef.password"
                  type="password"
                  :placeholder="`${t('login.input')}${t('login.password')}`"
                />
              </NFormItem>
              <NFormItem
                :label="t('login.repeatPassword')"
                path="repeatPassword"
              >
                <NInput
                  v-model:value="modelRef.repeatPassword"
                  type="password"
                  :placeholder="`${t('login.input')}${t(
                    'login.repeatPassword',
                  )}`"
                />
              </NFormItem>

              <div>
                <div
                  class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  @click="handlerSubmit"
                >
                  {{ t("login.signUpBtn") }}
                </div>
              </div>
            </NForm>

            <p class="mt-10 text-sm text-center text-gray-500">
              {{ t("login.hasAccount") }}
              <a
                href="#/login"
                class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >{{ t("login.go") }}{{ t("login.signInBtn") }}</a>
            </p>
          </div>
        </div>
      </NSpin>
    </NSpace>
  </div>
</template>
