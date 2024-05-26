<template>
    <view class="order_detail" v-if="orderData">
        <!-- 商家或客户信息 -->
        <view class="user_info">
            <image :src="(userInfoComputed.wx_avatar || userInfoComputed.avatar) || '/static/image/default_img.jpg'"
                mode="scaleToFill" class="user_avatar" />
            <view class="user_nick_name">
                {{ userInfoComputed.wx_nick_name || userInfoComputed.nick_name }}
            </view>
        </view>
        <!-- 订单信息 -->
        <view class="order_info">
            <view class="order_id">
                <text>订单编号：{{ `********${orderData ? orderData.id.substr(-4) : '****'}` }}</text>
                <text> {{ orderStatus().get(orderData.order_status) }}</text>
            </view>
            <view class="order_productions">
                <view class="production_item" v-for="production in orderData.productions" :key="production.product_id"
                    @click="toProductionDetail(production.product_id)">
                    <view class="production_info">
                        <view class="production_avatar">
                            <image src="/static/image/default_img.jpg" mode="scaleToFill" class="user_avatar" />
                        </view>
                        <view class="production_detail">
                            <view class="production_name">{{ production.product_name }}</view>
                        </view>
                    </view>
                    <view class="production_static">
                        <view class="production_price">
                            <text class="symbol">￥</text>
                            <text>{{ production.product_price.toFixed(2) }}</text>
                        </view>
                        <view class="production_num">
                            <text class="symbol">x</text>
                            <text>{{ production.product_num }}</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="order_remark" v-if="orderData.remark">
                <view class="title">备注</view>
                <view class="content">{{ orderData.remark }}</view>
            </view>
            <view class="order_total">
                <view class="title">共{{ orderData.productions.length }}件商品</view>
                <view class="content">
                    <view class="total_price_title">总价</view>
                    <view class="total_price">￥{{ orderData.order_price }}</view>
                </view>
            </view>
        </view>
        <view class="order_time">
            <view class="time_item">
                下单时间：{{ $formateTime(orderData.created_time) }}
            </view>
            <view class="time_item">
                预约时间：{{ $formateTime(orderData.make_time) }} {{ orderData.make_type == 'right_now' ? '(立即制作)' : '' }}</view>
            <!-- 最近更新时间 -->
            <view class="time_item" v-if="orderData.update_time != orderData.created_time">
                最近更新时间：{{ $formateTime(orderData.update_time) }}</view>
            <!-- 点击开始制作的时间 -->
            <view class="time_item" v-if="orderData.start_make_time">
                制作开始时间：{{ $formateTime(orderData.start_make_time) }}
            </view>
            <!-- 点击制作完成的 -->
            <view class="time_item" v-if="orderData.done_make_time">
                制作完成时间：{{ $formateTime(orderData.done_make_time) }}
            </view>
            <!-- 商家点击取消的时间 -->
            <view class="time_item" v-if="orderData.cancel_time">
                订单取消时间：{{ $formateTime(orderData.cancel_time) }}
            </view>
            <!-- 客户点击确认完成的时间 -->
            <view class="time_item" v-if="orderData.finish_time">
                确认完成时间：{{ $formateTime(orderData.finish_time) }}
            </view>

        </view>
    </view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app"
import { getOrderDetail } from '/api/order'
import { ref, computed } from 'vue'
import { useUserStore } from "@/store/userInfo";
import { orderStatus } from '/utils/statusMap'

const userStore = useUserStore()

// 当前登录用户的id
const myId = ref(userStore.userInfo.id || 0)

// 订单id
const orderId = ref('')

onLoad((option) => {
    const { orderId: orderIdOrigin } = option
    orderId.value = orderIdOrigin || 0
    getOrder()
})

// 订单数据
const orderData = ref(null)
// 获取订单详情
const getOrder = () => {
    uni.showLoading()

    const query = {
        orderId: orderId.value
    }

    getOrderDetail(query).then(res => {
        uni.hideLoading()
        if (res.code == 200) {
            orderData.value = res.data
        }
        console.log(orderData.value, '--data');
    }).catch(err => {
        uni.hideLoading()
        uni.showToast({ title: err.errMsg || err.message || '获取订单详情失败', icon: "none", mask: true })
    })
}

// 用户名信息
const userInfoComputed = computed(() => {
    return orderData.value.consumer_id == myId.value ? orderData.value.owner_info : orderData.value.consumer_info
})

// 跳转商品详情页
const toProductionDetail = (productionId) => {
    uni.navigateTo({
        url: `/pages/productionDetail/index?productionId=${productionId}`
    });
}
</script>

<style scoped lang="less">
.order_detail {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 60rpx 20rpx;
    font-size: 14px;

    .user_info {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 60rpx;

        .user_avatar {
            width: 128rpx;
            height: 128rpx;
            border-radius: 50%;
            margin-bottom: 20rpx;
        }
    }

    .order_info {
        padding: 20rpx;
        border-radius: 20rpx;
        background-color: #fff;
        margin-bottom: 20rpx;

        .order_id {
            font-size: 12px;
            color: #999;
            position: relative;
            margin-bottom: 30rpx;
            display: flex;
            justify-content: space-between;


            &::before {
                content: "";
                height: 12px;
                width: 6rpx;
                background-color: #f6c33d;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
            }

            &>text {
                padding-left: 16rpx;
            }
        }

        .order_productions {
            padding-bottom: 30rpx;
            border-bottom: 1px dashed #ccc;

            .production_item {
                display: flex;
                margin-bottom: 20rpx;

                .production_info {
                    width: calc(100% - 150rpx);
                    display: flex;

                    .production_avatar {
                        margin-right: 20rpx;

                        .user_avatar {
                            width: 160rpx;
                            height: 160rpx;
                            border-radius: 20rpx;
                        }
                    }

                    .production_detail {
                        display: flex;
                        flex-direction: column;
                    }
                }

                .production_static {
                    width: 150rpx;
                    margin-left: 20rpx;
                    text-align: right;

                    .production_num {
                        font-size: 12px;
                        color: #999;
                    }
                }

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }

        .order_remark,
        .order_total {
            padding: 30rpx 0;
            border-bottom: 1px dashed #ccc;
            display: flex;
            justify-content: space-between;
            color: #666;

            .title {
                width: 160rpx;
                margin-right: 60rpx;
            }

            .content {
                text-align: right;
                width: calc(100% - 100rpx);
                line-height: 30rpx;

                .total_price_title,
                .total_price {
                    display: inline-block;
                }

                .total_price_title {
                    margin-right: 20rpx;
                }

                .total_price {
                    font-size: 16px;
                    color: #333;
                    font-weight: 700;
                }
            }
        }

        .order_total {
            border-bottom: none;
        }
    }

    .order_time {
        padding: 20rpx;
        border-radius: 20rpx;
        background-color: #fff;
        color: #666;
        font-size: 12px;
    }
}
</style>