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
                <view class="order_content">
                    <view class="order_card" v-for="order in orderList " :key="order.id">
                        <view class="card_title">
                            <view class="create_time">
                                <text>制作时间：</text>
                                <text>{{ $formateTime(order.make_time) }}</text>
                            </view>
                            <view class="order_status">{{ orderStatusMap.get(order.order_status) }}</view>
                        </view>
                        <view class="card_productions_content">
                            <!-- 缩略信息 -->
                            <view class="productions_items" v-if="!order.showDetail">
                                <scroll-view class="order_content_scroll_bar" scroll-x="true" :enable-flex="true">
                                    <view class="production_item" v-for=" product  in  order.orderProducts"
                                        :key="product.id">
                                        <image src="/static/image/default_img.jpg" mode="scaleToFill"
                                            class="production_img" />
                                        <view class="production_name">{{ product.product_name }}</view>
                                    </view>
                                </scroll-view>
                                <view class="card_price_bar">
                                    <view class="total_price">￥{{ order.order_price }}</view>
                                    <view class="total_count">共{{ order.orderProducts.length }}件</view>
                                </view>
                            </view>
                            <!-- 全部信息 -->
                            <view class="productions_detail_items" v-else>
                                <view class="production_item" v-for="product in order.orderProducts" :key="product.id">
                                    <view class="production_content">
                                        <view class="production_item_img_box">
                                            <image src="/static/image/default_img.jpg" mode="scaleToFill" />
                                        </view>
                                        <view class="production_item_content">
                                            <view class="production_name">{{ product.product_name }}</view>
                                            <view class="account">x{{ product.product_num }}</view>
                                        </view>
                                    </view>
                                    <view class="production_item_total_price">
                                        ￥{{ Number(product.product_num * (product.product_price || 0)).toFixed(2) }}
                                    </view>
                                </view>
                            </view>
                            <view class="card_abb_btn" @click="order.showDetail = !order.showDetail">
                                <image src="/static/image/common/down.png" mode="scaleToFill"
                                    :class="[order.showDetail ? 'top' : '']" />
                            </view>
                        </view>
                        <view class="card_information">
                            <view class="userInfo">
                                <view class="avatar">
                                    <image src="/static/image/default_img.jpg" mode="scaleToFill" />
                                </view>
                                <view class="username">{{ activeTab == 1 ? order.consumerInfo.nick_name :
                                    order.ownerInfo.nick_name }}</view>
                            </view>
                            <view class="btns" v-if="activeTab == 1">
                                <button class="red_btn" type="default" size="mini" :plain="true"
                                    v-if="order.order_status == 1" @click="btnHandlerByOwner(order)">开始制作</button>
                                <button class="red_btn" type="default" size="mini" :plain="true"
                                    v-else-if="order.order_status == 2" @click="btnHandlerByOwner(order)">制作完成</button>

                                <button class="yellow_btn" type="default" size="mini" :plain="true"
                                    v-if="order.order_status == 1 || order.order_status == 2"
                                    @click="btnHandlerByOwner(order, true)">取消订单</button>
                            </view>

                            <view class="btns" v-else-if="activeTab == 2">
                                <button class="yellow_btn" type="default" size="mini" :plain="true"
                                    v-if="order.order_status == 3" @click="btnHandlerByConsumer(order)">确认完成</button>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="history" v-if="!currentDate">
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
import { ref, computed, watch, onMounted, toRefs } from 'vue'
import { getProcessingOrder, getOrderByDate, getOrderDate, deleteOrderByOwner, startMakeByOwner, finishMakeByOwner, finishOrderByConsumer } from '/api/order'
import { orderStatus } from '/utils/statusMap'
// TODO  点击下方的历史订单, 则展示状态为(4或5)的所有订单(近一周)

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

// 展开历史订单
const openHistoryOrder = () => {
    tabConfig.value[activeTab.value].isOpen = true
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

// 订单状态map
const orderStatusMap = orderStatus()

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
        content: '确认要完成该订单吗？',
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

            .order_content {
                font-size: 14px;
                color: #666;

                .order_card {
                    background-color: #fff;
                    border-radius: 20rpx;
                    padding: 20rpx;
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
                    margin-bottom: 20rpx;

                    .card_title {
                        display: flex;
                        align-content: center;
                        justify-content: space-between;
                        height: 60rpx;
                        line-height: 40rpx;
                    }

                    .card_productions_content {
                        border-bottom: 2rpx solid #f5f6f7;
                        border-top: 2rpx solid #f5f6f7;
                        padding: 20rpx 0 10rpx 0;

                        .productions_items {
                            display: flex;

                            .order_content_scroll_bar {
                                width: calc(100% - 100rpx);
                                overflow: hidden;
                                white-space: nowrap;

                                .production_item {
                                    width: 160rpx;
                                    display: inline-block;
                                    margin-right: 20rpx;

                                    .production_img {
                                        width: 160rpx;
                                        height: 160rpx;
                                        border-radius: 20rpx;
                                    }

                                    .production_name {
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                        overflow: hidden;
                                    }
                                }
                            }

                            .card_price_bar {
                                width: 100rpx;
                                margin-left: 20rpx;
                                text-align: end;

                                .total_price {
                                    color: #333;
                                }

                                .total_count {
                                    font-size: 12px;
                                }
                            }
                        }

                        .productions_detail_items {
                            .production_item {
                                height: 160rpx;
                                margin-top: 16rpx;
                                display: flex;
                                justify-content: space-between;

                                &:first-child {
                                    margin-bottom: 0;
                                }

                                .production_content {
                                    display: flex;

                                    .production_item_img_box {

                                        &>image {
                                            width: 160rpx;
                                            height: 160rpx;
                                            border-radius: 20rpx;
                                        }
                                    }

                                    .production_item_content {
                                        margin-left: 20rpx;

                                        .production_name {
                                            color: #333;
                                            font-weight: 700;
                                            margin-bottom: 4rpx;
                                        }

                                        .account {
                                            color: #999;
                                        }
                                    }
                                }

                                .production_item_total_price {
                                    color: #333;
                                }
                            }
                        }

                        .card_abb_btn {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 40rpx;

                            &>image {
                                width: 28rpx;
                                height: 28rpx;
                            }

                            .top {
                                transform: rotate(180deg);
                            }
                        }
                    }

                    .card_information {
                        display: flex;
                        justify-content: space-between;
                        padding: 20rpx 0 10rpx 0;
                        height: 54rpx;
                        line-height: 54rpx;

                        .userInfo {
                            display: flex;
                            overflow: hidden;

                            .avatar {
                                margin-right: 20rpx;

                                &>image {
                                    width: 54rpx;
                                    height: 54rpx;
                                    border-radius: 10rpx;
                                }
                            }

                            .username {
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }

                        .btns {
                            white-space: nowrap;

                            &>button {
                                height: 54rpx;
                                list-style: 54rpx;
                                border-radius: 0;
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: 700;
                                margin-right: 20rpx;

                                &:last-child {
                                    margin-right: 0;
                                }
                            }

                            .red_btn {
                                color: #ff976a;
                                border: 1px solid #ff976a;
                            }

                            .yellow_btn {
                                color: #f6c33d;
                                border: 1px solid #f6c33d;
                            }
                        }
                    }

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