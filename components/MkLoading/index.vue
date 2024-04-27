<template>
    <view class="mk-loading" v-if="loading">
        <view class="loading-content">
            <image class="loading-icon" src="/static/image/common/loading.png" />
            <view class="loading-text" v-if="showText">
                {{ text }}…
            </view>
        </view>
    </view>
</template>

<script setup>
import { defineProps } from 'vue'

const $props = defineProps({
    loading: {
        type: Boolean,
        default: true
    },
    showText: {
        type: Boolean,
        default: false
    },
    text: {
        type: String,
        default: "正在加载中"
    }
})

</script>

<style lang="less" scoped>
.mk-loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, .7);
    display: flex;
    align-items: center;
    justify-content: center;

    .loading-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .loading-icon {
            transform: rotate(360deg);
            transition: transform 1s linear;
            height: 80rpx;
            width: 80rpx;
            animation: turn 3s linear infinite;
        }

        .loading-text {
            margin-top: 40rpx;
            color: #f6c33d;
        }

        // 旋转动画
        @keyframes turn {
            0% {
                transform: rotate(0deg);
            }

            50% {
                transform: rotate(180deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }
    }
}
</style>