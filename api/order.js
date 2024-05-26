import { request } from '/utils/request';

// 生成订单
export const confirmOrder = (options) => request({ url: '/api/order/orderConfirm', method: 'post', data: options })

// 获取有订单的日期
export const getOrderDate = (options) => request({ url: '/api/order/getOrderDate', method: "post", data: options })

// 获取进行中的订单
export const getProcessingOrder = (options) => request({ url: '/api/order/getProcessingOrder', method: 'post', data: options })

// 根据日期获取订单
export const getOrderByDate = (options) => request({ url: '/api/order/getOrderByDate', method: 'post', data: options })

// 获取历史订单
export const getHistoryOrder = (options) => request({ url: '/api/order/getHistoryOrder', method: 'post', data: options })

// 作为商家 取消订单
export const deleteOrderByOwner = (options) => request({ url: '/api/order/deleteOrder', method: "post", data: options })

// 作为商家 修改订单状态 待制作=>制作中
export const startMakeByOwner = (options) => request({ url: '/api/order/startMake', method: "post", data: options })

// 作为商家 修改订单状态 制作中=>制作完成
export const finishMakeByOwner = (options) => request({ url: '/api/order/finishMake', method: "post", data: options })

// 作为商家 修改订单状态 制作完成=>订单完成
export const finishOrderByConsumer = (options) => request({ url: '/api/order/finishOrder', method: "post", data: options })

// 订单详情
export const getOrderDetail = (options) => request({ url: '/api/order/getOrderDetail', method: "get", data: options })