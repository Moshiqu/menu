import { defineStore } from "pinia"

export const userUserInfoStore = defineStore("userInfo", {
    state: () => ({
        userInfo: {
            user_id: 10086
        }
    }),
    getters: {

    },
    actions: {

    },
    unistorage: true
})