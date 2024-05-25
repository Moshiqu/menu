<template>
    <view class="order_detail">
        <!-- 商家或客户信息 -->
        <view class="user_info">
            <image src="/static/image/default_img.jpg" mode="scaleToFill" class="user_avatar" />
            <view class="user_nick_name">大青蛙(小)</view>
        </view>
        <!-- 订单信息 -->
        <view class="order_info">
            <view class="order_id">
                <text>订单编号：****************641</text>
                <text>制作完成</text>
            </view>
            <view class="order_productions">
                <view class="production_item">
                    <view class="production_info">
                        <view class="production_avatar">
                            <image src="/static/image/default_img.jpg" mode="scaleToFill" class="user_avatar" />
                        </view>
                        <view class="production_detail">
                            <view class="production_name">生椰拿铁</view>
                        </view>
                    </view>
                    <view class="production_static">
                        <view class="production_price">
                            <text class="symbol">￥</text>
                            <text>99.9</text>
                        </view>
                        <view class="production_num">
                            <text class="symbol">x</text>
                            <text>1</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="order_remark">
                <view class="title">备注</view>
                <view class="content">这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注这个是备注
                </view>
            </view>
            <view class="order_total">
                <view class="title">共2件商品</view>
                <view class="content">
                    <view class="total_price_title">总价</view>
                    <view class="total_price">￥99.99</view>
                </view>
            </view>
        </view>
        <view class="order_time">
            <view class="time_item">下单时间：2024-05-24 19:33</view>
            <view class="time_item">预约时间：2024-05-24 19:33 立即制作</view>
            <!-- 点击开始制作的时间 -->
            <view class="time_item">制作开始时间：2024-05-24 19:33</view>
            <!-- 点击制作完成的 -->
            <view class="time_item">制作完成时间：2024-05-24 19:33</view>
            <!-- 商家点击取消的时间 -->
            <view class="time_item">订单取消时间：2024-05-24 19:33</view>
            <!-- 客户点击确认完成的时间 -->
            <view class="time_item">确认完成时间：2024-05-24 19:33</view>
        </view>
    </view>
</template>

<script setup>

// TODO 1:写接口; 2:点击商品跳转商品详情页

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
                    width: calc(100% - 100rpx);
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
                    width: 100rpx;
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