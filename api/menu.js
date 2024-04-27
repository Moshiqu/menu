import { request } from '/utils/request';

// 获取菜单
export const getMenu = (options) => request({ url: '/api/menu/getMenu', method: 'GET', data: options })

// 添加商品
export const addProductionDetail = options => request({ url: '/api/menu/addDetail', method: "POST", data: options })

// 修改商品
export const updateProductionDetail = options => request({ url: "/api/menu/updateDetail", method: "POST", data: options })

// 删除商品
export const deleteProduct = options => request({ url: "/api/menu/deleteProduct", method: "DELETE", data: options })

// 修改商品排序
export const updateSort = options => request({ url: "/api/menu/updateSort", method: "POST", data: options })

// 获取材料步骤
export const getMaterialStep = options => request({ url: "/api/menu/getMaterialStep", method: "GET", data: options })

// 新增材料步骤
export const addMaterialStep = options => request({ url: "/api/menu/addMaterialStep", method: "POST", data: options })

// 修改材料步骤
export const updateMaterialStep = options => request({ url: "/api/menu/updateMaterialStep", method: "POST", data: options })

// 新增分类
export const addCategory = options => request({ url: "/api/menu/addCategory", method: "POST", data: options })

// 修改分类
export const updateCategory = options => request({ url: "/api/menu/updateCategory", method: "POST", data: options })

// 修改分类排序
export const updateCategorySort = options => request({ url: "/api/menu/updateCategorySort", method: "POST", data: options })

// 删除分类
export const deleteCategory = options => request({ url: "/api/menu/deleteCategory", method: "DELETE", data: options })