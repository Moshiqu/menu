<template>
    <view class="pre_order_page">
        <view class="orders">
            <view class="title">已选</view>
            <view class="productions_detail_items">
                <view class="production_item" v-for="item in orderList" :key="item.id">
                    <view class="production_content">
                        <view class="production_item_img_box">
                            <image src="/static/image/default_img.jpg" mode="scaleToFill" />
                        </view>
                        <view class="production_item_content">
                            <view class="production_name">
                                {{ item.product_name }}
                            </view>
                            <view class="account">x{{ item.selectNum }}</view>
                        </view>
                    </view>
                    <view class="production_item_total_price">
                        ￥{{ (item.selectNum * (item.product_price || 0)).toFixed(2) }}
                    </view>
                </view>
            </view>
        </view>
        <view :class="['make_now', orderMakeTime == 'now' ? 'selected' : '']" @click="orderMakeTime = 'now'">立即制作</view>
        <picker mode="time" :start="moment().format('HH:mm')" end="23:59" @change="bindTimeChange">
            <view :class="['make_time', orderMakeTime == 'now' ? '' : 'selected']" @click="orderMakeTime = 'time'">
                <view class="make_time_title">预约时间</view>
                <view class="make_time_time" :style="{ color: makeTime ? '#333' : '' }">{{ makeTime || '请选择预约时间'
                }}</view>
            </view>
        </picker>
        <view class="order_remark">
            <view class="order_remark_title">备注</view>
            <view class="textarea_box">
                <EasyInput placeholder="请输入内容" autoHeight v-model="remark" :inputBorder="false" type="textarea"
                    placeholderStyle="color:#ccc;font-size:16px;line-height:36rpx;" maxlength="50" :trim="true"
                    customStyle="min-height:36rpx;margin:0;text-align:right;font-size:16px;">
                </EasyInput>
            </view>
            <view class="text_num" slot="right">{{ remark_num }}/50</view>
        </view>
        <view class="confirm_btn" @click="submit">
            <text class="price" v-if="Number(totalPrice)">￥{{ totalPrice }}</text> <text>提交订单</text>
        </view>
    </view>
</template>

<script setup>
import EasyInput from '/components/EasyInput/uni-easyinput.vue'
import moment from 'moment';
import { ref, computed } from 'vue'
import { useMenuStore } from '@/store/menu';

// 购物车数据
const menuStore = useMenuStore()

const orderList = computed(() => {
    return menuStore.cartProductsList
})

const totalPrice = computed(() => {
    return menuStore.cartProductsList.reduce((acc, cur) => {
        return acc + cur.selectNum * cur.product_price
    }, 0).toFixed(2)
})

const remark = ref('')

const remark_num = computed(() => {
    return remark.value.length
})

// 选择时间
const orderMakeTime = ref('now')
const makeTime = ref('')

const bindTimeChange = (e) => {
    makeTime.value = e.target.value
}

// 提交订单
const submit = () => {
    const productsList = []

    if (orderMakeTime.value === 'time' && !makeTime.value) {
        return uni.showToast({
            title: '还未选择预约时间',
            icon: 'none',
            mask: true
        })
    }

    orderList.value.forEach(item => {
        productsList.push([item.id, item.selectNum])
    })

    const param = {
        orderMakeTime: orderMakeTime.value,
        makeTime: orderMakeTime.value === 'time' ? makeTime : undefined,
        remark: remark.value || undefined,
        products: orderList
    }
    // TODO 写订单接口

    console.log(param)
}

</script>

<style scoped lang="less">
.pre_order_page {
    background-color: #f7f8fa;
    padding: 20rpx;
    padding-bottom: 120rpx;
    border-radius: 40rpx;
    min-height: calc(100vh - 120rpx - 20rpx);
    position: relative;

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
        box-sizing: border-box;
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
        position: relative;
        padding-bottom: 50rpx;

        .textarea_box {
            width: 500rpx;
        }

        .text_num {
            position: absolute;
            bottom: 12rpx;
            right: 40rpx;
        }
    }

    .confirm_btn {
        height: 100rpx;
        width: 660rpx;
        background-color: #f6c33d;
        border-radius: 50rpx;
        position: fixed;
        bottom: 100rpx;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 700;

        .price {
            margin-right: 12rpx;
            color: red;
        }
    }

    .selected {
        border: 4rpx solid #f6c33d;
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