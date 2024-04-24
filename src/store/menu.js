import { defineStore } from "pinia"
import { getMenu } from '@/src/api/menu'

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
        }

    },
    actions: {
        // 菜单
        setMenuList(list) {
            const that = this;
            that.menuList = list;
        },
        getMenuListByApi() {
            // uni.showLoading()
            getMenu().then(res => {
                // uni.hideLoading()
                if (res.code == 200) {
                    this.menuList = res.data
                } else {
                    uni.showToast({ title: "获取菜单失败" })
                }
            }).catch(err => {
                // uni.hideLoading()
                uni.showToast({ title: "获取菜单失败" })
            })
        },
        // 购物车
        cleanCartList(list) {
            this.cartList = []
        },
        // 添加到购物车
        addCartList(product) {
            this.cartList.push(product)
        },
        minusCartList(product){
            
        }

    },
    unistorage: true
})