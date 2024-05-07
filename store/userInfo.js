import { defineStore } from "pinia"

export const useUserStore = defineStore("userInfo", {
    state: () => ({
        userInfo: {
            user_id: 0
        }
    }),
    getters: {

    },
    actions: {
        setUserInfo(data) {
            this.userInfo = { ...this.userInfo, ...data }
        }
    },
    unistorage: true
})