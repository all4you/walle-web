import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/dataStorage'
import md5 from 'md5';

const baseUrl = process.env.NODE_ENV == 'development'
  ? 'http://127.0.0.1:7001/walle'
  : '/walle';

// create an axios instance
const service = axios.create({
  baseURL: baseUrl, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request 请求拦截器，在请求发送之前调用
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // 在请求头中加入 ['walle-token']
      let token = getToken()
      config.headers['walle-token'] = token
    }
    let time = new Date().getTime();
    config.headers['t'] = time;
    config.headers['tq'] = md5(time);
    return config
  },
  error => {
    // do something with request error
    console.log('request preHandle error:', error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */
  response => {
    let config = response.config;
    const res = response.data;
    // 3002: token失效
    if (res.errorCode === 3002) {
      return new Promise(() => {
        MessageBox.alert('登录信息超时，请重新登录', '登录超时', {
          confirmButtonText: '重新登录',
          callback: action => {
            store.dispatch('user/resetTokenAction').then(() => {
              location.reload()
            })
          }
        });
      });
    }
    // 如果成功，则返回content对象
    if (res.success) {
      let axiosReturn = config.headers['axios-return'] || 'content';
      if (axiosReturn == 'whole-response') {
        return response;
      }
      if (axiosReturn == 'response') {
        return res;
      }
      return res.content;
    // 否则返回错误结果
    } else {
      // 调用者在catch中处理
      return Promise.reject(res);
    }
  },
  error => {
    // 将异常结果封装成统一的对象
    const errorCode = error.code || 3001;
    const errorMsg = error.message;
    return Promise.reject({errorCode, errorMsg});
  }
)


export default service;

