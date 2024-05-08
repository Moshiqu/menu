import { defineStore } from "pinia"
import { getUserInfo } from "/api/user"

export const useUserStore = defineStore("userInfo", {
    state: () => ({
        userInfo: {}
    }),
    getters: {

    },
    actions: {
        setUserInfo() {
            getUserInfo().then(res => {
                if(res.code == 200){
                    this.userInfo = { ...this.userInfo, ...res.data }
                }
            }).catch(err => {

            })
        }
    },
    unistorage: true
})