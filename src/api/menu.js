import { request } from '@/src/utils/request';

// 获取菜单
export const getMenu = (options) => request({ url: '/api/menu/getMenu', method: 'GET', data: options })

// 添加商品
export const addProductionDetail = options => request({ url: '/api/menu/addDetail', method: "POST", data: options })

// 修改商品
export const updateProductionDetail = options => request({ url: "/api/menu/updateDetail", method: "POST", data: options })

// 删除商品
export const deleteProduct = options => request({ url: "/api/menu/deleteProduct", method: "DELETE", data: options })