import request from '@/utils/request'
import md5 from 'md5';

export function register(user) {
  const { account, password } = user
  return request({
    url: '/user/register',
    method: 'post',
    data: { account: account.trim(), password: md5(password) }
  })
}

// 登录成功后生成一个token
export function login(user) {
  const { account, password } = user
  return request({
    url: '/user/login',
    method: 'post',
    headers: { "axios-return" : "whole-response" },
    data: { account: account.trim(), password: md5(password) }
  })
}

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function getSecurityKey(password) {
  return request({
    url: '/user/sk',
    method: 'post',
    data : {password : md5(password)}
  })
}

export function updatePassword(updatePwdInfo) {
  const { password, newPassword } = updatePwdInfo
  return request({
    url: '/user/updpwd',
    method: 'post',
    data : {password : md5(password), newPassword : md5(newPassword)}
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
