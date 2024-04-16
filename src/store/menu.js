import { defineStore } from "pinia"

export const useMenuStore = defineStore("menu", {
    state: () => ({
        menuList: [],
    }),
    getters: {
        cateList() {
            return this.menuList.map(item => {
                return {
                    parentId: item.parentId,
                    name: item.name,
                    index: item.index
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