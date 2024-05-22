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
                    <view class="order_card">
                        <view class="card_title">
                            <view class="create_time">
                                <text>制作时间：</text>
                                <text>202-05-18 17:41:47</text>
                            </view>
                            <view class="order_status">已下单</view>
                        </view>
                        <view class="card_productions_content">
                            <!-- 缩略信息 -->
                            <view class="productions_items">
                                <scroll-view class="order_content_scroll_bar" scroll-x="true" :enable-flex="true">
                                    <view class="production_item">
                                        <image src="/static/image/default_img.jpg" mode="scaleToFill"
                                            class="production_img" />
                                        <view class="production_name">这个是番茄炖牛肉</view>
                                    </view>
                                    <view class="production_item">
                                        <image src="/static/image/default_img.jpg" mode="scaleToFill"
                                            class="production_img" />
                                        <view class="production_name">这个是番茄炖牛肉</view>
                                    </view>
                                    <view class="production_item">
                                        <image src="/static/image/default_img.jpg" mode="scaleToFill"
                                            class="production_img" />
                                        <view class="production_name">这个是番茄炖牛肉</view>
                                    </view>
                                    <view class="production_item">
                                        <image src="/static/image/default_img.jpg" mode="scaleToFill"
                                            class="production_img" />
                                        <view class="production_name">这个是番茄炖牛肉</view>
                                    </view>
                                    <view class="production_item">
                                        <image src="/static/image/default_img.jpg" mode="scaleToFill"
                                            class="production_img" />
                                        <view class="production_name">这个是番茄炖牛肉</view>
                                    </view>
                                </scroll-view>
                                <view class="card_price_bar">
                                    <view class="total_price">￥10122.30</view>
                                    <view class="total_count">共12件</view>
                                </view>
                            </view>
                            <!-- 全部信息 -->
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
                            <view class="card_abb_btn">
                                <image src="/static/image/common/down.png" mode="scaleToFill" />
                            </view>
                        </view>
                        <view class="card_information">
                            <!-- 如果是饭店订单, 用户信息显示下单人的信息; 如果是个人订单, 用户信息显示菜单所属商户信息 -->
                            <view class="userInfo">
                                <view class="avatar">
                                    <image src="/static/image/default_img.jpg" mode="scaleToFill" />
                                </view>
                                <view class="username">活捉一枚雪</view>
                            </view>
                            <view class="btns">
                                <button class="red_btn" type="default" size="mini" :plain="true">已完成</button>
                                <button class="yellow_btn" type="default" size="mini" :plain="true">删除</button>
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
import { ref, computed, watch } from 'vue'
// TODO 1. 获取所有有订单的日期, 写入到日历中, 点击日历块, 查询当日订单; 2.获取当日饭店订单, 用watch监听tabId, 个人订单同理; 3. 点击展开历史订单, 调用接口获取非当日的订单(近30天内的订单);

// 日历是否缩略
const isAbb = ref(true)

// 日期改变事件
const change = (dateObj) => {
    // console.log(dateObj);
}

// 所选日期
// TODO 未选择日期, 展示所有新订单和历史所有订单
const currentDate = ref('')

const selectedDayList = ref([{ date: '2024-05-17' }, { date: '2024-05-07' }])

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
                                width: 100%;
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