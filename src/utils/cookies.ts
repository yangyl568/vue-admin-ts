import Cookies from 'js-cookie'

// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus)

const languageKey = 'language'
export const getLanguage = () => Cookies.get(languageKey)
export const setLanguage = (language: string) => Cookies.set(languageKey, language)

const sizeKey = 'size'
export const getSize = () => Cookies.get(sizeKey)
export const setSize = (size: string) => Cookies.set(sizeKey, size)

// User
const tokenKey = 'admin_access_token'
export const getToken = () => Cookies.get(tokenKey)
export const setToken = (token: string) => {
  const inFifteenMinutes = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
  Cookies.set(tokenKey, token, { expires: inFifteenMinutes })
}
export const removeToken = () => Cookies.remove(tokenKey)

/**
 * @description 存储 cookie 值
 * @param {String} name cookie name
 * @param {String} value cookie value
 * @param {Object} days cookie 有效期几天
 */
export function setCookies(name: string, value: object, days?: number) {
  days = days || 30
  const inFifteenMinutes = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000)
  Cookies.set(`tsadmin-${name}`, value, { expires: inFifteenMinutes })
}

/**
 * @description 拿到 cookie 值
 * @param {String} name cookie name
 */
export function getCookies(name: string) {
  return Cookies.getJSON(`tsadmin-${name}`)
}

/**
 * @description 删除 cookie
 * @param {String} name cookie name
 */
export function removeCookies(name: string) {
  return Cookies.remove(`tsadmin-${name}`)
}

/**
 * @description 存储 localStorage 值
 * @param {String} name  name
 * @param {String} value  value
 */
export function setLocalStorage(name: string, value: string) {
  localStorage.setItem(`tsadmin-${name}`, value)
}

/**
 * @description 获取 localStorage 值
 * @param {String} name name
 */
export function getLocalStorage(name: string): any {
  return localStorage.getItem(`tsadmin-${name}`)
}

/**
 * @description 删除 LocalStorage
 * @param {String} name name
 */
export function removeLocalStorage(name: string) {
  return localStorage.removeItem(`tsadmin-${name}`)
}
