<template>
    <view class="order_page">
        <Calendar @change="change" v-model:isAbb="isAbb" :selected="selectedDayList" />
        <view class="tab_bar">
            <view class="tab_bar_switch">
                <view :class="['tab_item', activeTab == 1 ? 'tab_active' : '']" @click="activeTab = 1">
                    饭店订单
                </view>
                <view :class="['tab_item', activeTab == 2 ? 'tab_active' : '']" @click="activeTab = 2">
                    个人订单
                </view>
            </view>
            <view class="tab_bar_content">
                <view class="tab_tip">{{ tabConfig[activeTab].tip }}</view>
                <!-- <image :src="tabConfig[activeTab].emptyImg" mode="scaleToFill" class="empty_img" /> -->
                <view class="order_content">
                    <view class="order_card"></view>
                </view>
                <view class="history">
                    <view class="history_title" @click="openHistoryOrder">
                        <template v-if="!tabConfig[activeTab].isOpen">
                            <view>展开历史{{ tabTitle }}订单</view>
                            <image src="/static/image/common/down.png" mode="scaleToFill" />
                        </template>
                        <template v-if="tabConfig[activeTab].isOpen">
                            以下是历史{{ tabTitle }}订单
                        </template>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import Calendar from './components/Calender/calendar.vue'
import { ref, computed, watch } from 'vue'
// TODO 订单卡片

// 日历是否缩略
const isAbb = ref(true)

// 日期改变事件
const change = (dateObj) => {
    // console.log(dateObj);
}

const selectedDayList = ref([{ date: '2024-05-17' },{ date: '2024-05-07' }])

// tab栏
const activeTab = ref(1)
const tabTitle = computed(() => {
    return activeTab.value === 1 ? '饭店' : "个人"
})

const tabConfig = ref({
    1: { tip: '饭店订单是你所属饭店收到的订单', emptyImg: '/static/image/order-empty.png', isOpen: false },
    2: { tip: "个人订单是你下过的订单", emptyImg: '/static/image/order-empty-2.png', isOpen: false }
})

watch(() => activeTab, () => {
    for (const key in tabConfig.value) {
        if (Object.hasOwnProperty.call(tabConfig.value, key)) {
            const element = tabConfig.value[key];
            element.isOpen = false
        }
    }
})

// 展开历史订单
const openHistoryOrder = () => {
    tabConfig.value[activeTab.value].isOpen = true
}

</script>

<style scoped lang="less">
.order_page {
    padding: 40rpx 20rpx;
    background-color: #f7f8fa;

    .tab_bar {
        min-height: 100vh;
        padding: 0 20rpx;

        .tab_bar_switch {
            font-size: 16px;
            color: #999;
            font-weight: 400;
            margin: 20rpx 0;

            .tab_item {
                width: 50%;
                display: inline-block;
                height: 80rpx;
                line-height: 80rpx;
                text-align: center;
            }

            .tab_active {
                position: relative;
                font-weight: 700;
                color: #333;

                &::after {
                    content: " ";
                    height: 2rpx;
                    width: 80rpx;
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    border-bottom: 4rpx solid #f6c33d;
                }
            }
        }

        .tab_bar_content {
            .tab_tip {
                font-size: 14px;
                margin-bottom: 20rpx;
            }

            .order_content {
                .order_card {
                    height: 500rpx;
                    background-color: #fff;
                    border-radius: 20rpx;
                    padding: 40rpx 20rpx;
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
                }
            }

            .empty_img {
                width: 100%;
                height: 380rpx;
                border-radius: 20rpx;
            }

            .history {
                margin-top: 140rpx;

                .history_title {
                    display: flex;
                    color: #777;
                    font-size: 14px;
                    align-content: center;
                    justify-content: center;

                    image {
                        width: 28rpx;
                        height: 28rpx;
                        margin-top: 6rpx;
                        margin-left: 8rpx;
                    }
                }
            }
        }
    }
}
</style>