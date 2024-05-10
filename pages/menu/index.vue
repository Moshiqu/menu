<template>
    <view class="menu_page"
        :style="{ paddingTop: menuTop + menuHeight + 'px', height: `calc(100vh - ${menuTop}px - ${menuHeight}px)` }">
        <CustomTab />
        <view class="user_option">
            <image src="/static/image/default_img.jpg" class="avatar" />
            <view class="info">
                <view class="username">
                    <text>{{ infoData.nick_name }}</text>
                    <text class="edit_btn" v-if="isEdit">编辑</text>
                </view>
                <view class="contact" v-if="isMe">联系商家 ></view>
            </view>
            <view class="btns">
                <view class="btn" @click="editHandler" v-if="isMe">{{ isEdit ? '完成' : "编辑" }}</view>
                <view class="btn" @click="addHandler" v-if="isMe">添加</view>
                <view class="btn" @click="backToMeHandler" v-else>返回我的商店</view>
            </view>
        </view>
        <TreeSelect :isEdit=isEdit ref="treeSelectRef" :storeId="Number(storeId)" />
        <MkDialog v-model:showDialog="showDescriptionDialog" @confirm="showDescriptionDialog = false" :title="'提示'"
            :description="infoData.description" :hideCancel="true" />
    </view>
</template>

<script setup>
import CustomTab from "/components/CustomTab/index.vue"
import TreeSelect from './components/TreeSelect.vue'
import MkDialog from '/components/MkDialog'
import { onLoad } from "@dcloudio/uni-app"
import { ref, watch, computed } from 'vue'
import { useMenuStore } from '/store/menu.js';
import { getStoreUserInfo } from '/api/user.js'

const { menuHeight, menuTop } = uni.getStorageSync('menuInfo')

const isEdit = ref(false)
const treeSelectRef = ref(null)

const editHandler = () => {
    isEdit.value = !isEdit.value
}

const addHandler = () => {
    uni.navigateTo({
        url: '/pages/productionManagement/index'
    });
}

// 是否是本人的商店
const isMe = computed(() => menuStore.isMe)

// 跳转到首页， 获取商店id
const storeId = ref(0)
onLoad((option) => {
    const { storeId: optionStoreId } = option
    storeId.value = optionStoreId || 0
})

const infoData = ref({})

const menuStore = useMenuStore()


const showDescriptionDialog = ref(false)

const getInfoData = () => {
    const params = {}
    if (menuStore.menuId > 0) {
        params.storeId = menuStore.menuId
    }
    getStoreUserInfo(params).then(res => {
        if (res.code != 200) return uni.showToast({ title: '获取用户信息失败', icon: "none" })
        infoData.value = res.data
        if (params.storeId && infoData.description) showDescriptionDialog.value = true
    }).catch(err => {
        uni.showToast({ title: '获取用户信息失败', icon: "none" })
    })
}
watch(() => menuStore.menuId, (nv) => {
    if (nv != -1) {
        getInfoData()
    }
}, { immediate: true })

// 切换商店
import { useUserStore } from "@/store/userInfo"
const userStore = useUserStore()
const backToMeHandler = () => {
    infoData.value = userStore.userInfo
    menuStore.getMenuListByApi()
    isMe.value = true
}

</script>

<style lang="less" scoped>
.menu_page {
    height: 100vh;
    background-color: #f6c33d;

    .user_option {
        display: flex;
        padding: 40rpx 20rpx 20rpx 20rpx;
        position: relative;

        .avatar {
            width: 128rpx;
            height: 128rpx;
            border-radius: 50%;
        }

        .info {
            padding: 10rpx 20rpx;

            .username {
                font-weight: 700;
                margin-bottom: 20rpx;

                .edit_btn {
                    color: #65a2c6;
                    padding: 0 10rpx;
                    border: 1rpx solid #65a2c6;
                    font-size: 24rpx;
                    margin-left: 30rpx;
                    border-radius: 10rpx;
                }
            }

            .contact {
                color: #777;
            }
        }

        .btns {
            position: absolute;
            right: 20rpx;
            bottom: 30rpx;
            display: flex;
            font-size: 14px;
            font-weight: 700;
            color: #fff;

            .btn {
                height: 28rpx;
                line-height: 28rpx;
                padding: 14rpx;
                background: #e84524;
                border-radius: 28rpx;

                &:first-child {
                    margin-right: 20rpx;
                }
            }
        }

    }

    .menu_content {
        background-color: red;
        height: calc(100% - 128rpx - 40rpx - 20rpx);
    }
}
</style>
