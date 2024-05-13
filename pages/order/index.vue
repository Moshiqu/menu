<template>
    <view class="order_page">
        <Calendar @change="change" />
    </view>
</template>

<script setup>
import Calendar from './components/Calender/calendar.vue'

const change = () => {

}
</script>

<style scoped lang="less">
.order_page {
    padding: 40rpx;
}
</style>