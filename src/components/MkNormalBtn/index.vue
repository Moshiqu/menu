<template>
    <view class="btn" @click="clickHandler">{{ text }}</view>
</template>

<script setup>
import { defineProps,defineEmits } from 'vue'

const $props = defineProps({
    text: String,
    required: true
})

const $emits = defineEmits(['confirm'])

const clickHandler = ()=>{
    $emits('confirm')
}
</script>

<style scoped lang="less">
@themeColor: #f6c33d;

.btn {
    padding: 10rpx;
    font-size: 24rpx;
    font-weight: 700;
    background-color: @themeColor;
    width: fit-content;
    border-radius: 4rpx;
}
</style>