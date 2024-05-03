import { request } from '/utils/request';

// 获取openid
export const getOpenID = (options) => request({ url: '/api/user/getOpenId', method: 'GET', data: options })

// 检查用户
export const check = (options) => request({ url: '/api/user/check', method: "GET", data: options })

// 搜索用户
export const searchUser = (options) => request({ url: '/api/user/getUser', method: "GET", data: options })
