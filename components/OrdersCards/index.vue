<template>
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
                        <view class="production_item" v-for=" product  in  order.orderProducts" :key="product.id">
                            <image src="/static/image/default_img.jpg" mode="scaleToFill" class="production_img" />
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
                    <view class="username">{{ orderType == 1 ? order.consumerInfo.nick_name :
                        order.ownerInfo.nick_name }}</view>
                </view>
                <view class="btns" v-if="showOperation && orderType == 1">
                    <button class="red_btn" type="default" size="mini" :plain="true" v-if="order.order_status == 1"
                        @click="btnHandlerByOwner(order)">开始制作</button>
                    <button class="red_btn" type="default" size="mini" :plain="true" v-else-if="order.order_status == 2"
                        @click="btnHandlerByOwner(order)">制作完成</button>

                    <button class="yellow_btn" type="default" size="mini" :plain="true"
                        v-if="order.order_status == 1 || order.order_status == 2"
                        @click="btnHandlerByOwner(order, true)">取消订单</button>
                </view>

                <view class="btns" v-else-if="showOperation && orderType == 2">
                    <button class="yellow_btn" type="default" size="mini" :plain="true" v-if="order.order_status == 3"
                        @click="btnHandlerByConsumer(order)">确认完成</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { orderStatus } from '/utils/statusMap'


const $props = defineProps({
    //订单列表
    orderList: { type: Array, default: () => [] },
    // 订单类型 1: 饭店订单; 2: 个人订单
    orderType: { type: Number, default: 1 },
    // 是否显示操作按钮
    showOperation: { type: Boolean, default: false }
})

const $emits = defineEmits('btnHandlerByOwner', 'btnHandlerByOwner')


const orderStatusMap = orderStatus()

const btnHandlerByOwner = (order, flag) => {
    $emits('btnHandlerByOwner', order, flag)
}

const btnHandlerByConsumer = (order, flag) => {
    $emits('btnHandlerByConsumer', order, flag)
}

</script>

<style scoped lang="less">
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
</style>