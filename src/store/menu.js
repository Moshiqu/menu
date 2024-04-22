import { defineStore } from "pinia"
import { getMenu } from '@/src/api/menu'

export const useMenuStore = defineStore("menu", {
    state: () => ({
        menuList: [],
    }),
    getters: {
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
        }
    },
    unistorage: true
})