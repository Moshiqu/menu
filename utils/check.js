import { useMenuStore } from "/store/menu"
import { check } from '/api/user'


export const checkHandler = () => {
    const openid = uni.getStorageSync('openid')
    check({ openid }).then(res => {
        uni.setStorageSync('token', res.data.token)
        const menuStore = useMenuStore()
        menuStore.getMenuListByApi()
    }).catch(err => {
        uni.showToast({
            title: err,
            icon: 'none',
            mask: true
        })
    })
}