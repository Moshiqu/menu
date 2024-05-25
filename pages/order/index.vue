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
                <image :src="tabConfig[activeTab].emptyImg" mode="scaleToFill" class="empty_img" v-if="!orderList.length" />
                <OrdersCards :orderList="orderList" @btnHandlerByOwner="btnHandlerByOwner"
                    @btnHandlerByConsumer="btnHandlerByConsumer" :orderType="activeTab" :showOperation="true" />
                <view class="history" v-if="!currentDate">
                    <view class="history_title" @click="openHistoryOrder" v-if="!tabConfig[activeTab].isOpen">
                        <view>展开历史{{ tabTitle }}订单</view>
                        <image src="/static/image/common/down.png" mode="scaleToFill" />
                    </view>
                    <template v-else>
                        <view class="history_title">
                            <view>以下是历史{{ tabTitle }}订单</view>
                        </view>
                        <OrdersCards :orderList="historyOrderList" @btnHandlerByOwner="btnHandlerByOwner"
                            @btnHandlerByConsumer="btnHandlerByConsumer" :orderType="activeTab" />
                        <view class="history_footer">
                            仅展示七天内的历史订单, 更早的订单请点击日历查询
                        </view>
                    </template>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import Calendar from './components/Calender/calendar.vue'
import { ref, computed, watch, onMounted, toRefs } from 'vue'
import { getProcessingOrder, getOrderByDate, getOrderDate, deleteOrderByOwner, startMakeByOwner, finishMakeByOwner, finishOrderByConsumer, getHistoryOrder } from '/api/order'
import OrdersCards from '/components/OrdersCards'

// 最近调用的获取列表接口 1:getProcessingOrder; 2: getOrderByDate
let interfaceIndex = 0

// 日历是否缩略
const isAbb = ref(true)

// 日期改变事件
const change = (dateObj) => {
    currentDate.value = dateObj.fulldate
    getOrderListByDate()
}

// 所选日期
const currentDate = ref('')

const selectedDayList = ref([])

// tab栏
const activeTab = ref(1)
const tabTitle = computed(() => {
    return activeTab.value === 1 ? '饭店' : "个人"
})

const tabConfig = ref({
    1: { tip: '饭店订单是你所属饭店收到的订单', emptyImg: '/static/image/order-empty.png', isOpen: false },
    2: { tip: "个人订单是你下过的订单", emptyImg: '/static/image/order-empty-2.png', isOpen: false }
})

watch(() => activeTab.value, () => {
    for (const key in tabConfig.value) {
        if (Object.hasOwnProperty.call(tabConfig.value, key)) {
            const element = tabConfig.value[key];
            element.isOpen = false
        }
    }
    if (!currentDate.value) {
        getOrderListByProcessing()
    } else {
        getOrderListByDate()
    }
})

const historyOrderList = ref([])

// 获取历史订单
const getOrderInHistory = () => {
    if (!tabConfig.value[activeTab.value].isOpen) return
    uni.showLoading()
    const param = {
        classic: activeTab.value
    }
    getHistoryOrder(param).then(res => {
        uni.hideLoading()
        if (res.code == 200) {
            historyOrderList.value = res.data
        }
    }).catch(err => {
        uni.hideLoading()
        uni.showToast({ title: '获取订单失败', icon: "none" })
    })
}

// 展开历史订单
const openHistoryOrder = () => {
    tabConfig.value[activeTab.value].isOpen = true
    getOrderInHistory()
}

onMounted(() => {
    getOrderDateList()
    getOrderListByProcessing()
})

const orderList = ref([])

// 获取进行中的订单
const getOrderListByProcessing = () => {
    uni.showLoading()

    const param = {
        classic: activeTab.value
    }

    getProcessingOrder(param).then(res => {
        orderList.value = res.data
        orderList.value.forEach(item => item.showDetail = false)
        uni.hideLoading()
    }).catch(err => {
        uni.hideLoading()
        uni.showToast({ title: '获取订单失败', icon: "none" })
    }).finally(() => {
        interfaceIndex = 1
    })

    getOrderInHistory()
}

// 根据日期获取订单
const getOrderListByDate = () => {
    uni.showLoading()

    const param = {
        classic: activeTab.value,
        date: currentDate.value
    }

    if (!param.date) return uni.showToast({ title: "未选择日期", icon: "none", mask: true })

    getOrderByDate(param).then(res => {
        orderList.value = res.data
        orderList.value.forEach(item => item.showDetail = false)
        uni.hideLoading()
    }).catch(err => {
        uni.hideLoading()
        uni.showToast({ title: '获取订单失败', icon: "none" })
    }).finally(() => {
        interfaceIndex = 2
    })
}

// 获取有订单的日期
const getOrderDateList = () => {
    uni.showLoading()

    getOrderDate().then(res => {
        uni.hideLoading()
        if (res.code == 200) {
            selectedDayList.value = res.data
        }
    }).catch(err => {
        uni.hideLoading()
        uni.showToast({ title: '获取订单日期失败', icon: "none" })
    })
}

// 修改订单状态按钮 待制作->制作中->制作完成
const btnHandlerByOwner = (order, isCancel) => {
    const { id: orderId, order_status } = toRefs(order)

    if (isCancel) {
        // 商家取消订单
        return uni.showModal({
            title: '提示',
            content: '确认要取消该订单吗？',
            success: function (res) {
                if (res.confirm) {
                    uni.showLoading()

                    const param = {
                        orderId: orderId.value
                    }

                    deleteOrderByOwner(param).then(res => {
                        uni.hideLoading()

                        if (res.code == 200) {
                            uni.showToast({ title: "取消订单成功", icon: "none", mask: true })
                            // 重新获取数据
                            setTimeout(() => {
                                switch (interfaceIndex) {
                                    case 1:
                                        getOrderListByProcessing()
                                        break;
                                    case 2:
                                        getOrderListByDate()
                                        break;
                                }
                            }, 1500);
                        }
                    }).catch(err => {
                        uni.hideLoading()
                        uni.showToast({ title: '取消订单失败', icon: "none" })
                    })
                } else {
                    console.log('点击了取消')
                }
            }
        })
    }

    if (order_status.value == 1) {
        // 待制作->制作中
        startMakeHandler(orderId.value)
    } else if (order_status.value == 2) {
        // 制作中->制作完成
        doneMakeHandler(orderId.value)
    }
}
// 修改订单状态 制作完成->订单完成
const btnHandlerByConsumer = (order) => {
    const { id: orderId } = toRefs(order)

    uni.showModal({
        title: '提示',
        content: '确认要完成该订单吗？订单完成后可在历史订单中查看',
        success: function (res) {
            if (res.confirm) {
                finishOrderHandler(orderId.value)
            } else {
                console.log('点击了取消')
            }
        }
    })
}

// 待制作->制作中
const startMakeHandler = (orderId) => {
    const param = {
        orderId
    }

    startMakeByOwner(param).then(res => {
        uni.hideLoading()

        if (res.code == 200) {
            uni.showToast({ title: "该订单开始制作", icon: "none", mask: true })
            setTimeout(() => {
                switch (interfaceIndex) {
                    case 1:
                        getOrderListByProcessing()
                        break;
                    case 2:
                        getOrderListByDate()
                        break;
                }
            }, 1500);
        }
    }).catch(err => {
        uni.hideLoading()
        uni.showToast({ title: '订单状态修改失败', icon: "none" })
    })
}

// 制作中->制作完成
const doneMakeHandler = (orderId) => {
    const param = {
        orderId
    }

    finishMakeByOwner(param).then(res => {
        uni.hideLoading()

        if (res.code == 200) {
            uni.showToast({ title: "该订单完成制作", icon: "none", mask: true })
            setTimeout(() => {
                switch (interfaceIndex) {
                    case 1:
                        getOrderListByProcessing()
                        break;
                    case 2:
                        getOrderListByDate()
                        break;
                }
            }, 1500);
        }
    }).catch(err => {
        uni.hideLoading()
        uni.showToast({ title: '订单状态修改失败', icon: "none" })
    })
}

// 制作完成->订单完成
const finishOrderHandler = (orderId) => {
    const param = {
        orderId
    }

    finishOrderByConsumer(param).then(res => {
        uni.hideLoading()

        if (res.code == 200) {
            uni.showToast({ title: "已确认该订单完成", icon: "none", mask: true })
            setTimeout(() => {
                switch (interfaceIndex) {
                    case 1:
                        getOrderListByProcessing()
                        break;
                    case 2:
                        getOrderListByDate()
                        break;
                }
            }, 1500);
        }
    }).catch(err => {
        uni.hideLoading()
        uni.showToast({ title: '订单状态修改失败', icon: "none" })
    })

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
                padding: 0 20rpx;
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
                    margin-bottom: 20rpx;

                    image {
                        width: 28rpx;
                        height: 28rpx;
                        margin-top: 6rpx;
                        margin-left: 8rpx;
                    }
                }

                .history_footer {
                    display: flex;
                    color: #777;
                    font-size: 14px;
                    align-content: center;
                    justify-content: center;
                    margin-bottom: 20rpx;
                }
            }
        }
    }
}
</style>