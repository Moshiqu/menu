<template>
    <view class="custom_tab" :style="{ position: 'fixed', top: menuTop + 'px', height: menuHeight + 'px' }">
        <view class="left" :style="{ width: `calc(100% - ${menuWidth}px - 30rpx)`, }">
            <view>鼠鼠的个人菜单</view>
            <view class="btns">
                <view>
                    <image src="/static/image/menu/search.png" alt="" @click="toSearch" />
                </view>
                <view>
                    <image src="/static/image/menu/QR.png" alt="" />
                </view>
                <view>
                    <image src="/static/image/menu/share.png" alt="" />
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
const { statusBarHeight, menuWidth, menuHeight, menuRight, menuTop, contentTop } = uni.getStorageSync('menuInfo')

// 跳转搜索页 商家搜索
const toSearch = () => {
    uni.navigateTo({
        url: `/pages/search/index?type=1`
    });
}

// TODO 替换死数据

</script>

<style lang="less" scoped>
.custom_tab {
    display: flex;
    background-color: #f6c33d;
    // padding: 20rpx 20rpx;
    box-sizing: border-box;
    width: 100%;

    .left {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0 20rpx;

        .btns {
            display: flex;

            view {
                height: 58rpx;
                width: 58rpx;
                border-radius: 29rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #bd993c;
                margin-right: 20rpx;

                image {
                    width: 38rpx;
                    height: 38rpx;
                }
            }
        }
    }
}
</style>