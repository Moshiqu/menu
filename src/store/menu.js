import { defineStore } from "pinia"

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
    },
    unistorage: true
})