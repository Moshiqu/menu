import { request } from '/utils/request';

// 获取菜单
export const confirmOrder = (options) => request({ url: '/api/order/orderConfirm', method: 'post', data: options })