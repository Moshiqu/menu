<template>
    <view class="order_page">
        <Calendar @change="change" v-model:isAbb="isAbb" />
    </view>
</template>

<script setup>
import Calendar from './components/Calender/calendar.vue'
import { ref } from 'vue'

// 是否缩略
const isAbb = ref(false)

const change = () => {

}
</script>

<style scoped lang="less">
.order_page {
    padding: 40rpx 20rpx;
}
</style>