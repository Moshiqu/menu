<template>
    <view class="pre_order_page">
        <view class="orders">
            <view class="title">已选</view>
            <view class="productions_detail_items">
                <view class="production_item">
                    <view class="production_content">
                        <view class="production_item_img_box">
                            <image src="/static/image/default_img.jpg" mode="scaleToFill" />
                        </view>
                        <view class="production_item_content">
                            <view class="production_name">
                                这个是番茄炖牛肉
                            </view>
                            <view class="account">x1</view>
                        </view>
                    </view>
                    <view class="production_item_total_price">
                        ￥10122
                    </view>
                </view>
                <view class="production_item">
                    <view class="production_content">
                        <view class="production_item_img_box">
                            <image src="/static/image/default_img.jpg" mode="scaleToFill" />
                        </view>
                        <view class="production_item_content">
                            <view class="production_name">
                                这个是番茄炖牛肉
                            </view>
                            <view class="account">x1</view>
                        </view>
                    </view>
                    <view class="production_item_total_price">
                        ￥10122
                    </view>
                </view>
                <view class="production_item">
                    <view class="production_content">
                        <view class="production_item_img_box">
                            <image src="/static/image/default_img.jpg" mode="scaleToFill" />
                        </view>
                        <view class="production_item_content">
                            <view class="production_name">
                                这个是番茄炖牛肉
                            </view>
                            <view class="account">x1</view>
                        </view>
                    </view>
                    <view class="production_item_total_price">
                        ￥10122
                    </view>
                </view>
            </view>
        </view>
        <view class="make_now selected">立即制作</view>
        <view class="make_time">
            <view class="make_time_title">预约时间</view>
            <view class="make_time_time">请选择预约时间</view>
        </view>
        <view class="order_remark">
            <view class="order_remark_title">备注</view>
            <view class="textarea_box">
                <EasyInput placeholder="请输入内容" autoHeight v-model="remark" :inputBorder="false" type="textarea"
                    placeholderStyle="color:#ccc;font-size:16px;line-height:36rpx;" maxlength="50" :trim="true"
                    customStyle="min-height:36rpx;margin:0;text-align:right;font-size:16px;">
                </EasyInput>
            </view>
        </view>
        <view class="confirm_btn"></view>
    </view>
</template>

<script setup>
import EasyInput from '/components/EasyInput/uni-easyinput.vue'
import { ref } from 'vue'

// TODO 备注显示最大输入字符数50, 检查 为什么备注的高度不对

const remark = ref('')

</script>

<style scoped lang="less">
.pre_order_page {
    background-color: #f7f8fa;
    padding: 20rpx;
    padding-bottom: 120rpx;
    border-radius: 40rpx;
    min-height: 100vh;


    .orders {
        background-color: #fff;
        padding: 20rpx;

        .title {
            height: 100rpx;
            line-height: 100rpx;
            color: #7d6566;
            border-bottom: 2rpx solid #f5f6f7;
        }

        .productions_detail_items {
            .production_item {
                height: 160rpx;
                margin-top: 16rpx;
                display: flex;
                justify-content: space-between;
                font-size: 14px;

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
    }

    .make_now,
    .make_time {
        height: 100rpx;
        background-color: #fff;
        border-radius: 20rpx;
        padding: 0 40rpx;
        line-height: 100rpx;
        color: #7d6566;

        margin-top: 40rpx;
    }

    .make_time {
        display: flex;
        justify-content: space-between;

        .make_time_time {
            color: #ccc;
        }
    }

    .order_remark {
        min-height: 100rpx;
        height: auto;
        display: flex;
        justify-content: space-between;
        background-color: #fff;
        border-radius: 20rpx;
        color: #7d6566;
        padding: 20rpx 40rpx;
        align-items: center;

        margin-top: 40rpx;

        .textarea_box {
            width: 500rpx;
        }
    }

    .selected {
        border: 4rpx solid #f6c33d;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;

        &::after {
            content: " ";
            position: absolute;
            background: url('/static/image/order/icon_selected.png') no-repeat center;
            width: 40rpx;
            height: 40rpx;
            top: 0;
            right: 0;
            background-color: #f6c33d;
            border-bottom-left-radius: 16rpx;
        }
    }
}
</style>