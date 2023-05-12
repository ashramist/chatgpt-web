import CryptoJS from 'crypto-js'

const CryptoSecret = 'EE210C0C7CB8A7AA'

export function enCrypto(data: any) {
  const str = JSON.stringify(data)
  return CryptoJS.AES.encrypt(str, CryptoSecret).toString()
}

export function deCrypto(data: string) {
  const bytes = CryptoJS.AES.decrypt(data, CryptoSecret)
  const str = bytes.toString(CryptoJS.enc.Utf8)

  if (str)
    return JSON.parse(str)

  return null
}

function _getUTF8Code(str: string) {
  return CryptoJS.enc.Utf8.parse(str)
}
// 加密
export function encrypt(word: string) {
  const key = _getUTF8Code(CryptoSecret)
  const srcs = _getUTF8Code(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return encrypted.toString()
}
// 解密
export function decrypt(word: string) {
  const key = _getUTF8Code(CryptoSecret)
  const decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

/**
 * md5加密
 * @param {*} md5Str
 */
export function md5Encrypt(md5Str: string) {
  return CryptoJS.MD5(md5Str).toString()
}
