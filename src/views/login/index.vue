<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import { NForm, NFormItem, NInput, NSpace, NSpin, useMessage } from 'naive-ui'
import bgPng2 from '@/assets/bg4-1.jpg'
import { t } from '@/locales'
import type { ResponseModel } from '@/api/index_laf'
import { login } from '@/api/index_laf'
import { md5Encrypt } from '@/utils/crypto'
import { useAuthStoreWithout } from '@/store/modules/auth'

const message = useMessage()
const router = useRouter()
interface LoginModelType {
  password: string
  email: string
}
const formRef = ref<FormInst | null>(null)

const modelRef = ref<LoginModelType>({
  password: '',
  email: '',
})
const showLoading = ref(false)
function emailRegTest(rule: FormItemRule, value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
const rules: FormRules = {
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
  ],
}

// 登录
const doLogin = async () => {
  showLoading.value = true
  const {
    ok,
    message: msg,
    data,
  }: ResponseModel = await login({
    email: modelRef.value.email,
    password: md5Encrypt(modelRef.value.password),
  })
  if (ok) {
    const authStore = useAuthStoreWithout()
    authStore.setToken(data.accessToken)
    message.success(msg)
    router.replace('/')
  }
  else {
    message.error(msg || '登录失败')
  }
  showLoading.value = false
}
// 登录form表达提交
const onDoLogin = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors)
      doLogin()
    else message.error('验证失败')
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
              alt="花绮少女工作室"
            >
            <h2
              class="mt-5 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900"
            >
              {{ t("login.accountLogin") }}
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
                <NInput
                  v-model:value="modelRef.email"
                  type="text"
                  :placeholder="`${t('login.input')}${t('login.email')}`"
                />
              </NFormItem>
              <NFormItem :label="t('login.password')" path="password">
                <NInput
                  v-model:value="modelRef.password"
                  type="password"
                  :placeholder="`${t('login.input')}${t('login.password')}`"
                />
                <!-- <div class="absolute right-0 mt-5 text-sm -top-12">
                  <a
                    href="#/forgetPwd"
                    class="font-semibold text-indigo-600 hover:text-indigo-500"
                  >{{ t("login.forgetPwd") }}</a>
                </div> -->
              </NFormItem>
              <div>
                <div
                  class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  @click="onDoLogin"
                  @keyup.enter="onDoLogin"
                >
                  {{ t("login.signInBtn") }}
                </div>
              </div>
            </NForm>

            <p class="mt-10 text-sm text-center text-gray-500">
              {{ t("login.noAccount") }}
              <a
                href="#/register"
                class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >{{ t("login.go") }}{{ t("login.signUpBtn") }}</a>
            </p>
          </div>
        </div>
      </NSpin>
    </NSpace>
  </div>
</template>
