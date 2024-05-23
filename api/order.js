import { request } from '/utils/request';

// 获取菜单
export const confirmOrder = (options) => request({ url: '/api/order/orderConfirm', method: 'post', data: options })

// 获取进行中的订单
export const getProcessingOrder = (options) => request({ url: '/api/order/getProcessingOrder', method: 'post', data: options })

// 根据日期获取订单
export const getOrderByDate = (options) => request({ url: '/api/order/getOrderByDate', method: 'post', data: options })