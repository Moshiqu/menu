<template>
    <view class="menu_page"
        :style="{ paddingTop: menuTop + menuHeight + 'px', height: `calc(100vh - ${menuTop}px - ${menuHeight}px)` }">
        <CustomTab />
        <view class="user_option">
            <image src="/static/image/default_img.jpg" class="avatar" />
            <view class="info">
                <view class="username">
                    <text>呀拉索</text>
                    <text class="edit_btn" v-if="isEdit">编辑</text>
                </view>
                <view class="contact">联系商家 ></view>
            </view>
            <view class="btns">
                <view class="btn" @click="editHandler">{{ isEdit ? '完成' : "编辑" }}</view>
                <view class="btn" @click="addHandler">添加</view>
            </view>
        </view>
        <TreeSelect :isEdit=isEdit ref="treeSelectRef" />
    </view>
</template>

<script setup>
import CustomTab from "/components/CustomTab/index.vue"
import TreeSelect from './components/TreeSelect.vue'
const { menuHeight, menuTop } = uni.getStorageSync('menuInfo')

import { ref } from 'vue'

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
