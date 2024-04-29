import { defineStore } from "pinia"
import { getMenu } from '/api/menu'
import { cloneDeep } from 'lodash'

export const useMenuStore = defineStore("menu", {
    state: () => ({
        menuList: [],
        cartList: [],
    }),
    getters: {
        // 菜单
        cateList() {
            return this.menuList.map(item => {
                const { category_name, id, sort_index } = item
                return {
                    category_name,
                    id,
                    sort_index
                }
            })
        },
        // 购物车内所有商品数量
        allCartNum() {
            let num = 0
            this.cartList.forEach(cart => {
                cart.children.forEach(product => {
                    num += product.selectNum
                })
            })

            return num
        },
        cartProductsList() {
            return this.cartList.reduce((accumulator, currentValue) => {
                if (currentValue.children && currentValue.children.length) {
                    accumulator.push(...currentValue.children)
                }
                return accumulator
            }, [])
        }
    },
    actions: {
        // 菜单
        setMenuList(list) {
            if (this.cartList.length) {
                // 回显购物车和列表
                const cateAndProductList = []
                this.cartList.forEach(cate => {
                    cate.children.forEach(product => {
                        cateAndProductList.push({
                            productId: product.id,
                            selectNum: product.selectNum
                        })
                    })
                })

                const listProduct = []
                list.forEach(cate => {
                    if (cate.children && cate.children.length) {
                        cate.children.forEach(product => {
                            listProduct.push(product)
                        })
                    }
                })

                listProduct.forEach(product => {
                    cateAndProductList.forEach(item => {
                        if (item.productId == product.id) {
                            product.selectNum = item.selectNum
                        }
                    })
                })
            }
            this.menuList = list;
        },
        getMenuListByApi() {
            // uni.showLoading()
            getMenu().then(res => {
                // uni.hideLoading()
                if (res.code == 200) {
                    this.setMenuList(res.data)
                } else {
                    uni.showToast({ title: "获取菜单失败", icon: "none" })
                }
            }).catch(err => {
                // uni.hideLoading()
                uni.showToast({ title: "获取菜单失败", icon: "none" })
            })
        },
        // 购物车
        resetCartList() {
            this.cartList = []
        },
        addToCart(categoryId, product) {
            const curCate = this.cartList.find(cate => cate.id === categoryId)

            if (curCate) {
                // 已存在该分类
                const curProduct = curCate.children.find(item => item.id === product.id)

                if (curProduct) {
                    // 已存在该商品
                    curProduct.selectNum += 1
                } else {
                    // 不存在该商品
                    const product_clone = cloneDeep(product)
                    product_clone.selectNum = 1
                    curCate.children.push(product_clone)
                }
            } else {
                // 不存在该分类
                const cate_clone = cloneDeep(this.menuList.find(item => item.id === categoryId))
                cate_clone.children = []

                const product_clone = cloneDeep(product)
                product_clone.selectNum = 1

                cate_clone.children.push(product_clone)
                this.cartList.push(cate_clone)
            }
        },
        minusFromCart(categoryId, product) {
            let cate_index = null
            let product_index = null
            this.cartList.find((cate, index) => {
                cate_index = index
                return cate.id === categoryId
            }).children.find((item, index) => {
                product_index = index
                return item.id === product.id
            }).selectNum--

            if (this.cartList.find(cate => cate.id === categoryId).children.find(item => item.id === product.id).selectNum <= 0) {
                this.cartList.find(cate => cate.id === categoryId).children.splice(product_index, 1)
            }

            if (this.cartList.find(cate => cate.id === categoryId).children.length <= 0) {
                this.cartList.splice(cate_index, 1)
            }
        }

    },
    unistorage: true
})