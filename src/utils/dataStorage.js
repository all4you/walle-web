import Cookies from 'js-cookie'

const useCookie = true;
const tokenKey = 'walle_token_key'
const userInfoKey = 'walle_user_key'

export function getToken() {
  return useCookie ? Cookies.get(tokenKey) : localStorage.getItem(tokenKey)
}

export function setToken(token) {
  return useCookie ? Cookies.set(tokenKey, token) : localStorage.setItem(tokenKey, token)
}

export function removeToken() {
  return useCookie ? Cookies.remove(tokenKey) :  localStorage.removeItem(tokenKey)
}

export function getUserInfo() {
  return useCookie ? Cookies.getJSON(userInfoKey) : localStorage.getItem(userInfoKey)
}

export function setUserInfo(userInfo) {
  return useCookie ? Cookies.set(userInfoKey, userInfo) : localStorage.setItem(userInfoKey, userInfo)
}

export function removeUserInfo() {
  return useCookie ? Cookies.remove(userInfoKey)  : localStorage.removeItem(userInfoKey)
}
