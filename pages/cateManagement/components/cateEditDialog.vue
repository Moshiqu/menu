<template>
    <view class="cate_edit_dialog" v-if="show">
        <view class="dialog_card">
            <view class="card_container">
                <view class="card_title">{{ cate ? '编辑' : '新增' }}分类</view>
                <input type="text" v-model="cateName" placeholder="请输入分类名称">
            </view>
            <view class="card_operation">
                <view class="cancel" @click="cancel">取消</view>
                <view class="save" @click="save">保存</view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue'

const $props = defineProps({
    show: { type: Boolean, default: false },
    cate: { type: Object }
})

const $emits = defineEmits(['update:show', 'confirm'])

const cateName = ref('')

onMounted(() => {
    cateName.value = $props.cate ? $props.cate.category_name : ''
})

const cancel = () => {
    $emits('update:show', false)
}

const save = () => {
    $emits('confirm', cateName.value)
}
</script>

<style scoped lang="less">
.cate_edit_dialog {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    background-color: rgba(0, 0, 0, .7);

    .dialog_card {
        width: 640rpx;
        // height: 370rpx;
        background-color: #fff;
        border-radius: 40rpx;

        .card_container {
            padding: 60rpx 0 40rpx 0;
            display: flex;
            flex-direction: column;
            align-items: center;

            &>input {
                margin-top: 50rpx;
                width: 400rpx;
                height: 100rpx;
                border: 2rpx solid #e8e8e8;
                border-radius: 14rpx;
                text-align: center;
                background: #f7f8fa;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .card_operation {
            border-top: 4rpx solid #f7f8f9;
            height: 100rpx;
            line-height: 100rpx;
            display: flex;
            font-weight: 700;

            &>view {
                width: 50%;
                text-align: center;

                &:first-child {
                    border-right: 2rpx solid #f7f8f9;
                }

                &:last-child {
                    color: #f6c33d;
                }
            }
        }
    }
}
</style>