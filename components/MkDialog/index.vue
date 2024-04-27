<template>
    <view class="mk-dialog" v-if="$props.showDialog">
        <view class="dialog-card">
            <view class="dialog-content">
                <view class="title">
                    {{ $props.title }}
                </view>
                <view class="description">
                    {{ $props.description }}
                </view>
            </view>
            <view class="dialog-btns">
                <view class="cancel" hover-class="cancel-hover" @click="closeDialog">取消</view>
                <view class="confirm" hover-class="cancel-hover" @click="confirmHandler">确认</view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const $props = defineProps({
    title: { type: String, default: '标题' },
    description: { type: String, default: '这个是内容信息' }
})
const $emits = defineEmits(['confirm', 'update:showDialog'])

const closeDialog = () => {
    $emits("update:showDialog", false)
}

const confirmHandler = () => {
    $emits("confirm")
}

</script>

<style lang="less" scoped>
.mk-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, .7);
    display: flex;
    align-items: center;
    justify-content: center;

    .dialog-card {
        width: 500rpx;
        background: #fff;
        border-radius: 20rpx;
        font-size: 32rpx;
        overflow: hidden;

        .dialog-content {
            border-bottom: 4rpx solid #f8f9fa;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 200rpx;

            .title {
                padding-top: 40rpx;
                padding-bottom: 24rpx;
            }

            .description {
                font-size: 28rpx;
                color: #646566;
                padding-bottom: 40rpx;
            }
        }

        .dialog-btns {
            display: flex;
            height: 100rpx;

            view {
                width: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;

                &:last-child {
                    border-left: 2rpx solid #f8f9fa;
                }
            }

            .cancel-hover {
                filter: grayscale(50%);
                background: rgba(0, 0, 0, .3);
            }

            .confirm {
                color: #f7ca55;
            }
        }
    }
}
</style>